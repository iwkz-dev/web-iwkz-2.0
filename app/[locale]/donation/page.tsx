import { DonationList } from '@/components/donationList/donationList';
import { CheckoutDrawer } from '@/components/checkoutDrawer/checkoutDrawer';
import {
  DonationPackageData,
  DonationPackageResponse,
} from '@/types/donationApi';
import { fetchStrapiData } from '@/lib/fetch-strapi-data';
import { validateDonationPackages } from '@/lib/donation-utils';

export const revalidate = 300;

export default async function Home() {
  let data: DonationPackageData | null = null;
  let error: string | null = null;

  try {
    const donationRes = (await fetchStrapiData('/donation-package', {
      revalidate,
    })) as DonationPackageResponse | undefined;

    if (!donationRes?.data) {
      error = "We couldn't load the donation packages. Please try again later.";
    } else {
      data = validateDonationPackages(donationRes.data);
    }
  } catch (err) {
    console.error('Failed to fetch donation data:', err);
    error = "We couldn't load the donation packages. Please try again later.";
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="mb-4 text-5xl">😔</div>
          <h1 className="text-xl font-bold text-gray-800">
            Oops, something went wrong
          </h1>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <DonationList donationData={data} />
      <CheckoutDrawer />
    </>
  );
}
