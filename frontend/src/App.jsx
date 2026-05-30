import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, AlertTriangle, CheckCircle, Download, Loader2 } from "lucide-react";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf" || f.type.startsWith("image/")) {
      setFile(f);
      setError(null);
      setResult(null);
    } else {
      setError("Only PDF files are supported.");
    }
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:8000/analyze", formData);
      setResult(res.data);
    } catch (e) {
      setError("Analysis failed. Make sure backend is running.");
    }
    setLoading(false);
  };

  const getRiskColor = (score) => {
    if (score >= 70) return "#ef4444";
    if (score >= 40) return "#f97316";
    return "#22c55e";
  };

  const getRiskLabel = (score) => {
    if (score >= 70) return "High Risk";
    if (score >= 40) return "Medium Risk";
    return "Low Risk";
  };

  const clauseColor = (risk) => {
    if (risk === "High") return "#ef444420";
    if (risk === "Medium") return "#f9731620";
    return "#22c55e20";
  };

  const clauseBorder = (risk) => {
    if (risk === "High") return "#ef4444";
    if (risk === "Medium") return "#f97316";
    return "#22c55e";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Navbar */}
      <nav style={{ padding: "20px 40px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d0d1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={18} />
          </div>
          <span style={{ fontSize: "20px", fontWeight: "700", background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            LegalEase AI
          </span>
        </div>
        <span style={{ fontSize: "13px", color: "#6366f1", background: "#6366f115", padding: "4px 12px", borderRadius: "20px", border: "1px solid #6366f130" }}>
          Powered by Gemini
        </span>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 20px" }}>
        
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "800", lineHeight: "1.2", marginBottom: "16px" }}>
            Understand Any{" "}
            <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Legal Document
            </span>
          </h1>
          <p style={{ fontSize: "18px", color: "#94a3b8", maxWidth: "500px", margin: "0 auto" }}>
            Upload a contract or legal PDF — get instant plain English summary, risk analysis, and actionable insights.
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById("fileInput").click()}
          style={{
            border: `2px dashed ${dragOver ? "#6366f1" : file ? "#22c55e" : "#2e2e3e"}`,
            borderRadius: "16px", padding: "60px 40px", textAlign: "center", cursor: "pointer",
            background: dragOver ? "#6366f110" : file ? "#22c55e08" : "#0d0d1a",
            transition: "all 0.3s", marginBottom: "24px"
          }}>
          <input id="fileInput" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
          {file ? (
            <div>
              <CheckCircle size={48} color="#22c55e" style={{ margin: "0 auto 16px" }} />
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#22c55e" }}>{file.name}</p>
              <p style={{ color: "#64748b", fontSize: "14px" }}>{(file.size / 1024).toFixed(1)} KB — Click to change</p>
            </div>
          ) : (
            <div>
              <Upload size={48} color="#6366f1" style={{ margin: "0 auto 16px" }} />
              <p style={{ fontSize: "18px", fontWeight: "600" }}>Drop your PDF here</p>
              <p style={{ color: "#64748b", fontSize: "14px" }}>or click to browse</p>
            </div>
          )}
        </motion.div>

        {error && <p style={{ color: "#ef4444", textAlign: "center", marginBottom: "16px" }}>{error}</p>}

        {/* Analyze Button */}
        {file && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "48px" }}>
            <button onClick={analyze} style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none",
              padding: "16px 48px", borderRadius: "12px", fontSize: "16px", fontWeight: "600",
              cursor: "pointer", transition: "opacity 0.2s"
            }}>
              Analyze Document
            </button>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px" }}>
            <Loader2 size={48} color="#6366f1" style={{ margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "#94a3b8" }}>Analyzing your document with AI...</p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Risk Score */}
              <div style={{ background: "#0d0d1a", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
                <p style={{ color: "#94a3b8", marginBottom: "8px" }}>Contract Risk Score</p>
                <div style={{ fontSize: "72px", fontWeight: "800", color: getRiskColor(result.risk_score) }}>
                  {result.risk_score}
                </div>
                <span style={{ background: getRiskColor(result.risk_score) + "20", color: getRiskColor(result.risk_score), padding: "4px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "600" }}>
                  {getRiskLabel(result.risk_score)}
                </span>
              </div>

              {/* Summary */}
              <div style={{ background: "#0d0d1a", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "32px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileText size={20} color="#6366f1" /> Plain English Summary
                </h2>
                <p style={{ color: "#cbd5e1", lineHeight: "1.8" }}>{result.summary}</p>
              </div>

              {/* Risky Clauses */}
              <div style={{ background: "#0d0d1a", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "32px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertTriangle size={20} color="#f97316" /> Risky Clauses
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {result.risky_clauses?.map((c, i) => (
                    <div key={i} style={{ background: clauseColor(c.risk), border: `1px solid ${clauseBorder(c.risk)}`, borderRadius: "12px", padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontWeight: "600", fontSize: "15px" }}>{c.clause}</span>
                        <span style={{ background: clauseBorder(c.risk) + "30", color: clauseBorder(c.risk), padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>{c.risk}</span>
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: "14px" }}>{c.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Terms */}
              <div style={{ background: "#0d0d1a", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "32px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>📚 Key Legal Terms</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {result.key_terms?.map((t, i) => (
                    <div key={i} style={{ background: "#6366f110", border: "1px solid #6366f130", borderRadius: "12px", padding: "16px" }}>
                      <p style={{ fontWeight: "600", color: "#a78bfa", marginBottom: "4px" }}>{t.term}</p>
                      <p style={{ color: "#94a3b8", fontSize: "14px" }}>{t.definition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div style={{ background: "#0d0d1a", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "32px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>✅ Recommendations</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {result.recommendations?.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <CheckCircle size={20} color="#22c55e" style={{ marginTop: "2px", flexShrink: 0 }} />
                      <p style={{ color: "#cbd5e1" }}>{r}</p>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}