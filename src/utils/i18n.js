import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-xhr-backend";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
/*    
    resources: {
      en: { translation: en_locale },
      fa: { translation: fa_locale },
    },
*/
    lng: "en",
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',
    keySeparator: false,
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
  });

export default i18n;