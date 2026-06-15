// src/components/CropCard.jsx
import React from "react";
import styles from "./CropCard.module.css";

export default function CropCard({ name, hint, selected, onSelect }){
  return (
    <button onClick={onSelect} className={`${styles.card} ${selected?styles.selected:""}`} aria-pressed={selected}>
      <div className={styles.icon}>{name[0]}</div>
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.hint}>{hint}</div>
      </div>
      {selected && <div className={styles.check}>✓</div>}
    </button>
  );
}
