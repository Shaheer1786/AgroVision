import "../styles/pageTransition.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { useTranslation } from "../contexts/LanguageProvider";
import { API_URL } from "../api/config";

export default function Signup() {

  const { t, lang } = useTranslation();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState("");

  function validate() {

    if (!name.trim())
      return lang === "en"
        ? "Name is required"
        : "نام ضروری ہے";

    if (!/^\S+@\S+\.\S+$/.test(email))
      return lang === "en"
        ? "Enter a valid email"
        : "درست ای میل درج کریں";

    if (pwd.length < 8)
      return lang === "en"
        ? "Password must be at least 8 characters."
        : "پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے۔";

    if (pwd !== confirm)
      return lang === "en"
        ? "Passwords do not match."
        : "پاس ورڈ مماثل نہیں ہیں۔";

    if (!consent)
      return lang === "en"
        ? "Please accept Terms & Privacy."
        : "براہ کرم شرائط و رازداری سے اتفاق کریں۔";

    return null;
  }

  async function submit(e) {

    console.log("SUBMIT CLICKED");

    e.preventDefault();

    const v = validate();

    if (v) {
      console.log("VALIDATION FAILED:", v);
      setErr(v);
      return;
    }

    setErr("");

    try {

      console.log("Sending signup request...");

      const response = await fetch(
        `${API_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password: pwd
          })
        }
      );

      console.log("Response received");

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        setErr(data.error || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      nav("/dashboard");

    } catch (err) {

      console.error(err);

      setErr("Server connection failed");

    }
  }

  return (
    <div
      className={styles.page}
      dir={lang === "ur" ? "rtl" : "ltr"}
    >
      <div className={styles.card}>

        <h2 className={styles.title}>
          {t("signupTitle")}
        </h2>

        <form
          onSubmit={submit}
          className={styles.form}
        >

          <label className={styles.label}>
            Full Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            placeholder="Full Name"
          />

          <label className={styles.label}>
            Email
          </label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="Email"
            type="email"
          />

          <label className={styles.label}>
            {t("password")}
          </label>

          <input
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            type="password"
            className={styles.input}
            placeholder={t("password")}
          />

          <label className={styles.label}>
            {t("confirmPassword")}
          </label>

          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            className={styles.input}
            placeholder={t("confirmPassword")}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 8
            }}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) =>
                setConsent(e.target.checked)
              }
            />

            <div
              style={{
                fontSize: 13,
                color: "#666"
              }}
            >
              {t("dataConsent")}
            </div>
          </div>

          {err && (
            <div className={styles.error}>
              {err}
            </div>
          )}

          <button
            type="submit"
            className={styles.primaryBtn}
          >
            {t("signUp")}
          </button>

        </form>

        <div className={styles.row}>

          <span className={styles.small}>
            {t("alreadyHaveAccount")}
          </span>

          <button
            type="button"
            className={styles.linkBtn}
            onClick={() => nav("/login")}
          >
            {t("login")}
          </button>

        </div>

      </div>
    </div>
  );
}