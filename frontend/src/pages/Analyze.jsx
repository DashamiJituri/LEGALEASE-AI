import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ChatBox = ({ result }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I've analyzed your document. Ask me anything about it — specific clauses, risks, or recommendations." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const sessionId = useRef(Math.random().toString(36).substring(7));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const context = result ? `
    Summary: ${result.summary}
    Risk Score: ${result.risk_score}
    Risky Clauses: ${result.risky_clauses?.map(c => `${c.clause} (${c.risk}): ${c.explanation}`).join(", ")}
    Recommendations: ${result.recommendations?.join(", ")}
  ` : "";

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/chat`, {
        session_id: sessionId.current,
        question: userMsg,
        context
      });
      setMessages(prev => [...prev, { role: "assistant", content: res.data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Try again." }]);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ height: "300px", overflowY: "auto", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%", padding: "12px 16px",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.05)",
              border: msg.role === "user" ? "none" : "1px solid #1e1e2e",
              fontSize: "14px", lineHeight: "1.6", color: "#fff"
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.05)", border: "1px solid #1e1e2e", fontSize: "14px", color: "#64748b" }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about any clause, risk, or recommendation..."
          style={{
            flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid #1e1e2e",
            borderRadius: "12px", padding: "14px 16px", color: "#fff", fontSize: "14px",
            outline: "none", fontFamily: "'DM Sans', sans-serif"
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={sendMessage} disabled={loading}
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none",
            padding: "14px 24px", borderRadius: "12px", fontSize: "14px", fontWeight: "700",
            cursor: "pointer", opacity: loading ? 0.7 : 1
          }}>
          Send
        </motion.button>
      </div>
    </div>
  );
};

