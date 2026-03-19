import React, { createContext, useContext, useState, useCallback } from 'react';
import { getLocales } from 'expo-localization';
import { translations, Language, TranslationKey } from './translations';

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

function detectLanguage(): Language {
  try {
    const locales = getLocales();
    const code = locales[0]?.languageCode ?? 'en';
    return code === 'fr' ? 'fr' : 'en';
  } catch {
    return 'en';
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(detectLanguage);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string>) => {
      let text: string = translations[lang][key] ?? translations.en[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          text = text.replace(`{{${k}}}`, v);
        });
      }
      return text;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
