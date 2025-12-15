import { createContext, useState } from 'react';
import fr from '../lang/fr.json';
import en from '../lang/en.json';

interface ILanguageContext {
  locale: string;
  messages: Record<string, string>;
  setLanguage: (lang: string) => void;
}

export const LanguageContext = createContext<ILanguageContext>({
  locale: 'fr',
  messages: fr,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState('fr');
  const [messages, setMessages] = useState(fr);

  function setLanguage(lang: string) {
    setLocale(lang);
    setMessages(lang === 'fr' ? fr : en);
  }

  return (
    <LanguageContext.Provider value={{ locale, messages, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
