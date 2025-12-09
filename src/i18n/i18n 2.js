import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import koLanguage from './locales/ko/language.json';
import koInfo from './locales/ko/info.json';
import koHome from './locales/ko/home.json';
import koSelfCheck from './locales/ko/selfCheck.json';   // ⭐ 추가

import zhLanguage from './locales/zh/language.json';
import zhInfo from './locales/zh/info.json';
import zhHome from './locales/zh/home.json';
import zhSelfCheck from './locales/zh/selfCheck.json';   // ⭐ 추가


const STORAGE_KEY = 'app_language';

// 🔹 JSON들을 합쳐서 resources 구성
const resources = {
  ko: {
    translation: {
      ...koLanguage,
      ...koInfo,
      ...koHome,
      ...koSelfCheck
    },
  },
  zh: {
    translation: {
      ...zhLanguage,
      ...zhInfo,
      ...zhHome,
      ...zhSelfCheck,
    },
  },
};

export const initI18n = async () => {
  let savedLang = await AsyncStorage.getItem(STORAGE_KEY);

  // 저장된 언어 없으면 기기 언어 사용 (zh면 zh, 나머지는 ko로)
  if (!savedLang) {
    const deviceLang = Localization.locale.split('-')[0]; // ko-KR → ko, zh-CN → zh
    savedLang = deviceLang === 'zh' ? 'zh' : 'ko';
  }

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLang,
      fallbackLng: 'ko',
      compatibilityJSON: 'v3',
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
};

export const changeLanguage = async (lang) => {
  await AsyncStorage.setItem(STORAGE_KEY, lang);
  await i18n.changeLanguage(lang);
};

export default i18n;
