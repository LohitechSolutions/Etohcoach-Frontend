import i18n from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initReactI18next } from "react-i18next";
import { enus, en, fr, es, pt, it } from "../translations";

const resources: Record<string, { translation: Record<string, string> }> = {
  enus: { translation: enus },
  en: { translation: en },
  English: { translation: en },
  fr: { translation: fr },
  French: { translation: fr },
  Français: { translation: fr },
  es: { translation: es },
  Spanish: { translation: es },
  Español: { translation: es },
  pt: { translation: pt },
  Portuguese: { translation: pt },
  Português: { translation: pt },
  it: { translation: it },
  Italian: { translation: it },
  Italiano: { translation: it },
};

// Initialize i18n synchronously at module level with local resource bundles
i18n.use(initReactI18next).init({
  lng: "enus",
  fallbackLng: "enus",
  compatibilityJSON: "v2",
  resources,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const langaugeFunction = async () => {
  console.log("i18n language function active language:", i18n.language);
  const languename: any = await AsyncStorage.getItem("languename");
  const activeLanguage = languename || "enus";

  // Use language-specific keys to prevent crossover contamination between languages
  const langKey = `langDataController_${activeLanguage}`;
  const fallbackLangKey = `langData_${activeLanguage}`;

  const dataaa: any = (await AsyncStorage.getItem(langKey))
    ? await AsyncStorage.getItem(langKey)
    : await AsyncStorage.getItem(fallbackLangKey);

  const parseData: any = dataaa ? await JSON.parse(dataaa) : null;

  try {
    if (languename) {
      if (parseData) {
        const targetKeys = [languename];
        if (languename === "en" || languename === "English") targetKeys.push("en", "English");
        if (languename === "fr" || languename === "French" || languename === "Français") targetKeys.push("fr", "French", "Français");
        if (languename === "pt" || languename === "Portuguese" || languename === "Português") targetKeys.push("pt", "Portuguese", "Português");
        if (languename === "it" || languename === "Italian" || languename === "Italiano") targetKeys.push("it", "Italian", "Italiano");

        targetKeys.forEach((key) => {
          i18n.addResourceBundle(key, "translation", parseData, true, true);
        });
      }
      await i18n.changeLanguage(languename);
      // Force all react-i18next components to re-render with updated resource bundles
      i18n.emit("languageChanged", languename);
    }
    console.log("i18n ends");
  } catch (error) {
    console.log("errorlanguage", error);
  }
};

export default i18n;

