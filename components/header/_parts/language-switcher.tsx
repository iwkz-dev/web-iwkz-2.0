import { CircleFlag } from 'react-circle-flags';

interface ILanguageSwitcherProps {
  availableLocales: [string, { flag: string; label: string }][];
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
  /** 'desktop' renders a pill container; 'mobile' renders flat buttons in a row */
  variant: 'desktop' | 'mobile';
  isLight?: boolean;
}

/** Extract ISO 3166-1 alpha-2 country code from a locale string (e.g. 'de-DE' → 'de') */
function toCountryCode(locale: string): string {
  return locale.split('-')[0].toLowerCase();
}

export default function LanguageSwitcher({
  availableLocales,
  currentLocale,
  onLocaleChange,
  variant,
  isLight,
}: ILanguageSwitcherProps) {
  if (variant === 'desktop') {
    return (
      <div
        className={`flex items-center gap-0.5 ml-3 rounded-full p-0.5 ${
          isLight ? 'bg-gray-100' : 'bg-white/10'
        }`}
      >
        {availableLocales.map(([code]) => (
          <button
            key={code}
            onClick={() => onLocaleChange(code)}
            className={`cursor-pointer p-0.5 rounded-full transition-all duration-150 ${
              currentLocale === code
                ? 'ring-2 ring-green-500'
                : isLight
                  ? 'opacity-50 hover:opacity-100'
                  : 'opacity-50 hover:opacity-100'
            }`}
          >
            <CircleFlag
              countryCode={toCountryCode(code)}
              width={24}
              height={24}
            />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="pt-3 mt-3 border-t border-gray-100 flex gap-2">
      {availableLocales.map(([code]) => (
        <button
          key={code}
          onClick={() => onLocaleChange(code)}
          className={`cursor-pointer p-0.5 rounded-full transition-all duration-150 ${
            currentLocale === code
              ? 'ring-2 ring-green-500'
              : 'opacity-50 hover:opacity-100'
          }`}
        >
          <CircleFlag
            countryCode={toCountryCode(code)}
            width={28}
            height={28}
          />
        </button>
      ))}
    </div>
  );
}
