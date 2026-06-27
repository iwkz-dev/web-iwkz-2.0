import { useTranslations } from 'next-intl';
import MosqueIcon from '@/assets/icons/MosqueIcon';

interface SolatJumatBadgeProps {
  isFriday: boolean;
}

export default function SolatJumatBadge({ isFriday }: SolatJumatBadgeProps) {
  const t = useTranslations('prayerTimesCard');

  if (isFriday) {
    return (
      <div className="flex justify-center">
        <div className="inline-flex flex-col items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium">
          <div className="flex items-center gap-2">
            <MosqueIcon />
            <span>{t('solatJumat')}</span>
          </div>
        </div>
      </div>
    );
  }

  return <p className="text-center text-sm text-gray-700">{t('solatJumat')}</p>;
}
