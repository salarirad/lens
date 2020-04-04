import i18n from "i18next";
import { initReactI18next } from "react-i18next";
//import Backend from "i18next-xhr-backend";

import en from './locales/en.json'


i18n
  //.use(Backend)
  .use(initReactI18next)
  .init({
    resources: {
      en: en
    },
    lng: "en",
    fallbackLng: 'en',
    debug: true,
    keySeparator: false,
/*    backend: {
      loadPath: 'public/locales/{{lng}}.json',
    },
  */
  });

export default i18n;