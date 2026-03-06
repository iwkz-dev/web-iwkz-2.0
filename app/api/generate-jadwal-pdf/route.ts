import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Browser } from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { getCachedOrGenerate } from '@/lib/driveCache';

// Set locale to Indonesian
dayjs.locale('id');

/**
 * Generate a PDF buffer for the given month/year.
 * This is the core generation logic, extracted so it can be wrapped by the cache layer.
 */
async function generateJadwalShalat(
  monthNum: number,
  yearNum: number
): Promise<Buffer> {
  let browser: Browser | null = null;

  try {
    const apiUrl = `${process.env.IWKZ_API_URL}/jadwalshalat?month=${monthNum}&year=${yearNum}`;
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.error(
        '[PDF] Failed to fetch prayer times:',
        res.status,
        res.statusText
      );
      throw new Error(`Failed to fetch prayer times: ${res.status}`);
    }

    const prayerData = await res.json();

    // Prepare data for template
    const monthIndex = monthNum - 1;
    const dateObj = dayjs().year(yearNum).month(monthIndex).date(1);
    const monthLabel = dateObj.format('MMMM');

    let hijriahMonthLabel = '';
    let hijriahYearLabel = '';

    if (Array.isArray(prayerData) && prayerData.length > 0) {
      const hijriMonths = new Set<string>();
      const hijriYears = new Set<number>();

      prayerData.forEach((d: any) => {
        if (d.hijriahMonth) hijriMonths.add(d.hijriahMonth);
        if (d.hijriahYear) hijriYears.add(d.hijriahYear);
      });

      hijriahMonthLabel = Array.from(hijriMonths).join(' - ');
      hijriahYearLabel = Array.from(hijriYears).join(' / ');
    }

    // Load template
    const templatePath = path.join(
      process.cwd(),
      'lib/templates/jadwal-shalat.hbs'
    );
    if (!fs.existsSync(templatePath)) {
      console.error('[PDF] Template file not found at:', templatePath);
      throw new Error('PDF template not found on server');
    }

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateHtml);

    const html = template({
      monthLabel,
      year: yearNum,
      hijriahMonthLabel,
      hijriahYearLabel,
      data: prayerData,
    });

    // Launch puppeteer with timeouts
    browser = await puppeteer.launch({
      headless: true,
      protocolTimeout: 30000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
        '--single-process',
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(15000);
    await page.setJavaScriptEnabled(false);
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      timeout: 15000,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    await browser.close();
    browser = null;

    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('[PDF] Error closing browser:', closeError);
      }
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const monthNum = parseInt(body.month, 10);
    const yearNum = parseInt(body.year, 10);

    // Strict validation: must be valid integers within expected ranges
    if (
      isNaN(monthNum) ||
      isNaN(yearNum) ||
      monthNum < 1 ||
      monthNum > 12 ||
      yearNum < 2020 ||
      yearNum > 9999
    ) {
      return NextResponse.json(
        { error: 'Invalid month or year' },
        { status: 400 }
      );
    }

    const pdfBuffer = await getCachedOrGenerate(monthNum, yearNum, () =>
      generateJadwalShalat(monthNum, yearNum)
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="jadwal-shalat-${monthNum}-${yearNum}.pdf"`,
      },
    });
  } catch (error) {
    console.error('[PDF] Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
