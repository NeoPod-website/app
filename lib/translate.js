import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import tr from "@/locales/tr.json";
import id from "@/locales/id.json";
import vi from "@/locales/vi.json";

const translations = { en, ar, tr, id, vi };

export function getTranslator(lang = "en") {
  const dict = translations[lang] || translations.en;

  return function t(key) {
    return key.split(".").reduce((acc, part) => acc && acc[part], dict) || key;
  };
}
