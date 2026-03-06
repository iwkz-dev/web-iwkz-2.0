import { google } from 'googleapis';
import { Readable } from 'stream';

const CACHE_FOLDER_ID = process.env.CACHE_FOLDER_ID;

function getDriveClient() {
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY ?? '';
  // Strip surrounding quotes if present (some .env loaders keep them)
  privateKey = privateKey.replace(/^["']|["']$/g, '');
  // Convert literal \n to real newlines
  privateKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  return google.drive({ version: 'v3', auth });
}

function getCacheFileName(month: number, year: number): string {
  const mm = String(month).padStart(2, '0');
  return `${year}_${mm}.pdf`;
}

/**
 * Search for a cached PDF in the Drive folder.
 * Returns the file ID if found, null otherwise.
 */
async function findCachedFile(fileName: string): Promise<string | null> {
  const drive = getDriveClient();
  const escapedName = fileName.replace(/'/g, "\\'");
  const res = await drive.files.list({
    q: `name='${escapedName}' and '${CACHE_FOLDER_ID}' in parents and trashed=false`,
    fields: 'files(id)',
    pageSize: 1,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  return res.data.files?.[0]?.id ?? null;
}

/**
 * Download a file from Drive by ID, returned as a Buffer.
 */
async function downloadFile(fileId: string): Promise<Buffer> {
  const drive = getDriveClient();
  const res = await drive.files.get(
    { fileId, alt: 'media', supportsAllDrives: true },
    { responseType: 'stream' }
  );

  const chunks: Buffer[] = [];
  const stream = res.data as unknown as Readable;
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

/**
 * Upload a PDF buffer to the cache folder on Drive.
 */
async function uploadFile(fileName: string, pdfBuffer: Buffer): Promise<void> {
  const drive = getDriveClient();
  await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [CACHE_FOLDER_ID!],
    },
    media: {
      mimeType: 'application/pdf',
      body: Readable.from(pdfBuffer),
    },
    fields: 'id',
    supportsAllDrives: true,
  });
}

// In-flight generation promises keyed by "year_month"
const inflightGenerations = new Map<string, Promise<Buffer>>();

/**
 * Get a PDF for the given month/year, using Drive as a cache layer.
 * `generateFn` is called only when no cached version exists.
 * Concurrent requests for the same key share a single generation promise.
 * If any Drive operation fails, falls back to direct generation.
 */
export async function getCachedOrGenerate(
  month: number,
  year: number,
  generateFn: () => Promise<Buffer>
): Promise<Buffer> {
  const fileName = getCacheFileName(month, year);
  const cacheKey = `${year}_${month}`;

  // Skip caching entirely if folder ID is not configured
  if (!CACHE_FOLDER_ID) {
    console.warn('[DriveCache] CACHE_FOLDER_ID not set, skipping cache');
    return generateFn();
  }

  // 1. Try to serve from Drive cache
  try {
    const fileId = await findCachedFile(fileName);
    if (fileId) {
      console.log(`[DriveCache] Cache hit for ${fileName}`);
      return await downloadFile(fileId);
    }
  } catch (err) {
    console.error(
      '[DriveCache] Error checking/downloading cache, falling back to generation:',
      err
    );
    return generateFn();
  }

  // 2. Cache miss — generate with concurrency control
  console.log(`[DriveCache] Cache miss for ${fileName}, generating...`);

  const existing = inflightGenerations.get(cacheKey);
  if (existing) {
    console.log(`[DriveCache] Joining in-flight generation for ${fileName}`);
    return existing;
  }

  const generationPromise = (async () => {
    try {
      const pdfBuffer = await generateFn();

      // Upload to Drive in the background — don't block the response
      uploadFile(fileName, pdfBuffer).catch((uploadErr) => {
        console.error('[DriveCache] Failed to upload to cache:', uploadErr);
      });

      return pdfBuffer;
    } finally {
      inflightGenerations.delete(cacheKey);
    }
  })();

  inflightGenerations.set(cacheKey, generationPromise);
  return generationPromise;
}
