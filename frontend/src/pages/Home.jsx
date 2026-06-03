import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(".hero-word", 
      { opacity: 0, y: 80, rotateX: -40 },
      { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.08, ease: "power4.out", delay: 0.2 }
    );
    gsap.fromTo(".hero-sub", { opacity: 0 }, { opacity: 1, duration: 1, delay: 1 });
    gsap.fromTo(".hero-cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 1.2 });
    gsap.fromTo(".stat-item",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, delay: 1.4 }
    );
    gsap.fromTo(".feature-item",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".features-section", start: "top 75%" }
      }
    );
    gsap.fromTo(".step-item",
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, stagger: 0.15, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".steps-section", start: "top 75%" }
      }
    );
  }, []);

  return (
    <div style={{ background: "#080810", minHeight: "100vh", color: "#fff", fontFamily: "'Syne', sans-serif", overflowX: "hidden" }}>
      
      {/* Ambient background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 60%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "40%", left: "40%", width: "30vw", height: "30vw", background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 60%)", borderRadius: "50%" }} />
        {/* Grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "120px 40px 80px" }}>
        
        {/* Tag */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "40px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", padding: "6px 16px 6px 8px", borderRadius: "100px" }}>
          <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", borderRadius: "100px", padding: "4px 10px", fontSize: "11px", fontWeight: "700", color: "#fff", letterSpacing: "0.5px" }}>NEW</span>
          <span style={{ fontSize: "13px", color: "#a78bfa", fontWeight: "500" }}>AI-powered contract intelligence</span>
        </motion.div>

        {/* Giant title */}
        <div style={{ perspective: "800px", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "clamp(52px, 8vw, 96px)", fontWeight: "800", lineHeight: "1.0", letterSpacing: "-4px", margin: 0 }}>
            {["Legal", "Docs,"].map((word, i) => (
              <span key={i} className="hero-word" style={{ display: "inline-block", opacity: 0, marginRight: "0.25em" }}>{word}</span>
            ))}
            <br />
            {["Finally"].map((word, i) => (
              <span key={i} className="hero-word" style={{ display: "inline-block", opacity: 0, marginRight: "0.25em", background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 40%, #ec4899 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{word}</span>
            ))}
            {["Clear."].map((word, i) => (
              <span key={i} className="hero-word" style={{ display: "inline-block", opacity: 0, color: "#fff" }}>{word}</span>
            ))}
          </h1>
        </div>

        {/* Sub + CTA side by side */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "40px", marginBottom: "80px" }}>
          <p className="hero-sub" style={{ opacity: 0, fontSize: "18px", color: "#64748b", maxWidth: "480px", lineHeight: "1.8", fontFamily: "'DM Sans', sans-serif", fontWeight: "400" }}>
            Upload any contract or legal PDF. Get instant risk analysis, plain English summaries, and recommendations — powered by AI.
          </p>
          <div className="hero-cta" style={{ opacity: 0, display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end" }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/analyze")}
              style={{
                background: "#fff", color: "#080810", border: "none",
                padding: "18px 40px", borderRadius: "100px", fontSize: "16px", fontWeight: "700",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
                fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.4)"
              }}>
              Analyze for free
              <span style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>→</span>
            </motion.button>
            <span style={{ fontSize: "12px", color: "#334155" }}>No signup required</span>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: "0", borderTop: "1px solid #1e1e2e", borderBottom: "1px solid #1e1e2e" }}>
          {[["10M+", "Documents analyzed"], ["< 30s", "Analysis time"], ["5 Types", "Of risk detected"], ["Free", "No credit card"]].map(([val, label], i) => (
            <div key={i} className="stat-item" style={{
              opacity: 0, flex: 1, padding: "24px 32px",
              borderRight: i < 3 ? "1px solid #1e1e2e" : "none"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "4px" }}>{val}</div>
              <div style={{ fontSize: "13px", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="features-section" style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "100px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "64px", flexWrap: "wrap", gap: "24px" }}>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "800", letterSpacing: "-2px", lineHeight: "1.1", maxWidth: "500px" }}>
            Everything your<br />
            <span style={{ color: "#475569" }}>contract needs.</span>
          </h2>
          <p style={{ color: "#475569", fontSize: "15px", maxWidth: "300px", lineHeight: "1.7", fontFamily: "'DM Sans', sans-serif" }}>
            From risk detection to plain language summaries — all in one place.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "#1e1e2e", borderRadius: "20px", overflow: "hidden" }}>
          {[
            { num: "01", title: "Risk Scoring", desc: "Every clause scored High, Medium, or Low risk with detailed explanations.", accent: "#6366f1" },
            { num: "02", title: "Plain English", desc: "Dense legal language translated into clear, simple terms anyone can understand.", accent: "#a78bfa" },
            { num: "03", title: "Key Terms", desc: "Important legal definitions extracted and explained automatically.", accent: "#ec4899" },
            { num: "04", title: "Recommendations", desc: "Actionable suggestions on what to negotiate or flag before signing.", accent: "#f97316" },
            { num: "05", title: "Instant Results", desc: "Full document analysis in under 30 seconds — no waiting around.", accent: "#22c55e" },
            { num: "06", title: "Any Document", desc: "Works on employment contracts, NDAs, rental agreements, and more.", accent: "#06b6d4" },
          ].map((f, i) => (
            <motion.div key={i} className="feature-item"
              whileHover={{ background: "rgba(99,102,241,0.05)" }}
              style={{ opacity: 0, background: "#080810", padding: "40px 32px", transition: "background 0.3s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <span style={{ fontSize: "11px", color: "#334155", fontWeight: "600", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif" }}>{f.num}</span>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: f.accent }} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px", letterSpacing: "-0.5px" }}>{f.title}</h3>
              <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.7", fontFamily: "'DM Sans', sans-serif" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="steps-section" style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "0 40px 100px" }}>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "800", letterSpacing: "-2px", marginBottom: "64px" }}>
          Three steps.<br />
          <span style={{ color: "#475569" }}>That's it.</span>
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {[
            { n: "1", title: "Upload your document", desc: "Drag & drop or click to upload any PDF — contracts, NDAs, leases, employment agreements." },
            { n: "2", title: "AI analyzes every clause", desc: "Our AI reads through every line, identifying risks, key terms, and important clauses instantly." },
            { n: "3", title: "Get your full report", desc: "Risk score, plain English summary, clause breakdown, and recommendations — all in one view." },
          ].map((s, i) => (
            <div key={i} className="step-item" style={{
              opacity: 0, display: "flex", gap: "40px", alignItems: "center",
              padding: "32px 40px", background: "rgba(255,255,255,0.01)", border: "1px solid #1e1e2e", borderRadius: "16px"
            }}>
              <span style={{ fontSize: "64px", fontWeight: "900", color: "#1e1e2e", flexShrink: 0, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>0{s.n}</span>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", letterSpacing: "-0.5px" }}>{s.title}</h3>
                <p style={{ color: "#475569", fontSize: "15px", lineHeight: "1.7", fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ position: "relative", zIndex: 1, margin: "0 40px 80px", borderRadius: "24px", background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.08) 100%)", border: "1px solid rgba(99,102,241,0.2)", padding: "80px 40px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "24px", background: "radial-gradient(ellipse at center top, rgba(99,102,241,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
        <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "800", letterSpacing: "-2px", marginBottom: "20px", position: "relative" }}>
          Read before you sign.
        </h2>
        <p style={{ color: "#64748b", fontSize: "17px", marginBottom: "40px", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
          Never sign a contract you don't fully understand again.
        </p>
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 20px 60px rgba(99,102,241,0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/analyze")}
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none",
            padding: "20px 56px", borderRadius: "100px", fontSize: "17px", fontWeight: "700",
            cursor: "pointer", position: "relative", fontFamily: "'Syne', sans-serif",
            boxShadow: "0 8px 32px rgba(99,102,241,0.3)"
          }}>
          Analyze your document →
        </motion.button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #080810; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080810; }
        ::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 2px; }
      `}</style>
    </div>
  );
}