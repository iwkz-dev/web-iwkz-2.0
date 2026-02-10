import { MoonStar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { IHistoriesComponent } from '@/types/page.types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import FadeInOnScroll from './ui/fadeInScroll';

export default function Timeline({
  timelineData,
}: {
  timelineData: IHistoriesComponent;
}) {
  return (
    <section
      id="timeline"
      className="relative min-h-dvh bg-secondary px-6 py-20 font-questrial flex flex-col items-center justify-center"
    >
      <FadeInOnScroll>
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
          {/* Cloudy/Foggy Background */}
          <h2 className="text-4xl">{timelineData.headline}</h2>
          <p className="max-w-2xl mx-auto">{timelineData.subHeadline}</p>
          <div className="relative max-w-4xl mx-auto p-4">
            <Separator
              orientation="vertical"
              className="absolute left-1/2 h-full transform -translate-x-1/2"
            />

            {timelineData.historyLine.map(
              ({ id, year, headline, content, image }, index) => (
                <FadeInOnScroll key={index}>
                  <div
                    className={`flex flex-col md:flex-row ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    } gap-8 mb-8`}
                  >
                    <div className="flex-1 md:w-1/2"></div>
                    <div className="flex items-center justify-center">
                      <Badge
                        variant="outline"
                        className="w-fit h-fit p-3 rounded-full z-10 bg-primary-foreground"
                      >
                        <MoonStar className="h-6 w-6" />
                      </Badge>
                    </div>
                    <Card className="flex-1 md:w-1/2 z-10">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                          {headline}
                        </CardTitle>
                        <p className="italic text-lg">{headline}</p>
                        <p className="text-base text-muted-foreground">
                          {year}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-base ">{content}</p>
                      </CardContent>
                    </Card>
                  </div>
                </FadeInOnScroll>
              )
            )}
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
