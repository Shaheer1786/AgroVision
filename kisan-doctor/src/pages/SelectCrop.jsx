// src/pages/SelectCrop.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectCrop.module.css";
import { useTranslation } from "../contexts/LanguageProvider";



export default function SelectCrop() {
  const nav = useNavigate();
  const { t, lang } = useTranslation();

  function selectCrop(crop) {
    nav("/upload", { state: { crop } });
  }
const crops = [
  {
    value: "Wheat",
    name: lang === "ur" ? "گندم" : "Wheat",
    emoji: "🌾"
  },
  {
    value: "Rice",
    name: lang === "ur" ? "چاول" : "Rice",
    emoji: "🌱"
  },
  {
    value: "Cotton",
    name: lang === "ur" ? "کپاس" : "Cotton",
    emoji: "🧵"
  },
  {
    value: "Sugarcane",
    name: lang === "ur" ? "گنا" : "Sugarcane",
    emoji: "🎋"
  }
];
  return (
    <div className={styles.page} dir={lang === "ur" ? "rtl" : "ltr"}>

      {/* HEADER */}
      <div className={styles.header}>
        <button className={styles.back} onClick={() => nav(-1)}>←</button>
        <h2>  {lang === "ur"
    ? "فصل منتخب کریں"
    : "Select Crop"}
    </h2>
        <div style={{ width: 40 }} />
      </div>

      <div className={styles.subTitle}>
       {lang === "ur"
    ? "وہ فصل منتخب کریں جسے آپ اسکین کرنا چاہتے ہیں"
    : "Choose the crop you want to scan"}
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {crops.map((c) => (
          <div
            key={c.name}
            className={styles.card}
            onClick={() => selectCrop(c.name)}
          >
            <div className={styles.emoji}>{c.emoji}</div>
            <div className={styles.cropName}>{c.name}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
