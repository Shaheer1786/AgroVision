import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./History.module.css";
import { useTranslation } from "../contexts/LanguageProvider";
import { API_URL } from "../api/config";


export default function History() {
  const nav = useNavigate();
  const { t, lang } = useTranslation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {

      const response =
        await fetch(
          `${API_URL}/history`
        );

      const data =
        await response.json();

      setItems(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  async function deleteScan(id) {

    const confirmDelete =
      window.confirm(
        "Delete this scan?"
      );

    if (!confirmDelete) return;

    try {

      await fetch(
        `${API_URL}/history/${id}`,
        {
          method: "DELETE"
        }
      );

      setItems(
        items.filter(
          item =>
            item._id !== id
        )
      );

    } catch (err) {

      console.error(err);

    }

  }

  async function clearAll() {

    const confirmDelete =
      window.confirm(
        "Delete all scan history?"
      );

    if (!confirmDelete) return;

    try {

      await fetch(
        (`${API_URL}/history`),
        {
          method: "DELETE"
        }
      );

      setItems([]);

    } catch (err) {

      console.error(err);

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

        <h2 className={styles.title}>
          {t("history")}
        </h2>

        <div style={{ width: 40 }} />

      </div>

      {items.length > 0 && (

        <button
          onClick={clearAll}
          className={styles.clearBtn}
        >
          🗑 Clear All
        </button>

      )}

      <div className={styles.container}>

        {loading ? (

          <div className={styles.empty}>
            Loading history...
          </div>

        ) : items.length === 0 ? (

          <div className={styles.empty}>
            No scan history found
          </div>

        ) : (

          items.map((item) => (

            <div
              key={item._id}
              className={styles.card}
            >

              <div className={styles.info}>

                <div className={styles.crop}>
                  🌾 {item.crop}
                </div>

                <div className={styles.disease}>
                  {item.disease}
                </div>

                <div className={styles.date}>
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </div>

              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px"
                }}
              >

                <div
                  className={styles.confidence}
                >
                  {item.confidence}%
                </div>

                <button
                  onClick={() =>
                    deleteScan(item._id)
                  }
                  className={styles.deleteBtn}
                >
                  🗑
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}