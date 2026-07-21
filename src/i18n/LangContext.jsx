import { useState, useCallback, useEffect } from 'react';
import { strings } from './strings';
import { preloadCardImages } from './preloadCardImages';
import { LangContext } from './langContextObject';

// Ordre de cycle du bouton unique : fr -> en -> tr -> fr ...
const LANG_CYCLE = ['fr', 'en', 'tr'];

function getInitialLang() {
  if (typeof window === 'undefined') return 'fr';
  const saved = localStorage.getItem('stk-lang');
  return LANG_CYCLE.includes(saved) ? saved : 'fr';
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  // Une fois la langue affichée au démarrage bien chargée, on précharge en
  // tâche de fond les images des AUTRES langues (pendant un temps mort du
  // navigateur, pour ne pas ralentir le chargement initial) — comme ça, le
  // bouton de cycle FR/EN/TR est instantané dès la première utilisation,
  // sans attendre le téléchargement des images.
  useEffect(() => {
    const otherLangs = LANG_CYCLE.filter(l => l !== lang);
    const schedule = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 2000));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const ids = otherLangs.map(l => schedule(() => preloadCardImages(l)));
    return () => ids.forEach(cancel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // volontairement une seule fois — la langue "de départ" ne change pas

  const setLang = useCallback((next) => {
    setLangState(next);
    if (typeof window !== 'undefined') localStorage.setItem('stk-lang', next);
  }, []);

  const toggleLang = useCallback(() => {
    const next = LANG_CYCLE[(LANG_CYCLE.indexOf(lang) + 1) % LANG_CYCLE.length];
    setLang(next);
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
