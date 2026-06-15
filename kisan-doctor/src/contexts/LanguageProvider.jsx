// src/contexts/LanguageProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import translations from "../i18n";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const saved = localStorage.getItem("kd-lang");
  const defaultLang = saved || "en";
  const [lang, setLang] = useState(defaultLang);

  useEffect(() => {
    localStorage.setItem("kd-lang", lang);
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
