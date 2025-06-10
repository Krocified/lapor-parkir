import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";

// Import translation files
import en from "./locales/en.json";
import id from "./locales/id.json";

const resources = {
  en: { translation: en },
  id: { translation: id },
};

// Get device language
const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (locales && locales.length > 0) {
    const deviceLanguage = locales[0].languageCode;
    // Return supported language or fallback to English
    return ["en", "id"].includes(deviceLanguage) ? deviceLanguage : "en";
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: "en",
  debug: __DEV__,

  interpolation: {
    escapeValue: false,
  },

  // React i18next options
  react: {
    useSuspense: false,
  },
});

export default i18n;
