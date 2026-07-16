import { createContext, useContext, useState, useCallback } from 'react';
import { strings } from './strings';

const LangContext = createContext(null);

function getInitialLang() {
  if (typeof window === 'undefined') return 'fr';
  const saved = localStorage.getItem('stk-lang');
  return saved === 'en' ? 'en' : 'fr';
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((next) => {
    setLangState(next);
    if (typeof window !== 'undefined') localStorage.setItem('stk-lang', next);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'fr' ? 'en' : 'fr');
  }, [lang, setLang]);

  // t() : lit une clé imbriquée ("gameRound.ambiance") dans strings.js pour la langue active.
  const t = useCallback((key) => {
    const value = key.split('.').reduce((obj, part) => obj?.[part], strings[lang]);
    if (value === undefined) {
      console.warn(`Clé de traduction introuvable : ${key}`);
      return key;
    }
    return value;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang doit être utilisé à l\'intérieur de <LangProvider>');
  return ctx;
}
