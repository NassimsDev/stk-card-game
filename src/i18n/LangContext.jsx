import { useState, useCallback, useEffect } from 'react';
import { strings } from './strings';
import { preloadCardImages } from './preloadCardImages';
import { LangContext } from './langContextObject';

function getInitialLang() {
  if (typeof window === 'undefined') return 'fr';
  const saved = localStorage.getItem('stk-lang');
  return saved === 'en' ? 'en' : 'fr';
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  // Une fois la langue affichée au démarrage bien chargée, on précharge en
  // tâche de fond les images de l'AUTRE langue (pendant un temps mort du
  // navigateur, pour ne pas ralentir le chargement initial) — comme ça, le
  // toggle FR/EN est instantané la première fois qu'on l'utilise, sans
  // attendre le téléchargement des images.
  useEffect(() => {
    const otherLang = lang === 'en' ? 'fr' : 'en';
    const schedule = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 2000));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const id = schedule(() => preloadCardImages(otherLang));
    return () => cancel(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // volontairement une seule fois — la langue "de départ" ne change pas

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
