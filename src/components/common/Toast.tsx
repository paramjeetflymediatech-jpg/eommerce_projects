"use client";
import { useNotificationStore } from "@/store/notificationStore";
import { useEffect, useState } from "react";

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotificationStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={styles.container}>
      {notifications.map((n) => (
        <div key={n.id} style={{ ...styles.toast, borderLeft: `4px solid ${n.type === "error" ? "#000" : "#000"}` }}>
          <div style={styles.content}>
            <p style={styles.message}>{n.message}</p>
          </div>
          <button onClick={() => removeNotification(n.id)} style={styles.close}>✕</button>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "fixed",
    top: "100px", 
    left: "32px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "360px",
    width: "100%",
    pointerEvents: "none",
  },
  toast: {
    background: "#fff",
    color: "#000",
    padding: "20px 24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    border: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    pointerEvents: "auto",
    animation: "slideInToast 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards",
  },
  content: { flex: 1 },
  message: { margin: 0, fontSize: "0.85rem", fontWeight: 700, letterSpacing: "normal" },
  close: { background: "none", border: "none", cursor: "pointer", fontSize: "0.7rem", color: "#ccc", padding: "4px" },
};

// Global style for animation
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes slideInToast {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