const RiskMeter = ({ score }) => {
  const color = score >= 70 ? "#ef4444" : score >= 40 ? "#f97316" : "#22c55e";
  const label = score >= 70 ? "High Risk" : score >= 40 ? "Medium Risk" : "Low Risk";
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ textAlign: "center", padding: "32px" }}>
      <p style={{ color: "#94a3b8", marginBottom: "24px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "2px" }}>Contract Risk Score</p>
      <div style={{ position: "relative", display: "inline-block" }}>
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r="54" fill="none" stroke="#1e1e2e" strokeWidth="10" />
          <motion.circle
            cx="70" cy="70" r="54" fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ fontSize: "32px", fontWeight: "800", color }}>{score}</motion.span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>/ 100</span>
        </div>
      </div>
      <div style={{ marginTop: "16px" }}>
        <span style={{ background: color + "20", color, padding: "6px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "600", border: `1px solid ${color}40` }}>
          {label}
        </span>
      </div>
    </div>
  );
};

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f); setError(null); setResult(null);
    } else {
      setError("Only PDF files are supported.");
    }
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${API_URL}/analyze`, formData);
      setResult(res.data);
    } catch (e) {
      setError("Analysis failed. Make sure backend is running.");
    }
    setLoading(false);
  };

  const clauseColor = (risk) => ({ High: "#ef444415", Medium: "#f9731615", Low: "#22c55e15" }[risk] || "#6366f115");
  const clauseBorder = (risk) => ({ High: "#ef4444", Medium: "#f97316", Low: "#22c55e" }[risk] || "#6366f1");

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ borderBottom: "1px solid #1e1e2e", padding: "40px 20px", textAlign: "center", background: "rgba(99,102,241,0.03)" }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: "36px", fontWeight: "800", letterSpacing: "-1px", marginBottom: "10px" }}>
          Analyze Your{" "}
          <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Legal Document
          </span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ color: "#64748b", fontSize: "16px" }}>
          Upload a PDF and get instant AI-powered analysis
        </motion.p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 20px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById("fileInput").click()}
            style={{
              border: `2px dashed ${dragOver ? "#6366f1" : file ? "#22c55e" : "#2e2e3e"}`,
              borderRadius: "20px", padding: "60px 40px", cursor: "pointer", textAlign: "center",
              background: dragOver ? "rgba(99,102,241,0.06)" : file ? "rgba(34,197,94,0.04)" : "rgba(255,255,255,0.01)",
              backdropFilter: "blur(10px)", transition: "all 0.3s", marginBottom: "24px",
              boxShadow: file ? "0 0 40px rgba(34,197,94,0.08)" : dragOver ? "0 0 40px rgba(99,102,241,0.15)" : "none"
            }}>
            <input id="fileInput" type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
            {file ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <CheckCircle size={56} color="#22c55e" style={{ margin: "0 auto 16px" }} />
                <p style={{ fontSize: "18px", fontWeight: "700", color: "#22c55e", marginBottom: "6px" }}>{file.name}</p>
                <p style={{ color: "#64748b", fontSize: "14px" }}>{(file.size / 1024).toFixed(1)} KB • Click to change</p>
              </motion.div>
            ) : (
              <div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Upload size={56} color="#6366f1" style={{ margin: "0 auto 20px" }} />
                </motion.div>
                <p style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Drop your PDF here</p>
                <p style={{ color: "#64748b", fontSize: "14px" }}>or click to browse • Contracts, agreements, legal docs</p>
              </div>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ background: "#ef444415", border: "1px solid #ef444440", borderRadius: "12px", padding: "14px 20px", marginBottom: "20px", color: "#ef4444", fontSize: "14px" }}>
            {error}
          </motion.div>
        )}

        {file && !loading && !result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "40px" }}>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 20px 60px rgba(99,102,241,0.45)" }}
              whileTap={{ scale: 0.97 }}
              onClick={analyze}
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none",
                padding: "18px 60px", borderRadius: "14px", fontSize: "17px", fontWeight: "700",
                cursor: "pointer", boxShadow: "0 8px 32px rgba(99,102,241,0.35)"
              }}>
              ✦ Analyze Document
            </motion.button>
          </motion.div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "60px 0" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "inline-block", marginBottom: "20px" }}>
              <Loader2 size={48} color="#6366f1" />
            </motion.div>
            <p style={{ color: "#94a3b8", fontSize: "16px" }}>AI is analyzing your document...</p>
            <p style={{ color: "#64748b", fontSize: "13px", marginTop: "8px" }}>This usually takes 10-20 seconds</p>
          </motion.div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1e2e", borderRadius: "20px", backdropFilter: "blur(20px)" }}>
                <RiskMeter score={result.risk_score} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1e2e", borderRadius: "20px", padding: "32px", backdropFilter: "blur(20px)" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px", color: "#e2e8f0" }}>
                  <FileText size={20} color="#6366f1" /> Plain English Summary
                </h2>
                <p style={{ color: "#94a3b8", lineHeight: "1.8", fontSize: "15px" }}>{result.summary}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1e2e", borderRadius: "20px", padding: "32px", backdropFilter: "blur(20px)" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <AlertTriangle size={20} color="#f97316" /> Risky Clauses
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {result.risky_clauses?.map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ background: clauseColor(c.risk), border: `1px solid ${clauseBorder(c.risk)}30`, borderRadius: "14px", padding: "18px", borderLeft: `3px solid ${clauseBorder(c.risk)}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontWeight: "700", fontSize: "15px" }}>{c.clause}</span>
                        <span style={{ background: clauseBorder(c.risk) + "20", color: clauseBorder(c.risk), padding: "3px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "700" }}>{c.risk}</span>
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>{c.explanation}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1e2e", borderRadius: "20px", padding: "32px", backdropFilter: "blur(20px)" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "20px" }}>📚 Key Legal Terms</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {result.key_terms?.map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                      style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "14px", padding: "18px" }}>
                      <p style={{ fontWeight: "700", color: "#a78bfa", marginBottom: "6px", fontSize: "14px" }}>{t.term}</p>
                      <p style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.6" }}>{t.definition}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1e2e", borderRadius: "20px", padding: "32px", backdropFilter: "blur(20px)" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "20px" }}>✅ Recommendations</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {result.recommendations?.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ display: "flex", alignItems: "flex-start", gap: "14px", background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: "14px", padding: "16px" }}>
                      <CheckCircle size={20} color="#22c55e" style={{ marginTop: "2px", flexShrink: 0 }} />
                      <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: "1.6" }}>{r}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1e2e", borderRadius: "20px", padding: "32px", backdropFilter: "blur(20px)" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  💬 Chat with Document
                </h2>
                <ChatBox result={result} />
              </motion.div>

              <motion.div style={{ textAlign: "center", paddingBottom: "40px" }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setResult(null); setFile(null); }}
                  style={{ background: "transparent", color: "#6366f1", border: "2px solid #6366f140", padding: "14px 40px", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                  ↑ Analyze Another Document
                </motion.button>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}