import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";
import { useTranslation }
from "../contexts/LanguageProvider";
import { API_URL } from "../api/config";

export default function Admin() {

    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] =
  useState(0);

useEffect(() => {

  
  fetch(`${API_URL}/admin/user-count`)

  .then(res => res.json())
  .then(data =>
    setTotalUsers(data.totalUsers)
  );

  fetch(`${API_URL}/admin/users`)
    .then(res => res.json())
    .then(data => setUsers(data));

}, []);
    const { lang } = useTranslation();
  useTranslation();
  const nav = useNavigate();

  const [history, setHistory] = useState([]);

  useEffect(() => {

  fetch(`${API_URL}/history`)
    .then(res => res.json())
    .then(data => {
      setHistory(data);
    })
    .catch(err => {
      console.error(err);
    });

}, []);

  const totalScans = history.length;

  const healthyScans = history.filter(
    item =>
      item.disease &&
      item.disease.toLowerCase().includes("healthy")
  ).length;

  const diseasedScans =
    totalScans - healthyScans;

  const diseaseCount = {};

  history.forEach(item => {
    if (
      item.disease &&
      !item.disease.toLowerCase().includes("healthy")
    ) {
      diseaseCount[item.disease] =
        (diseaseCount[item.disease] || 0) + 1;
    }
  });

  const topDiseases = Object.entries(
    diseaseCount
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  async function clearHistory() {

  const confirmed =
    window.confirm(
      lang === "ur"
        ? "کیا آپ تمام اسکین ریکارڈ حذف کرنا چاہتے ہیں؟"
        : "Are you sure you want to clear all scan history?"
    );

  if (!confirmed) return;

  try {

    const response =
      await fetch(
        `${API_URL}/admin/clear-history`,
        {
          method: "DELETE"
        }
      );

    const data =
      await response.json();

    if (data.success) {

      setHistory([]);

      alert(
        lang === "ur"
          ? "ریکارڈ کامیابی سے حذف ہوگیا"
          : "History cleared successfully"
      );

    }

  } catch (err) {

    console.error(err);

    alert(
      lang === "ur"
        ? "ریکارڈ حذف نہیں ہوسکا"
        : "Failed to clear history"
    );

  }

}
  return (
    <div
  className={styles.page}
  dir={lang === "ur" ? "rtl" : "ltr"}
>

      <div className={styles.header}>
        <button
          className={styles.back}
          onClick={() => nav(-1)}
        >
          ←
        </button>

        <h2>
  {lang === "ur"
    ? "📊 ایگرو وژن ایڈمن پورٹل"
    : "📊 AgroVision Admin Portal"}
</h2>

        <div />
      </div>

      {/* Stats */}

      <div className={styles.statsGrid}>

        <div className={styles.statCard}>
          <h1>{totalScans}</h1>
        <p>
  {lang === "ur"
    ? "کل اسکین"
    : "Total Scans"}
</p>
        </div>

        <div className={styles.statCard}>
          <h1>{healthyScans}</h1>
          <p>
  {lang === "ur"
    ? "صحت مند"
    : "Healthy"}
</p>
        </div>

        <div className={styles.statCard}>
          <h1>{diseasedScans}</h1>
          <p>
  {lang === "ur"
    ? "بیمار"
    : "Diseased"}
</p>
        </div>

      </div>

      {/* System Status */}

      <div className={styles.card}>
       <h3>
  {lang === "ur"
    ? "🟢 سسٹم کی حالت"
    : "🟢 System Status"}
</h3>

     <div className={styles.statusRow}>
  🟢 AI Model Online
</div>

<div className={styles.statusRow}>
  🟢 Weather API Connected
</div>

<div className={styles.statusRow}>
  🟢 AI Chat Online
</div>

<div className={styles.statusRow}>
  🟢 Database Connected
</div>
</div>
      {/* Top Diseases */}

      <div className={styles.card}>
        <h3>
  {lang === "ur"
    ? "📈 بیماریوں کا تجزیہ"
    : "📈 Disease Analytics"}
</h3>

        {topDiseases.length === 0 ? (
          <p>No disease records yet.</p>
        ) : (
          topDiseases.map((item, index) => (
            <div
              key={item[0]}
              className={styles.analyticsRow}
            >
              <span>{item[0]}</span>
              <strong>{item[1]}</strong>
            </div>
          ))
        )}
      </div>

      {/* Recent Diagnoses */}

      <div className={styles.card}>
        <h3>
  {lang === "ur"
    ? "📝 حالیہ تشخیص"
    : "📝 Recent Diagnoses"}
</h3>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>

            <thead>
              <tr>
                <th>
  {lang === "ur"
    ? "فصل"
    : "Crop"}
</th>

<th>
  {lang === "ur"
    ? "بیماری"
    : "Disease"}
</th>

<th>
  {lang === "ur"
    ? "اعتماد"
    : "Confidence"}
</th>
              </tr>
            </thead>

            <tbody>

              {history
                .slice(0, 10)
                .map(item => (

                  <tr key={item._id || item.id}>
                    <td>{item.crop}</td>
                    <td>{item.disease}</td>
                    <td>{item.confidence}</td>
                  </tr>

                ))}

            </tbody>

          </table>
        </div>
      </div>

      <div className={styles.statCard}>
  <h1>{totalUsers}</h1>
  <p>
    {lang === "ur"
      ? "کل صارفین"
      : "Total Users"}
  </p>
</div>

      {/* Clear Button */}

      <button
        className={styles.clearBtn}
        onClick={clearHistory}
      >
        🗑 {
  lang === "ur"
    ? "ریکارڈ حذف کریں"
    : "Clear History"
}
      </button>


<div className={styles.adminActions}>

  
  <button
    className={styles.logoutBtn}
    onClick={() => {

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      nav("/login");

    }}
  >
    {lang === "ur"
      ? "🚪 لاگ آؤٹ"
      : "🚪 Logout"}
  </button>

  <div className={styles.card}>
  <h3>
    {lang === "ur"
      ? "👥 رجسٹرڈ کسان"
      : "👥 Registered Farmers"}
  </h3>

  {users.length === 0 ? (

    <p>
      {lang === "ur"
        ? "کوئی صارف موجود نہیں"
        : "No users found"}
    </p>

  ) : (

    users.map(user => (

      <div
        key={user._id}
        className={styles.userRow}
      >
        <div>
          <strong>{user.name}</strong>
          <p>{user.email}</p>
        </div>
      </div>

    ))

  )}
</div>

</div>




    </div>
  );
}