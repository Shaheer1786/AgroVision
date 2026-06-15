// src/pages/PhotoReview.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./PhotoReview.module.css";
import { useTranslation } from "../contexts/LanguageProvider";
import { API_URL } from "../api/config";

export default function PhotoReview() {
  const nav = useNavigate();
  const loc = useLocation();
  const { t, lang } = useTranslation();
  const { crop, fileDataUrl, includeLocation } = loc.state || {};
  const imgRef = useRef(null);
  const [qualityHint, setQualityHint] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fileDataUrl) {
      nav("/upload");
      return;
    }
    const imgEl = imgRef.current;
    function onLoad() {
      if (!imgEl) return;
      if (imgEl.naturalWidth < 800)
        setQualityHint(
          lang === "en"
            ? "Low quality: try a closer photo."
            : "کم معیار: قریب سے تصویر لینے کی کوشش کریں۔"
        );
      else setQualityHint("");
    }
    if (imgEl && imgEl.complete) onLoad();
    imgEl && imgEl.addEventListener("load", onLoad);
    return () => imgEl && imgEl.removeEventListener("load", onLoad);
  }, [fileDataUrl, nav, lang]);

  if (!fileDataUrl) return null;

  // 🧠 SEND TO AI BACKEND
  const analyzeImage = async () => {
    setLoading(true);

    // Convert base64 to blob
    const blob = await (await fetch(fileDataUrl)).blob();

    const formData = new FormData();
    formData.append("crop", crop);
    formData.append("image", blob, "plant.jpg");

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      setLoading(false);

      if (!data.success) {
        alert("AI analysis failed");
        return;
      }

      // Go to result page with AI data
      nav("/result", {
        state: {
          crop,
          fileDataUrl,
          includeLocation,
          disease: data.disease,
          confidence: data.confidence,
          treatment: data.treatment,
          prevention: data.prevention
        }
      });
    } catch (err) {
      setLoading(false);
      alert("Cannot connect to AI server. Is backend running?");
    }
  };

  return (
    <div className={styles.page} dir={lang === "ur" ? "rtl" : "ltr"}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => nav(-1)}>
          ←
        </button>
        <h2 className={styles.title}>{t("photoReview")}</h2>
        <div style={{ width: 40 }} />
      </div>

      <div className={styles.container}>
        <div className={styles.previewCard}>
          <div className={styles.previewBox}>
            <img
              ref={imgRef}
              src={fileDataUrl}
              alt="preview"
              className={styles.previewImg}
            />
          </div>
        </div>

        {qualityHint && <div className={styles.quality}>{qualityHint}</div>}

        <div className={styles.actions}>
          <button
            className={styles.ghost}
            onClick={() => nav("/upload", { state: { crop } })}
            disabled={loading}
          >
            {t("retakePhoto")}
          </button>

          <button
            className={styles.primary}
            onClick={analyzeImage}
            disabled={loading}
          >
            {loading ? "Analyzing..." : t("usePhoto")}
          </button>
        </div>
      </div>
    </div>
  );
}
