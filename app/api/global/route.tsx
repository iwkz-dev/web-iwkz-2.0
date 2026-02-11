import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const res = await fetch(
    `${process.env.IWKZ_API_URL}/global?${req.nextUrl.searchParams.toString()}`,
    {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch global content' },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json({
    ...data,
    data: {
      ...data.data,
      jadwalShalatRamadanUrl:
        process.env.NEXT_PUBLIC_JADWAL_SHALAT_RAMADAN_URL ||
        null,
    },
  });
}
