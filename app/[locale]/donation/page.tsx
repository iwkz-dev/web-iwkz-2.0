'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchDonationPackages } from '@/lib/donation-api';
import { DonationList } from '@/components/donationList/donationList';
import { CheckoutDrawer } from '@/components/checkoutDrawer/checkoutDrawer';
import { DonationPackageData } from '@/types/donationApi';
import LoadingPage from '@/components/loadingPage/loadingPage';

export default function Home() {
  const params = useParams();
  const locale = params.locale as string;

  const [data, setData] = useState<DonationPackageData | null>(null);
  const [globalContent, setGlobalContent] = useState<any>(null);
  const [translations, setTranslations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDonationPackages = async () => {
      try {
        setLoading(true);
        const [donationRes, globalRes] = await Promise.all([
          fetchDonationPackages(),
          fetch(`/api/global?locale=${locale}`).then((res) => res.json()),
        ]);
        setData(validateDonationPackages(donationRes.data));
        setGlobalContent(globalRes);

        // Extract translations from global content
        const translationsData = globalRes.data?.translations || {};
        setTranslations(translationsData);

        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(
          "We couldn't load the donation packages. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (locale) {
      loadDonationPackages();
    }
  }, [locale]);

  const validateDonationPackages = (
    data: DonationPackageData
  ): DonationPackageData => {
    return {
      ...data,
      donationPackages:
        data.donationPackages.filter(
          ({ published, endDate }) => published && isDonationNotExpired(endDate)
        ) || [],
    };
  };

  const isDonationNotExpired = (dateStr: string | null): boolean => {
    if (!dateStr) return true;

    const endDate = new Date(dateStr);

    return endDate >= new Date();
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !data || !globalContent || !translations) {
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
