import { useContext } from 'react';
import { LangContext } from './langContextObject';

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang doit être utilisé à l\'intérieur de <LangProvider>');
  return ctx;
}
