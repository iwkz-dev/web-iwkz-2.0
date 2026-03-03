'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchDonationPackages } from '@/lib/donation-api';
import { DonationList } from '@/components/donationList/donationList';
import { CheckoutDrawer } from '@/components/checkoutDrawer/checkoutDrawer';
import { DonationPackageData } from '@/types/donationApi';
import Header from '@/components/header/header';
import ContactFooter from '@/components/contactFooter/contactFooter';
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
        setData(donationRes.data);
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

  const navbarContent = {
    ...globalContent.data?.navbar,
    left_navbar_items: [
      {
        id: 1,
        text: translations.navbar?.home || 'Home',
        url: '/',
        target: null,
      },
      {
        id: 2,
        text: translations.navbar?.services || 'Services',
        url: '/#services',
        target: null,
      },
      {
        id: 3,
        text: translations.navbar?.history || 'History',
        url: '/#timeline',
        target: null,
      },
      {
        id: 4,
        text: translations.navbar?.contact || 'Contact',
        url: '/#contact',
        target: null,
      },
      {
        id: 5,
        text: translations.navbar?.jadwalShalat || 'Jadwal Shalat',
        url: `/jadwal-shalat`,
        target: null,
      },
      {
        id: 6,
        text: translations.navbar?.kalenderKegiatan || 'Kalender Kegiatan',
        url: `/kalender-kegiatan`,
        target: null,
      },
    ],
  };

  console.log(data);

  return (
    <div>
      <Header headerContent={navbarContent} />
      <DonationList donationData={data} />
      <CheckoutDrawer />
      <ContactFooter contactFooterContent={globalContent?.data.footer!} />
    </div>
  );
}
