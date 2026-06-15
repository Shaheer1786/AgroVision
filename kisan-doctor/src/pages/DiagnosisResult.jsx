import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./DiagnosisResult.module.css";
import { useTranslation } from "../contexts/LanguageProvider";

export default function DiagnosisResult() {
  const nav = useNavigate();
  const loc = useLocation();
  const { t, lang } = useTranslation();

 const {
  crop,
  fileDataUrl,
  disease,
  confidence,
  treatment_en,
  treatment_ur,
  prevention_en,
  prevention_ur
} = loc.state || {};

const treatment =
  lang === "ur"
    ? treatment_ur
    : treatment_en;

const prevention =
  lang === "ur"
    ? prevention_ur
    : prevention_en;

    
  useEffect(() => {
    if (!fileDataUrl || !disease) {
      nav("/upload");
      return;
    }

    const old = JSON.parse(localStorage.getItem("kd-history") || "[]");

    const entry = {
      id: Date.now(),
      crop,
      disease,
      confidence,
      date: new Date().toLocaleDateString(),
      image: fileDataUrl
    };

    localStorage.setItem(
      "kd-history",
      JSON.stringify([entry, ...old].slice(0, 40))
    );
  }, [fileDataUrl, disease, crop, confidence, nav]);

  if (!disease) {
    return (
      <div className={styles.page}>
        <div className={styles.loader}>
          🔍 AI Analyzing Crop...
        </div>
      </div>
    );
  }

  const confidenceNum =
  parseFloat(confidence);

const isHealthy =
  disease.toLowerCase().includes("healthy");

let badgeText =
  lang === "ur"
    ? "کم اعتماد"
    : "Low Confidence";

let badgeClass =
  styles.lowRisk;

if (confidenceNum >= 80) {

  badgeText =
    lang === "ur"
      ? "اعلیٰ اعتماد"
      : "High Confidence";

  badgeClass =
    styles.highRisk;

}
else if (confidenceNum >= 50) {

  badgeText =
    lang === "ur"
      ? "درمیانی اعتماد"
      : "Medium Confidence";

  badgeClass =
    styles.mediumRisk;

}

  return (
    <div className={styles.page} dir={lang === "ur" ? "rtl" : "ltr"}>

      <div className={styles.header}>
        <button
          onClick={() => nav(-1)}
          className={styles.back}
        >
          ←
        </button>

        <h2 className={styles.title}>
         {lang === "ur"
    ? "مصنوعی ذہانت کی تشخیص"
    : "AI Diagnosis"}
        </h2>

        <div style={{ width: 40 }} />
      </div>

      <div className={styles.container}>

        <div className={styles.successCard}>
          <div className={styles.check}>✅</div>

          <h3>{lang === "ur"
  ? "تجزیہ مکمل"
  : "Analysis Complete"}</h3>

          <p>
            {lang === "ur"
  ? "مصنوعی ذہانت نے آپ کی فصل کی تصویر کا کامیابی سے تجزیہ کر لیا ہے۔"
  : "AI has successfully analyzed your crop image."}
          </p>
        </div>

        <div className={styles.previewCard}>
          <img
            src={fileDataUrl}
            alt="crop"
            className={styles.image}
          />
        </div>

        <div className={styles.resultBox}>

          <div className={styles.cropName}>
            {crop}
          </div>

          <div className={styles.disease}>
            {disease}
          </div>

          <div
            className={`${styles.badge} ${badgeClass}`}
          >
            {badgeText}
          </div>

          <div className={styles.circleWrap}>
            <div className={styles.circle}>
              {confidence}
            </div>

            <p>{lang === "ur"
  ? "اعتماد کی شرح"
  : "AI Confidence"}</p>
          </div>

          <div className={styles.section}>
            <div className={styles.subTitle}>
              {lang === "ur"
  ? "علاج 💊"
  : "Treatment 💊"}
            </div>
<div className={styles.advice}>
  {lang === "ur"
    ? (
        disease.toLowerCase().includes("rust")
          ? "فنگس کش دوا استعمال کریں اور فصل کی باقاعدگی سے نگرانی کریں۔"

          : disease.toLowerCase().includes("blight")
          ? "متاثرہ پودے ہٹا دیں اور مناسب دوا استعمال کریں۔"

          : disease.toLowerCase().includes("spot")
          ? "متاثرہ حصے کا علاج کریں اور فصل کو خشک رکھیں۔"

          : disease.toLowerCase().includes("mildew")
          ? "فنگس کش اسپرے کریں اور ہوا کی بہتر آمدورفت یقینی بنائیں۔"

          : disease.toLowerCase().includes("healthy")
          ? "کسی علاج کی ضرورت نہیں۔"

          : treatment
      )
    : treatment}
</div>
          </div>

          <div className={styles.section}>
            <div className={styles.subTitle}>
             {lang === "ur"
  ? "بچاؤ 🛡️"
  : "Prevention 🛡️"}
            </div>
<div className={styles.advice}>
  {lang === "ur"
    ? (
        disease.toLowerCase().includes("rust")
          ? "فصل کا باقاعدگی سے معائنہ کریں، متاثرہ پتے ہٹا دیں اور مناسب آبپاشی برقرار رکھیں۔"

          : disease.toLowerCase().includes("blight")
          ? "صاف بیج استعمال کریں اور متاثرہ پودوں کو الگ کریں۔"

          : disease.toLowerCase().includes("spot")
          ? "زیادہ نمی سے بچیں اور کھیت کو صاف رکھیں۔"

          : disease.toLowerCase().includes("mildew")
          ? "ہوا دار ماحول برقرار رکھیں اور زیادہ پانی سے بچیں۔"

          : disease.toLowerCase().includes("healthy")
          ? "اچھی زرعی سرگرمیاں جاری رکھیں۔"

          : prevention
      )
    : prevention}
</div>
          </div>
{!isHealthy && (
  <button
    className={styles.primary}
    onClick={() =>
      nav("/chat", {
        state: {
          disease,
          crop
        }
      })
    }
  >
    {lang === "ur"
  ? "اس بیماری کے بارے میں اے آئی سے پوچھیں 🤖"
  : "Ask AI About This Disease 🤖"}
  </button>
)}
<button
  className={styles.secondary}
  onClick={() =>
    nav("/chat", {
      state: {
        disease,
        crop,
        carePlan: true
      }
    })
  }
>
  {lang === "ur"
  ? "فصلی منصوبہ بنائیں 📅"
  : "Generate Care Plan 📅"}
</button>

          <button
            className={styles.secondary}
            onClick={() => nav("/select-crop")}
          >
            {lang === "ur"
  ? "دوسری فصل اسکین کریں 📷"
  : "Scan Another Crop 📷"}
          </button>

          <button
  className={styles.secondary}
  onClick={() => nav("/dashboard")}
>
  {lang === "ur"
    ? "ڈیش بورڈ پر جائیں 🏠"
    : "Go To Dashboard 🏠"}
</button>

        </div>
      </div>
    </div>
  );
}

