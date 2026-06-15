// src/pages/Splash.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Splash.module.css";
import { useTranslation } from "../contexts/LanguageProvider";

export default function Splash() {
  const nav = useNavigate();
  const { t, lang, setLang } = useTranslation();

  return (
    <div className={styles.page} dir={lang === "ur" ? "rtl" : "ltr"}>
      <div className={styles.card} role="main" aria-labelledby="app-title">
        <div className={styles.logoWrap}>
          <div className={styles.logo}>🌿</div>
          <div className={styles.wave} aria-hidden="true" />
        </div>

        <h1 id="app-title" className={styles.title}>
          {t("appName")}
        </h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.primary}`}
            onClick={() => nav("/signup")}
            aria-label={t("getStarted")}
          >
            {t("getStarted")}
          </button>

          <button
            className={`${styles.btn} ${styles.ghost}`}
            onClick={() => nav("/login")}
            aria-label={t("signIn")}
          >
            {t("signIn")}
          </button>
        </div>

        <div className={styles.langRow}>
          <label className={styles.langLabel}>
            {lang === "en" ? "Language" : "زبان"}
          </label>

          <div className={styles.langSelect}>
            <button
              className={`${styles.langBtn} ${lang === "en" ? styles.langActive : ""}`}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>

            <button
              className={`${styles.langBtn} ${lang === "ur" ? styles.langActive : ""}`}
              onClick={() => setLang("ur")}
              aria-pressed={lang === "ur"}
            >
              اردو
            </button>
          </div>
        </div>

        <div className={styles.footerNote}>
          <small>
            {lang === "en"
              ? "Tip: Use a clear close-up leaf photo for best results."
              : "مشورہ: بہترین نتائج کے لیے واضح اور قریب سے پتے کی تصویر اپ لوڈ کریں۔"}
          </small>
        </div>
      </div>
    </div>
  );
}
