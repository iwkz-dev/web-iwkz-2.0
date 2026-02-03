"use client";

import { useEffect, useState } from "react";
import PrayerTimesCard from "@/components/prayerTimesCard/prayerTimesCard";
import Hero from "@/components/hero/hero";
//import PRS from "@/components/prs/prs";
import OurServices from "@/components/ourServices/ourServices";
//import Events from "@/components/events/events";
import ContactFooter from "@/components/contactFooter/contactFooter";
import Header from "@/components/header/header";
//import News from "@/components/news/news";
import LoadingPage from "@/components/loadingPage/loadingPage";
import { IPageResponse } from "@/types/page.types";
import { IPrayerTimes } from "@/types/prayerTimes.types";
import { IGlobalContent } from "@/types/globalContent.types";

export default function Home() {
  const [prayerTimeData, setPrayerTimeData] = useState<IPrayerTimes | null>(
    null,
  );
  const [pageData, setPageData] = useState<IPageResponse | null>(null);
  const [globalContent, setGlobalContent] = useState<IGlobalContent | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prayerRes, pageRes, globalRes] = await Promise.all([
          fetch("/api/prayer-time"),
          fetch("/api/pages"),
          fetch("/api/global"),
        ]);

        const [prayerJson, pageJson, globalJson] = await Promise.all([
          prayerRes.json(),
          pageRes.json(),
          globalRes.json(),
        ]);

        setPrayerTimeData(prayerJson);
        setPageData(pageJson);
        setGlobalContent(globalJson);
      } catch (err) {
        console.error("Failed to fetch one or more resources:", err);
      }
    };

    fetchData();
  }, []);

  if (!prayerTimeData || !pageData || !globalContent) {
    return <LoadingPage />;
  }

  const navbarOnlyHome: typeof globalContent.data.navbar = {
    ...globalContent.data.navbar,
    left_navbar_items: [
      { id: 1, text: "Home", url: "#hero", target: null },
      { id: 3, text: "Layanan", url: "#services", target: null },
      { id: 4, text: "Kontak", url: "#contact", target: null },
    ],
  };

  return (
    <div>
      <Header headerContent={navbarOnlyHome} />
      <PrayerTimesCard prayerTimes={prayerTimeData} />
      <Hero heroContent={pageData?.data[0]!} />
      <OurServices ourServicesContent={pageData?.data[0]!} />
      <ContactFooter contactFooterContent={globalContent?.data.footer!} />
    </div>
  );
}
