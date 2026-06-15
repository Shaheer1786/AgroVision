// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { useTranslation } from "../contexts/LanguageProvider";
import BottomNav from "../components/BottomNav";
import { API_URL } from "../api/config";


export default function Dashboard() {
  
  const nav = useNavigate();
const [weather, setWeather] =
  useState(null);

useEffect(() => {

  
    fetch(`${API_URL}/weather/Karachi`)
  
    .then(res => res.json())
    .then(data => {

      setWeather(data);

    });

}, []);

  const { t, lang } = useTranslation();

  const role =
  localStorage.getItem("role");

  useEffect(() => {

  if (role === "admin") {
    nav("/admin");
  }

}, [role]);

  

  const [stats, setStats] = useState({
    totalScans: 0,
    healthyScans: 0,
    diseasedScans: 0
  });

  const [lastScan, setLastScan] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const response = await 
        fetch(`${API_URL}/history`)
      

      const scans = await response.json();

      const totalScans = scans.length;

      const healthyScans = scans.filter(
        (scan) =>
          scan.disease &&
          scan.disease.toLowerCase().includes("healthy")
      ).length;

      const diseasedScans =
        totalScans - healthyScans;

      setStats({
        totalScans,
        healthyScans,
        diseasedScans
      });

      if (scans.length > 0) {
        setLastScan(scans[0]);
      }

    } catch (err) {
      console.error(err);
    }
  }

  const tipsEn = [
  "Scan crops early morning for best results.",
  "Avoid over-irrigation to prevent fungal diseases.",
  "Use certified seeds for better resistance.",
  "Remove infected leaves immediately.",
  "Rotate crops to prevent soil diseases."
];

const tipsUr = [
  "بہترین نتائج کے لیے صبح فصل اسکین کریں۔",
  "فنگس سے بچاؤ کے لیے زیادہ آبپاشی نہ کریں۔",
  "بہتر مزاحمت کے لیے معیاری بیج استعمال کریں۔",
  "متاثرہ پتے فوراً ہٹا دیں۔",
  "زمین کی بیماریوں سے بچنے کے لیے فصل تبدیل کریں۔"
];

const tip =
  (lang === "ur"
    ? tipsUr
    : tipsEn)[
      new Date().getDate() %
      tipsEn.length
    ];

let weatherAdvice = null;

