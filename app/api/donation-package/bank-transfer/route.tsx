import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(
    `${process.env.IWKZ_API_URL}/donation-package/bank-transfer`,
    {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Failed to record bank transfer' },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
