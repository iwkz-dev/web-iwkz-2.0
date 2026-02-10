import {
  Briefcase,
  Building2,
  Calendar,
  GraduationCap,
  MoonStar,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { IHistoriesComponent } from '@/types/page.types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { DotPattern } from './ui/dot-pattern';
import { cn } from '@/lib/utils';

const experiences = [
  {
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    period: '2023 - Present',
    description:
      'Led the development of enterprise-scale web applications, mentored junior developers, and implemented best practices for code quality and performance optimization.',
    technologies: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
  },
  {
    title: 'Full Stack Developer',
    company: 'Digital Innovations Inc',
    period: '2021 - 2023',
    description:
      'Developed and maintained multiple client projects, implemented responsive designs, and integrated third-party APIs for enhanced functionality.',
    technologies: ['React', 'Express.js', 'PostgreSQL', 'Docker', 'Redis'],
  },
  {
    title: 'Frontend Developer',
    company: 'WebTech Studios',
    period: '2018 - 2021',
    description:
      'Created responsive and interactive user interfaces, collaborated with designers, and optimized application performance.',
    technologies: ['React', 'JavaScript', 'SASS', 'Webpack', 'Jest'],
  },
];

export default function Timeline({
  timelineData,
}: {
  timelineData: IHistoriesComponent;
}) {
  return (
    <div className="relative py-16 px-4">
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]'
        )}
      />
      <p className="text-center font-bold text-lg mb-14">
        {timelineData.headline}
      </p>
      <div className="relative max-w-4xl mx-auto p-4">
        <Separator
          orientation="vertical"
          className="absolute left-1/2 h-full transform -translate-x-1/2"
        />

        {timelineData.historyLine.map(
          ({ id, year, headline, content, image }, index) => (
            // <BlurFade key={index} delay={0.25 + index * 0.05} inView>
            <div
              key={index}
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
                  <p className="text-base text-muted-foreground">{year}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-base ">{content}</p>
                </CardContent>
              </Card>
            </div>
            // </BlurFade>
          )
        )}
      </div>
    </div>
  );
}
