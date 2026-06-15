import React, { useState, useRef, useEffect } from "react";
import {
  useNavigate,
  useLocation
} from "react-router-dom";
import styles from "./Chat.module.css";
import { useTranslation } from "../contexts/LanguageProvider";
import { API_URL } from "../api/config";

export default function Chat() {
  const nav = useNavigate();
  const location = useLocation();
  const { t, lang } = useTranslation();
const [messages, setMessages] = useState(() => {

  const saved =
    localStorage.getItem("kd-chat");

  if (saved) {
    return JSON.parse(saved);
  }

  return [
    {
      id: 1,
      from: "ai",
      text:
        lang === "ur"
          ? "فصلوں کی بیماریوں کے بارے میں پوچھیں۔"
          : "Ask me about crop diseases and their treatment."
    }
  ];

});

 const [text, setText] = useState("");
const [sending, setSending] = useState(false);

const listRef = useRef(null);
const hasAsked = useRef(false);
const disease =
  location.state?.disease;

const crop =
  location.state?.crop;

const carePlan =
  location.state?.carePlan;

useEffect(() => {

  if (listRef.current) {

    listRef.current.scrollTop =
      listRef.current.scrollHeight;

  }

}, [messages]);

useEffect(() => {

  if (!disease) return;

   if (hasAsked.current) return;

  hasAsked.current = true;

  askDiseaseInfo();

  window.history.replaceState(
    {},
    document.title
  );

}, []);

useEffect(() => {

  localStorage.setItem(
    "kd-chat",
    JSON.stringify(messages)
  );

}, [messages]);

async function askDiseaseInfo() {
if (
  !disease ||
  disease.toLowerCase().includes("healthy")
) {
  return;
}

const question = carePlan

  ? (
      lang === "ur"

        ? `${crop} میں ${disease} کے لیے 7 دن کا فصلی منصوبہ بنائیں۔

صرف اس فارمیٹ میں جواب دیں:

دن 1:
- ایک عمل

دن 3:
- ایک عمل

دن 5:
- ایک عمل

دن 7:
- ایک عمل

کوئی اضافی وضاحت نہ دیں۔`

        : `Create a 7-day crop care plan for ${disease} in ${crop}.

Answer ONLY in this format:

Day 1:
- one action

Day 3:
- one action

Day 5:
- one action

Day 7:
- one action

No extra explanation.`
    )

  : (
      lang === "ur"

        ? `${crop} میں ${disease} بیماری کے بارے میں بتائیں۔

صرف اس فارمیٹ میں جواب دیں:

وجہ:
- ...

علاج:
- ...

بچاؤ:
- ...

کوئی اضافی وضاحت نہ دیں۔`

        : `Tell me about ${disease} in ${crop}.

Answer ONLY in this format:

Cause:
- ...

Treatment:
- ...

Prevention:
- ...

No extra explanation.`
    );
 setMessages(prev => [

  ...prev,

  {
    id: Date.now(),
    from: "user",
    text: question,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

]);

  setSending(true);
try {

  const response =
    await fetch(
      `${API_URL}/chat`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          message: question,
          language: lang
        })
      }
    );

  const data =
    await response.json();

  setMessages(prev => [

    ...prev,

    {
      id: Date.now() + 1,
      from: "ai",
      text:
        data.reply ||
        "No response received.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }

  ]);

} catch (err) {

  console.error(err);

  setMessages(prev => [

    ...prev,

    {
      id: Date.now(),
      from: "ai",
      text:
        "Failed to generate crop information.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }

  ]);

} finally {

  setSending(false);

}}




  async function onSend(e) {

    e.preventDefault();

    if (!text.trim()) return;
 
 const userMsg = {
  id: Date.now(),
  from: "user",
  text: text.trim(),
  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })
};

    setMessages(prev => [
      ...prev,
      userMsg
    ]);

    setText("");
    setSending(true);

    console.log("LANG:", lang);
