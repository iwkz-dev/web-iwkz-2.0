import Link from 'next/link';
import Image from 'next/image';

import { INavbar } from '@/types/globalContent.types';

interface IHeaderLogoProps {
  logo: INavbar['logo'];
  localePrefix: string;
}

export default function HeaderLogo({ logo, localePrefix }: IHeaderLogoProps) {
  return (
    <Link href={localePrefix} className="flex items-center gap-2.5 group">
      {logo.image?.url && (
        <div className="relative w-8 h-8 shrink-0 transition-transform duration-200 group-hover:scale-105">
          <Image
            src={logo.image.url}
            alt={logo.image.alternativeText || 'IWKZ logo'}
            fill
            className="object-contain"
            priority
          />
        </div>
      )}
      <span className="text-lg font-bold tracking-tight">
        {logo.iwkz || 'IWKZ e.V.'}
      </span>
    </Link>
  );
}