if (weather) {

  if (weather.main.humidity > 80) {

    weatherAdvice = {
      title:
        lang === "ur"
          ? "🌦 موسمی مشورہ"
          : "🌦 AI Weather Advisory",

      value:
        lang === "ur"
          ? `نمی: ${weather.main.humidity}%`
          : `Humidity: ${weather.main.humidity}%`,

      alert:
        lang === "ur"
          ? "⚠️ فنگس بیماریوں کا خطرہ بڑھ گیا ہے۔"
          : "⚠️ Risk of fungal diseases is high.",

      tips:
        lang === "ur"
          ? [
              "روزانہ فصل کا معائنہ کریں۔",
              "زیادہ آبپاشی سے گریز کریں۔",
              "ضرورت ہو تو فنگس کش دوا استعمال کریں۔"
            ]
          : [
              "Inspect crops daily.",
              "Avoid over-irrigation.",
              "Apply fungicide if symptoms appear."
            ]
    };

  }

  else if (weather.main.temp > 38) {

    weatherAdvice = {
      title:
        lang === "ur"
          ? "🔥 گرمی کا انتباہ"
          : "🔥 Heat Advisory",

      value:
        lang === "ur"
          ? `درجہ حرارت: ${weather.main.temp}°C`
          : `Temperature: ${weather.main.temp}°C`,

      alert:
        lang === "ur"
          ? "⚠️ فصل پر گرمی کا دباؤ بڑھ سکتا ہے۔"
          : "⚠️ Heat stress risk is increasing.",

      tips:
        lang === "ur"
          ? [
              "شام کے وقت آبپاشی کریں۔",
              "دوپہر میں کھاد استعمال نہ کریں۔",
              "فصل میں مرجھانے کی علامات چیک کریں۔"
            ]
          : [
              "Irrigate during evening hours.",
              "Avoid fertilizer application at noon.",
              "Monitor crop stress symptoms."
            ]
    };

  }

}

  return (
    <div
      className={styles.page}
      dir={lang === "ur" ? "rtl" : "ltr"}
    >

      <header className={styles.header}>
        <div>
          <h2>{t("dashboard")}</h2>

         <span className={styles.subHeader}>
  {lang === "ur"
    ? role === "admin"
      ? "خوش آمدید، ایڈمن!"
      : "خوش آمدید، کسان!"
    : role === "admin"
      ? "Welcome, Admin!"
      : "Welcome, Farmer!"}
</span>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h3>{t("uploadImageCTA")}</h3>
          <p>{t("uploadSubtitle")}</p>
        </div>

        <button
          className={styles.heroBtn}
          onClick={() =>
            nav("/select-crop")
          }
        >
          {lang === "ur"
            ? "شروع کریں"
            : "Start Scan"}
        </button>
      </section>

      <div className={styles.stats}>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {stats.totalScans}
          </div>

          <div className={styles.statLabel}>
             {lang === "ur"
    ? "کل اسکین"
    : "Total Scans"}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {stats.healthyScans}
          </div>

          <div className={styles.statLabel}>
           {lang === "ur"
    ? "صحت مند"
    : "Healthy"}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {stats.diseasedScans}
          </div>

          <div className={styles.statLabel}>
            {lang === "ur"
    ? "بیماریاں"
    : "Diseases"}
          </div>
        </div>

      </div>

      <div className={styles.tipCard}>
        <div className={styles.tipTitle}>
  🌱 {lang === "ur"
    ? "آج کا مشورہ"
    : "Tip of the Day"}
</div>

        <div className={styles.tipText}>
          {tip}
        </div>
      </div>
{weather && (

  <div className={styles.weatherCard}>

    <div>


  
      <div className={styles.weatherTemp}>
        {weather.main.temp}°C
      </div>

      <div className={styles.weatherCity}>
        {lang === "ur"
          ? "کراچی"
          : weather.name}
      </div>

      <div>
        💧 {lang === "ur"
          ? "نمی"
          : "Humidity"}
        : {weather.main.humidity}%
      </div>

      <div>
        🌬 {lang === "ur"
          ? "ہوا"
          : "Wind"}
        : {weather.wind.speed} m/s
      </div>

    </div>

    
  </div>

)} 

{weatherAdvice && (

  <div className={styles.advisoryCard}>

    <div className={styles.advisoryTitle}>
      {weatherAdvice.title}
    </div>

    <div className={styles.advisoryValue}>
      {weatherAdvice.value}
    </div>

    <div className={styles.advisoryAlert}>
      {weatherAdvice.alert}
    </div>

    <ul className={styles.advisoryList}>

      {weatherAdvice.tips.map(
        (tip, index) => (

          <li key={index}>
            ✅ {tip}
          </li>

        )
      )}

    </ul>

  </div>

)}






      {lastScan && (
        <>
          <div className={styles.sectionTitle}>
            {lang === "ur"
              ? "حالیہ اسکین"
              : "Recent Scan"}
          </div>

          <div
            className={styles.recentCard}
            onClick={() =>
              nav("/history")
            }
          >
            <div className={styles.recentText}>
              <h4>
                {lastScan.crop}
              </h4>

              <p>
                {lastScan.disease}
              </p>
            </div>
          </div>
        </>
      )}

      

      <h4 className={styles.sectionTitle}>
        {lang === "ur"
          ? "فوری اقدامات"
          : "Quick Actions"}
      </h4>

      <div className={styles.grid}>

        <button
          onClick={() =>
            nav("/history")
          }
          className={styles.card}
        >
          <span>🕒</span>
          <p>{t("history")}</p>
        </button>

        <button
          onClick={() =>
            nav("/chat")
          }
          className={styles.card}
        >
          <span>💬</span>
          <p>{t("chat")}</p>
        </button>

        <button
          onClick={() =>
            nav("/settings")
          }
          className={styles.card}
        >
          <span>⚙️</span>
          <p>{t("settings")}</p>
        </button>
<button
  onClick={() => nav("/emergency")}
  className={styles.card}
>
  <span>🚨</span>
  <p>
    {lang === "ur"
      ? "ہنگامی مدد"
      : "Emergency Help"}
  </p>
</button>


      </div>

      <BottomNav />

    </div>
  );

  
}
