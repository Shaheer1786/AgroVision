import React from "react";
import styles from "./EmergencyHelp.module.css";
import { useTranslation }
from "../contexts/LanguageProvider";


export default function EmergencyHelp() {
    const { lang } = useTranslation();

  return (

    <div className={styles.page}>

      {
  lang === "ur"
    ? "ہنگامی زرعی مدد"
    : "Emergency Crop Help"
}

      <div className={styles.card}>
       {
  lang === "ur"
    ? "📞 زرعی ہیلپ لائن"
    : "📞 Agriculture Helpline"
}
      </div>

      <div className={styles.card}>
        <h3>🐛 Pest Control Department</h3>
        <p>021-111-222-333</p>
      </div>

      <div className={styles.card}>
        <h3>🌾 Agriculture Officer</h3>
        <p>Contact Local Office</p>
      </div>
<a
  href="tel:0800-15000"
  className={styles.callBtn}
>
  📞 Call Agriculture Helpline
</a>

<div
  className={styles.page}
  dir={lang === "ur" ? "rtl" : "ltr"}
></div>
    </div>
    

  );
}