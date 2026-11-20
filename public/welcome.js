basEditorial.initializeLanguage();

const languageGroup = document.querySelector("[data-language-group]");
const language = document.documentElement;
const syncLanguageLabel = () => {
    languageGroup.setAttribute("aria-label", language.lang === "ar" ? "اللغة" : "Language");
};
syncLanguageLabel();
new MutationObserver(syncLanguageLabel).observe(language, { attributeFilter: ["lang"] });
