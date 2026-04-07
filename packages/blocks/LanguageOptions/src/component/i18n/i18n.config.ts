import i18n from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initReactI18next } from "react-i18next";
import {enus, en, fr} from "../translations";

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

  const resources = {
    enus: {
      translation: enus
    },
    [languename]: {
      translation: parseData,
    },
  };

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
