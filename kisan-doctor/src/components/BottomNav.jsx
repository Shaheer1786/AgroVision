import { useNavigate, useLocation } from "react-router-dom";
import styles from "./BottomNav.module.css";

export default function BottomNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const tabs = [
    { path: "/dashboard", icon: "🏠", label: "Home" },
    { path: "/select-crop", icon: "📷", label: "Scan" },
    { path: "/chat", icon: "💬", label: "Chat" },
    { path: "/settings", icon: "⚙️", label: "Settings" }
  ];

  return (
    <nav className={styles.nav}>
      {tabs.map(tab => {
        const active = pathname === tab.path;
        return (
          <button
            key={tab.path}
            className={`${styles.tab} ${active ? styles.active : ""}`}
            onClick={() => nav(tab.path)}
          >
            <div className={styles.icon}>{tab.icon}</div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
