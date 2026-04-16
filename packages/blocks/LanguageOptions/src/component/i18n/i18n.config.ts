import i18n from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initReactI18next } from "react-i18next";
import { enus, en, fr, es, pt, it } from "../translations";

export const langaugeFunction = async () => {
  console.log("i18n", i18n.language);
  const dataaa: any = (await AsyncStorage.getItem("langDataController"))
    ? await AsyncStorage.getItem("langDataController")
    : await AsyncStorage.getItem("langData");
  const languename: any = await AsyncStorage.getItem("languename");
  const parseData: any = await JSON.parse(dataaa);
  const applanguage = await AsyncStorage.getItem("appLanguage");
  // console.log(applanguage, "appLanguage from i18n function");
  // console.log(
  //   "asyncdata " +
  //     applanguage +
  //     " " +
  //     languename +
  //     " " +
  //     dataaa +
  //     "-----------------" +
  //     parseData
  // );

  /** M6 — shell bundles for EN/FR/ES/PT/IT; `languename` bundle from storage overrides when present. */
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
  if (languename) {
    resources[languename] = { translation: parseData };
  }

  console.log("resourcesss", resources);

  try {
    await i18n.use(initReactI18next).init({
      lng: languename,
      fallbackLng: "enus",
      compatibilityJSON: "v2",
      resources,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: true,
      },
    });
    console.log("i18n ends");
  } catch (error) {
    console.log("errorlanguage", error);
  }
};

export default i18n;
