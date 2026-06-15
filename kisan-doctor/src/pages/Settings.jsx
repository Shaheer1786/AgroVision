// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Settings.module.css";
import { useTranslation } from "../contexts/LanguageProvider";

export default function Settings() {

  const nav = useNavigate();

  const {
    t,
    lang,
    setLang
  } = useTranslation();

  const [consent, setConsent] =
    useState(true);

  const [language, setLanguage] =
    useState(lang || "en");

  useEffect(() => {

    try {

      const s =
        JSON.parse(
          localStorage.getItem(
            "kd-settings"
          ) || "{}"
        );

      if (
        typeof s.consent === "boolean"
      ) {
        setConsent(s.consent);
      }

      if (s.language) {
        setLanguage(s.language);
      }

    } catch (e) {}

  }, []);

  function saveSettings(
    next = {}
  ) {

    const newSettings = {
      consent,
      language,
      ...next
    };

    localStorage.setItem(
      "kd-settings",
      JSON.stringify(newSettings)
    );

  }

  function onToggleConsent(e) {

    setConsent(
      e.target.checked
    );

    saveSettings({
      consent:
        e.target.checked
    });

  }

  function onChangeLanguage(e) {

    setLanguage(
      e.target.value
    );

    setLang(
      e.target.value
    );

    saveSettings({
      language:
        e.target.value
    });

  }

  function logout() {

    const ok =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!ok) return;

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    nav("/login");

  }

  return (

    <div
      className={styles.page}
      dir={
        language === "ur"
          ? "rtl"
          : "ltr"
      }
    >

      <div className={styles.header}>

        <button
          onClick={() => nav(-1)}
          className={styles.back}
        >
          ←
        </button>

        <div
          className={styles.title}
        >
          {t("settings")}
        </div>

        <div
          style={{ width: 40 }}
        />

      </div>

      <div
        className={styles.container}
      >

        <div
          className={styles.card}
        >

          <div
            className={styles.row}
          >

            <div>

              <div
                className={
                  styles.itemTitle
                }
              >
                {t(
                  "changeLanguage"
                )}
              </div>

              <div
                className={
                  styles.itemSub
                }
              >
                {t("language")}
              </div>

            </div>

            <select
              value={language}
              onChange={
                onChangeLanguage
              }
              className={
                styles.select
              }
            >
              <option value="en">
                English
              </option>

              <option value="ur">
                اردو
              </option>

            </select>

          </div>

        </div>

        <div
          className={styles.card}
        >

          <div
            className={styles.row}
          >

            <div>

              <div
                className={
                  styles.itemTitle
                }
              >
                {t(
                  "dataConsent"
                )}
              </div>

              <div
                className={
                  styles.itemSub
                }
              >
                {t(
                  "dataConsent"
                )}
              </div>

            </div>

            <label
              className={
                styles.toggle
              }
            >

              <input
                type="checkbox"
                checked={
                  consent
                }
                onChange={
                  onToggleConsent
                }
              />

              <span
                className={
                  styles.slider
                }
              />

            </label>

          </div>

        </div>

        <div
          className={styles.card}
        >

          <div
            className={styles.row}
          >

            <div>

              <div
                className={
                  styles.itemTitle
                }
              >
                {t("aboutApp")}
              </div>

              <div
                className={
                  styles.itemSub
                }
              >
                Version 0.1 —
                Prototype
              </div>

            </div>

            <button
              className={
                styles.linkBtn
              }
              onClick={() =>
                alert(
                  t(
                    "aboutApp"
                  )
                )
              }
            >
              Info
            </button>

          </div>

        </div>

        {/* LOGOUT */}

        <div
          className={styles.card}
        >

          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background:
                "#e53935",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            }}

            
         >
            🚪 Logout
          </button>

        </div>

      </div>

    </div>
    

  );

}