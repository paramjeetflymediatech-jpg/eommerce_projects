import Link from "next/link";

export default function NotFound() {
  return (
    <div style={s.page}>
      <div style={s.content}>
        <span style={s.code}>404</span>
        <h1 style={s.title}>The Object has <br/> Shifted.</h1>
        <p style={s.subtitle}>
          The page you are looking for has been moved, renamed, or simply never existed in our collection.
        </p>
        <Link href="/" className="btn" style={s.btn}>
          Return to Sanctuary
        </Link>
      </div>
      
      {/* Background Decor */}
      <div style={s.bgText}>404</div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { 
    height: "100vh", background: "#fff", display: "flex", 
    alignItems: "center", justifyContent: "center", position: "relative",
    overflow: "hidden"
  },
  content: { 
    textAlign: "center", zIndex: 1, maxWidth: 500, padding: 24 
  },
  code: { 
    fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.5em", 
    color: "#ccc", display: "block", marginBottom: 24 
  },
  title: { 
    fontSize: "clamp(2.5rem, 8vw, 4rem)", fontWeight: 400, 
    fontFamily: "var(--font-serif)", color: "#000", margin: "0 0 24px 0",
    lineHeight: 1.1 
  },
  subtitle: { 
    fontSize: "1rem", color: "#666", fontWeight: 300, 
    lineHeight: 1.8, marginBottom: 48 
  },
  btn: { 
    padding: "18px 48px", background: "#000", color: "#fff", 
    textDecoration: "none", display: "inline-block" 
  },
  bgText: {
    position: "absolute",
    fontSize: "40vw",
    fontWeight: 900,
    color: "#f9f9f7",
    bottom: "-10vh",
    right: "-5vw",
    lineHeight: 1,
    zIndex: 0,
    userSelect: "none",
    pointerEvents: "none"
  }
};
