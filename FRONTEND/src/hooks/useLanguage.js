import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const currentLanguage = i18n.language;

  return {
    currentLanguage,
    changeLanguage,
    isRTL: currentLanguage === 'ar',
  };
};
