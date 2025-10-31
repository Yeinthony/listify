import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';

//Traducciones
import enTranslations from '../assets/locales/en.json';
import esTranslations from '../assets/locales/es.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  es: {
    translation: esTranslations,
  },
};

const getOrSetLanguage = async () => {
  // Intenta obtener el idioma guardado en SecureStore
  let lang = await SecureStore.getItemAsync('lang');

  // Si no hay un idioma guardado, establece el predeterminado ('es') y guárdalo
  if (!lang) {
    lang = 'es';
    await SecureStore.setItemAsync('lang', lang);
  }

  return lang;
};

const initializeI18n = async () =>{
  const lang = await getOrSetLanguage();

  i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });
}

initializeI18n();

export default i18n;