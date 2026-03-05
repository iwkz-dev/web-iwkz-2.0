import { NextResponse } from 'next/server';

export async function GET() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const ramadanUrl =
    process.env.JADWAL_SHALAT_RAMADAN_URL ||
    process.env.NEXT_PUBLIC_JADWAL_SHALAT_RAMADAN_URL ||
    null;

  const paypalHostId = isDevelopment
    ? process.env.PAYPAL_HOST_ID_DEV ||
      process.env.NEXT_PUBLIC_PAYPAL_HOST_ID_DEV ||
      ''
    : process.env.PAYPAL_HOST_ID ||
      process.env.NEXT_PUBLIC_PAYPAL_HOST_ID ||
      '';

  const paypalUrl = isDevelopment
    ? process.env.PAYPAL_SANDBOX_URL ||
      process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_URL ||
      ''
    : process.env.PAYPAL_PRODUCTION_URL ||
      process.env.NEXT_PUBLIC_PAYPAL_PRODUCTION_URL ||
      '';

  return NextResponse.json({
    ramadanUrl,
    paypalHostId,
    paypalUrl,
    isDevelopment,
  });
}
