const i18next = {
  language: "en",
  t: (key) => key,
  changeLanguage: async (lang) => {
    i18next.language = lang || "en";
    return i18next.language;
  },
  // Minimal no-op surface for compatibility during migration.
  use: () => i18next,
  init: async () => i18next,
  on: () => {},
  off: () => {}
};

export default i18next;
