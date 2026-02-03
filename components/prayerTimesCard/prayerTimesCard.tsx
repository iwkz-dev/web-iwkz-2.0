"use client";

import React, { useEffect, useRef, useState } from "react";
import { IPrayerTimes } from "@/types/prayerTimes.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import duration from "dayjs/plugin/duration";
import { Clock } from "lucide-react";

dayjs.extend(duration);

const PRAYER_LABELS = {
  subuh: "Subuh",
  dzuhur: "Dzuhur",
  ashr: "Ashr",
  maghrib: "Maghrib",
  isya: "Isya",
};

type PrayerKey = keyof typeof PRAYER_LABELS;

const PRAYER_ORDER: PrayerKey[] = [
  "subuh",
  "dzuhur",
  "ashr",
  "maghrib",
  "isya",
];

export default function PrayerTimesCard({
  prayerTimes,
}: {
  prayerTimes: IPrayerTimes | null;
}) {
  if (!prayerTimes) {
    return (
      <section className="py-8 px-4 bg-white">
        <Card className="container mx-auto max-w-6xl border text-card-foreground shadow-2xs bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <p className="text-red-500">Prayer times data is not available.</p>
          </CardHeader>
        </Card>
      </section>
    );
  }

  const [currentTime, setCurrentTime] = useState(dayjs());
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  function getCurrentPrayerKey(
    times: Record<PrayerKey, string>,
    currentTime: Dayjs,
  ): PrayerKey {
    let current: PrayerKey = "subuh";
    for (const key of PRAYER_ORDER) {
      const [h, m] = times[key].split(":").map(Number);
      const time = dayjs().hour(h).minute(m).second(0);
      if (currentTime.isAfter(time) || currentTime.isSame(time)) {
        current = key;
      }
    }

    return current; // fallback to next day's Subuh
  }

  function getNextPrayerKey(
    times: Record<PrayerKey, string>,
    currentTime: Dayjs,
  ): PrayerKey {
    for (const key of PRAYER_ORDER) {
      const [h, m] = times[key].split(":").map(Number);
      const time = dayjs().hour(h).minute(m).second(0);
      if (currentTime.isBefore(time)) return key;
    }

    return "subuh"; // fallback to next day's Subuh
  }

  function getTimeDiff(toTime: string, currentTime: Dayjs) {
    const [h, m] = toTime.split(":").map(Number);
    let target = dayjs().hour(h).minute(m).second(0);
    if (currentTime.isAfter(target)) {
      target = target.add(1, "day");
    }
    const diff = target.diff(currentTime);
    return dayjs.duration(diff);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentPrayerKey = getCurrentPrayerKey(prayerTimes, currentTime);
  const nextPrayerKey = getNextPrayerKey(prayerTimes, currentTime);
  const countdown = getTimeDiff(prayerTimes[nextPrayerKey], currentTime);

  // Minimal countdown format for "(−hh:mm:ss)"
  const fmtCountdown =
    `${String(countdown.hours()).padStart(2, "0")}:` +
    `${String(countdown.minutes()).padStart(2, "0")}:` +
    `${String(countdown.seconds()).padStart(2, "0")}`;

  // Display order includes muted "terbit" between subuh and dzuhur
  const DISPLAY_ORDER: Array<keyof typeof PRAYER_LABELS | "terbit"> = [
    "subuh",
    "terbit",
    "dzuhur",
    "ashr",
    "maghrib",
    "isya",
  ];

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all"
      >
        <Clock className="w-4 h-4" />
        <span>
          next: {PRAYER_LABELS[nextPrayerKey].toLowerCase()} (-{fmtCountdown})
        </span>
        {isOpen ? (
          <FaChevronDown className="w-3 h-3" />
        ) : (
          <FaChevronUp className="w-3 h-3" />
        )}
      </Button>

      <div
        ref={panelRef}
        className={cn(
          "fixed z-50 bottom-20 right-6 w-[90vw] sm:w-25 transition-transform duration-500",
          isOpen ? "translate-y-0" : "translate-y-[120%]",
        )}
      >
        <Card className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/40">
          <CardHeader className="pb-2">
            <p className="text-center text-base sm:text-lg font-medium tracking-wide text-gray-900">
              {currentTime.format("DD. MMMM YYYY")}
            </p>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              {DISPLAY_ORDER.map((key) => {
                const isTerbit = key === "terbit";
                const isCurrent = !isTerbit && key === currentPrayerKey;
                const isNext = !isTerbit && key === nextPrayerKey;

                const label = isTerbit
                  ? "terbit"
                  : PRAYER_LABELS[key].toLowerCase();
                const time = isTerbit ? prayerTimes.terbit : prayerTimes[key];

                // size tiers
                const containerSize = isCurrent
                  ? "py-6"
                  : isNext
                    ? "py-5"
                    : "py-4";
                const containerScale = isCurrent
                  ? "scale-[1.02]"
                  : isNext
                    ? "scale-[1.01]"
                    : "scale-[0.99]";
                const labelSize = isCurrent
                  ? "text-base"
                  : isNext
                    ? "text-sm"
                    : "text-xs";
                const timeSize = isCurrent
                  ? "text-xl"
                  : isNext
                    ? "text-lg"
                    : "text-sm";

                return (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-5 font-sans backdrop-blur-md transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.10)] will-change-transform",
                      containerSize,
                      containerScale,
                      isCurrent &&
                        "bg-green-200 text-green-900 shadow-[0_0_28px_rgba(74,222,128,0.55)]",
                      isNext &&
                        !isCurrent &&
                        "bg-rose-100 text-rose-900 shadow-[0_6px_18px_rgba(244,114,182,0.22)]",
                      !isCurrent &&
                        !isNext &&
                        !isTerbit &&
                        "bg-gray-100/70 text-gray-800",
                      isTerbit && "bg-gray-200/70 text-gray-800",
                    )}
                  >
                    <span className={cn("tracking-wide", labelSize)}>
                      {label}
                    </span>
                    <div className="flex items-center gap-3">
                      {isCurrent && (
                        <span className="text-xs uppercase tracking-widest text-green-800">
                          NOW
                        </span>
                      )}
                      {isNext && !isCurrent && (
                        <span className="text-xs font-mono text-rose-800">
                          (-{fmtCountdown})
                        </span>
                      )}
                      <span className={cn("font-mono", timeSize)}>{time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>

          <CardFooter className="pb-4 pt-2 flex justify-center">
            <span className="text-[11px] text-gray-700">
              {`${prayerTimes.hijriahDate} ${prayerTimes.hijriahMonth} ${prayerTimes.hijriahYear} H`}
            </span>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
