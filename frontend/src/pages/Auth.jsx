import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { Scale } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/analyze");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your email to confirm signup!");
      }
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", padding: "20px" }}>
      
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "30%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "20%", width: "30vw", height: "30vw", background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 60%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: "420px", background: "rgba(255,255,255,0.03)", border: "1px solid #1e1e2e", borderRadius: "24px", padding: "48px 40px", backdropFilter: "blur(20px)", position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px", justifyContent: "center" }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Scale size={20} color="#fff" />
          </div>
          <span style={{ fontSize: "20px", fontWeight: "800", background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            LegalEase AI
          </span>
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", textAlign: "center", letterSpacing: "-1px" }}>
          {isLogin ? "Welcome back" : "Create account"}
        </h1>
        <p style={{ color: "#475569", fontSize: "14px", textAlign: "center", marginBottom: "32px", fontFamily: "'DM Sans', sans-serif" }}>
          {isLogin ? "Sign in to continue analyzing documents" : "Start analyzing legal documents for free"}
        </p>

        {/* Email */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>Email</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "14px 16px", color: "#fff", fontSize: "15px", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>Password</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "14px 16px", color: "#fff", fontSize: "15px", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
          />
        </div>

        {message && (
          <div style={{ background: message.includes("Check") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${message.includes("Check") ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", fontSize: "14px", color: message.includes("Check") ? "#22c55e" : "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>
            {message}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleAuth} disabled={loading}
          style={{ width: "100%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginBottom: "20px", fontFamily: "'Syne', sans-serif", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
        </motion.button>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setMessage(""); }}
            style={{ color: "#6366f1", cursor: "pointer", fontWeight: "600" }}>
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </p>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        input::placeholder { color: #334155; }
        input:focus { border-color: #6366f1 !important; }
      `}</style>
    </div>
  );
}