import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fr } from "../../../mobile/src/translations";
import { languageDetectorPlugin } from "../../../mobile/src/utils/languagedetector";

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

i18n
  .use(initReactI18next)
  .use(languageDetectorPlugin)
  .init({
    compatibilityJSON: "v3",
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
