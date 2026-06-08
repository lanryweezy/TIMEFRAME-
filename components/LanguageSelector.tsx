import React from 'react';
import { useI18n, Language } from '../i18n';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, availableLanguages, t } = useI18n();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono text-zinc-500 hover:text-white transition-colors rounded hover:bg-white/5"
        aria-label={t('nav.settings')}
        title={t('nav.settings')}
      >
        <Globe className="w-3 h-3" />
        <span className="uppercase">{language}</span>
      </button>

      <div className="absolute top-full right-0 mt-1 py-1 bg-studio-panel border border-studio-border rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[120px]">
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full px-3 py-1.5 text-left text-[10px] font-mono transition-colors hover:bg-white/5 ${
              language === lang.code ? 'text-studio-accent' : 'text-zinc-400'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
