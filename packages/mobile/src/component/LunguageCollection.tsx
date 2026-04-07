import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import fr from './fr.json';
  
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: en,
    franch: fr,
  },
  interpolation: {
    escapeValue: false // react already safes from xsss
  }
});

  
export default i18n;
