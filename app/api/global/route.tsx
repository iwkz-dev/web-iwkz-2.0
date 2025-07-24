import { NextResponse } from 'next/server';

export async function GET() {
    const res = await fetch(`${process.env.IWKZ_API_URL}/global`, {
        cache: 'no-store',
        headers: {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
    });

    if (!res.ok) {
        return NextResponse.json({ error: 'Failed to fetch global content' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
}
