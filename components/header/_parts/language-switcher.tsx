interface ILanguageSwitcherProps {
  availableLocales: [string, { flag: string; label: string }][];
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
  /** 'desktop' renders a pill container; 'mobile' renders flat buttons in a row */
  variant: 'desktop' | 'mobile';
  isLight?: boolean;
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
        {availableLocales.map(([code, { flag, label }]) => (
          <button
            key={code}
            onClick={() => onLocaleChange(code)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${
              currentLocale === code
                ? 'bg-green-500 text-white shadow-sm'
                : isLight
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-white/70 hover:text-white'
            }`}
          >
            {flag} {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="pt-3 mt-3 border-t border-gray-100 flex gap-2">
      {availableLocales.map(([code, { flag, label }]) => (
        <button
          key={code}
          onClick={() => onLocaleChange(code)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
            currentLocale === code
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