console.log("MESSAGE:", userMsg.text);

    try {

      const response =
        await fetch(
          "http://localhost:5000/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },
body: JSON.stringify({
  message: userMsg.text,
  language: lang
})
          }
        );

      const data =
        await response.json();

      setMessages(prev => [

        ...prev,

       {
  id: Date.now() + 1,
  from: "ai",
  text: data.reply || "No response received.",
  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })
}
      ]);

    } catch (err) {

  console.error(err);

  setMessages(prev => [

    ...prev,

    {
      id: Date.now(),
      from: "ai",
      text: "Server connection failed.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }

  ]);



    } finally {

      setSending(false);

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
<div className={styles.title}>
  {t("chat")}
</div>

<button
  className={styles.clearBtn}
  onClick={() => {

    localStorage.removeItem(
      "kd-chat"
    );

    setMessages([
      {
        id: 1,
        from: "ai",
        text:
          lang === "ur"
            ? "فصلوں کی بیماریوں کے بارے میں پوچھیں۔"
            : "Ask me about crop diseases and their treatment."
      }
    ]);

  }}
>
  🗑
</button>
      </div>

      <div className={styles.container}>

        <div
          ref={listRef}
          className={styles.messageList}
        >
{messages.length === 1 && (

  <div className={styles.welcomeCard}>

    <div className={styles.welcomeIcon}>
      🤖
    </div>

    <h3>AgroVision AI</h3>

    <p>
      {lang === "ur"
        ? "فصلوں، کھاد، آبپاشی اور بیماریوں کے بارے میں پوچھیں"
        : "Ask about crop diseases, fertilizers, irrigation and farming advice"}
    </p>

  </div>

)}

{messages.length === 1 && (

  <div className={styles.quickQuestions}>

    <button
      onClick={() =>
        setText(
          lang === "ur"
            ? "گندم کی عام بیماریاں"
            : "Common wheat diseases"
        )
      }
    >
      🌾 Wheat
    </button>

    <button
      onClick={() =>
        setText(
          lang === "ur"
            ? "کھاد کے مشورے"
            : "Fertilizer advice"
        )
      }
    >
      🌱 Fertilizer
    </button>

    <button
      onClick={() =>
        setText(
          lang === "ur"
            ? "آبپاشی کے طریقے"
            : "Irrigation tips"
        )
      }
    >
      💧 Irrigation
    </button>

    <button
      onClick={() =>
        setText(
          lang === "ur"
            ? "کیڑوں کا علاج"
            : "Pest control"
        )
      }
    >
      🪲 Pests
    </button>

  </div>

)}

          {messages.map(m => (

  <div
    key={m.id}
    className={
      m.from === "user"
        ? styles.rowUser
        : styles.rowAi
    }
  >

    <div className={styles.avatar}>
      {m.from === "user"
        ? "👨‍🌾"
        : "🤖"}
    </div>
<div
  className={
    m.from === "user"
      ? styles.bubbleUser
      : styles.bubbleAi
  }
>
  <div>{m.text}</div>

  <div className={styles.messageTime}>
    {m.time}
  </div>
</div>

  </div>

))}
          {sending && (

  <div className={styles.rowAi}>

    <div className={styles.bubbleAi}>
      {lang === "ur"
  ? "🤖 اے آئی جواب تیار کر رہا ہے..."
  : "🤖 AI is thinking..."}
    </div>

  </div>

)}

        </div>

        <form
          onSubmit={onSend}
          className={styles.composer}
        >

          <input
            className={styles.input}
            placeholder={t("typeMessage")}
            value={text}
            onChange={e =>
              setText(e.target.value)
            }
            disabled={sending}
          />

   

          <button
            className={styles.sendBtn}
            type="submit"
            disabled={sending}
          >
            {sending
              ? "..."
              : "Send"}
          </button>

        </form>

      </div>

    </div>
  );
}