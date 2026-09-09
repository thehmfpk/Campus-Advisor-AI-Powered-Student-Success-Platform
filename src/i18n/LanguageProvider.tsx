import { createContext, useContext, type ReactNode } from 'react';
import { TRANSLATIONS } from './translations';

/**
 * English-only i18n shim. The multi-language switcher was removed; this keeps
 * the `t()` API so existing components compile unchanged, always returning
 * English (falling back to the key).
 */
interface LanguageContextValue {
  t: (key: string, fallback?: string) => string;
}

const en = TRANSLATIONS.en;

const value: LanguageContextValue = {
  t: (key, fallback) => en[key] ?? fallback ?? key,
};

const LanguageContext = createContext<LanguageContextValue>(value);

export function LanguageProvider({ children }: { children: ReactNode }) {
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n(): LanguageContextValue {
  return useContext(LanguageContext);
}
