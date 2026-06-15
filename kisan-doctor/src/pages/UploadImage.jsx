import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./UploadImage.module.css";
import { useTranslation }
from "../contexts/LanguageProvider";
import { API_URL } from "../api/config";

export default function UploadImage() {

  const navigate = useNavigate();
  const location = useLocation();

   const { lang } =
    useTranslation();

  const crop = location.state?.crop || "Unknown Crop";

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);


  function handleImage(e) {

  const selectedFile =
    e.target.files[0];

  if (!selectedFile) return;

  setFile(selectedFile);

  setPreview(
    URL.createObjectURL(selectedFile)
  );

}

  async function handleAnalyze() {
if (!file) {

  alert(
    lang === "ur"
      ? "براہ کرم پہلے تصویر منتخب کریں۔"
      : "Please select an image first."
  );

  return;


    }

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      console.log("TOKEN:", token);

      const formData =
        new FormData();
formData.append("image", file);
        
      

      const response =
        await fetch(
          `${API_URL}/predict`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            body: formData
          }
        );

      const data =
        await response.json();

      console.log(
        "AI RESULT:",
        data
      );

      if (!response.ok) {

        alert(
          data.error ||
          "Prediction failed"
        );

        return;

      }

      navigate(
        "/result",
        {
          state: {

            crop,

            fileDataUrl:
              preview,

            disease:
              data.disease,

            confidence:
              `${data.confidence}%`,
treatment_en:
  data.treatment_en,

treatment_ur:
  data.treatment_ur,

prevention_en:
  data.prevention_en,

prevention_ur:
  data.prevention_ur,
          }
        }
      );

    } catch (err) {

      console.error(err);

      alert(
        "AI analysis failed"
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className={styles.page}>

      <h2 className={styles.heading}>
        {lang === "ur"
    ? "فصل کی تصویر اپ لوڈ کریں"
    : "Upload Crop Image"}
      </h2>

      <div className={styles.uploadCard}>

        <input
  id="fileInput"
  type="file"
  accept="image/*"
  onChange={handleImage}
  style={{ display: "none" }}
/>

<label
  htmlFor="fileInput"
  className={styles.uploadBtn}
>
  {lang === "ur"
    ? "تصویر منتخب کریں"
    : "Choose Image"}
</label>

<p className={styles.fileName}>
  {file
    ? file.name
    : lang === "ur"
      ? "کوئی تصویر منتخب نہیں کی گئی"
      : "No image selected"}
</p>

     
        {preview && (

          <img
            src={preview}
            alt={
  lang === "ur"
    ? "تصویر کا جائزہ"
    : "Preview"
}
            className={styles.preview}
          />

        )}

      </div>

  <button
  className={styles.analyzeBtn}
  onClick={handleAnalyze}
  disabled={loading}
>

  {loading
    ? (
        lang === "ur"
          ? "تجزیہ کیا جا رہا ہے..."
          : "Analyzing..."
      )
    : (
        lang === "ur"
          ? "فصل کا تجزیہ کریں"
          : "Analyze Crop"
      )}

</button>

    </div>

  );

}