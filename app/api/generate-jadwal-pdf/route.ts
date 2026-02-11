
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

// Set locale to Indonesian
dayjs.locale('id');

export async function POST(req: NextRequest) {
    try {
        const { month, year } = await req.json();

        if (!month || !year) {
            return NextResponse.json(
                { error: 'Month and year are required' },
                { status: 400 }
            );
        }

        // Endpoint: ${process.env.IWKZ_API_URL}/jadwalshalat?month={month}&year={year}
        const apiUrl = `${process.env.IWKZ_API_URL}/jadwalshalat?month=${month}&year=${year}`;
        const res = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error('Failed to fetch prayer times:', res.status, res.statusText);
            return NextResponse.json(
                { error: 'Failed to fetch prayer times from external API' },
                { status: 500 }
            );
        }

        const prayerData = await res.json();

        // Prepare data for template
        const monthIndex = parseInt(month) - 1;
        const dateObj = dayjs().year(parseInt(year)).month(monthIndex).date(1);
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
        const templatePath = path.join(process.cwd(), 'lib/templates/jadwal-shalat.hbs');
        const templateHtml = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(templateHtml);

        const html = template({
            monthLabel,
            year,
            hijriahMonthLabel,
            hijriahYearLabel,
            data: prayerData,
        });

        // Launch puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px',
            },
        });

        await browser.close();

        // Return generated PDF
        return new NextResponse(pdfBuffer as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="jadwal-shalat-${month}-${year}.pdf"`,
            },
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
