import "../styles/pageTransition.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { useTranslation } from "../contexts/LanguageProvider";
import { API_URL } from "../api/config";
import { CapacitorHttp } from "@capacitor/core";

export default function Login() {

  const { t, lang } = useTranslation();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function validate() {

    if (!email.trim()) {
      return lang === "en"
        ? "Email is required"
        : "ای میل ضروری ہے";
    }

    if (!password.trim()) {
      return lang === "en"
        ? "Password is required"
        : "پاس ورڈ ضروری ہے";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return lang === "en"
        ? "Enter a valid email"
        : "درست ای میل درج کریں";
    }

    return null;
  }

 async function onSubmit(e) {

  e.preventDefault();

  setError("");

  const err = validate();

  if (err) {
    setError(err);
    return;
  }

 try {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  console.log(data);
  alert(JSON.stringify(data));

  if (!response.ok) {
    setError(data.error || "Login failed");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("role", data.user.role);

  nav(data.user.role === "admin" ? "/admin" : "/dashboard");
} catch (err) {
  console.error(err);
  alert(err.message);
}}

  return (
    <div
      className={styles.page}
      dir={lang === "ur" ? "rtl" : "ltr"}
    >
      <div className={styles.card}>

        <h2 className={styles.title}>
          {t("loginTitle")}
        </h2>

        <form
          className={styles.form}
          onSubmit={onSubmit}
        >

          <label className={styles.label}>
            {t("email")}
          </label>

          <input
            type="email"
            className={styles.input}
            placeholder={t("email")}
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <label className={styles.label}>
            {t("password")}
          </label>

          <input
            type="password"
            className={styles.input}
            placeholder={t("password")}
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.primaryBtn}
          >
            {t("login")}
          </button>

        </form>

        <div className={styles.row}>

          <span className={styles.small}>
            {t("noAccount")}
          </span>

          <button
            type="button"
            className={styles.linkBtn}
            onClick={() =>
              nav("/signup")
            }
          >
            {t("createAccount")}
          </button>

        </div>

      </div>
    </div>
  );
}