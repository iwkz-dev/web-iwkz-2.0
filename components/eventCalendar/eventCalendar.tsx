import React from 'react';
import FadeInOnScroll from '../ui/fadeInScroll';
import { IActivityCategoryComponent } from '@/types/page.types';

interface EventCalendarProps {
  eventCalendarContent: IActivityCategoryComponent;
}

export default function EventCalendar({
  eventCalendarContent,
}: EventCalendarProps) {
  const { title, content } = eventCalendarContent;

  return (
    <section
      id="event-calendar"
      className="relative min-h-dvh bg-primary-foreground px-4 py-30 font-questrial flex flex-col items-center justify-center"
      style={{ backgroundColor: '#e9eef6' }}
    >
      <FadeInOnScroll>
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-4xl">{title}</h2>
        </div>
      </FadeInOnScroll>
      <div className="w-full max-w-5xl h-screen">
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="w-full h-full rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        />
      </div>
    </section>
  );
}
