import enLocaleElement from "element-plus/dist/locale/en.mjs";
import zhLocaleElement from "element-plus/dist/locale/zh-cn.mjs";
import enLocale from "./i18n/en-US";
import zhLocale from "./i18n/zh-CN";
import enLocale_render from "./i18n/en-US_render";
import zhLocale_render from "./i18n/zh-CN_render";
import enLocale_extension from "./i18n/en-US_extension";
import zhLocale_extension from "./i18n/zh-CN_extension";

// 工具函数
function isDef(value) {
  return value !== undefined && value !== null;
}
function get(object, path) {
  const keys = path.split(".");
  let result = object;
  keys.forEach((key) => {
    result = isDef(result) && isDef(result[key]) ? result[key] : null;
  });
  return result;
}

// i18nLang 类定义
class I18nLang {
  constructor() {
    this.currentLanguage = localStorage.getItem("v_form_locale") || "zh-CN";
    this.supportedLanguages = ["en-US", "zh-CN"];
    this.languageData = {};
    this.loadLanguage(this.currentLanguage);
  }

  setLanguage(language) {
    if (this.supportedLanguages.includes(language)) {
      this.currentLanguage = language;
      this.loadLanguage(language);
    } else {
      console.warn(`Language "${language}" is not supported.`);
    }
  }

  loadLanguage(language) {
    const langResources = {
      "en-US": {
        something: {},
        ...enLocaleElement,
        ...enLocale,
        ...enLocale_render,
        ...enLocale_extension,
      },
      "zh-CN": {
        something: {},
        ...zhLocaleElement,
        ...zhLocale,
        ...zhLocale_render,
        ...zhLocale_extension,
      },
    };
    this.languageData = langResources[language] || {};
  }

  getTranslation(key) {
    return get(this.languageData, key);
  }
}
const i18nInstance = new I18nLang();

// 创建实例
const i18n = {
  computed: {
    currentLanguage() {
      return i18nInstance.currentLanguage;
    },
  },
  methods: {
    changeLanguage(lang) {
      i18nInstance.setLanguage(lang);
    },
    i18nt(key) {
      return i18nInstance.getTranslation(key);
    },
    i18n2t(key1, key2) {
      return (
        i18nInstance.getTranslation(key1) || i18nInstance.getTranslation(key2)
      );
    },
  },
};
export function changeLocale(langName) {
  i18nInstance.setLanguage(langName);
  localStorage.setItem("v_form_locale", langName);
}
export default i18n;

export function translate(key) {
  return i18nInstance.getTranslation(key);
}
