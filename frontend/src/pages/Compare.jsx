import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, Loader2, AlertTriangle, FileText } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const UploadBox = ({ file, onFile, label }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") onFile(f);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => document.getElementById(`file-${label}`).click()}
      style={{
        border: `2px dashed ${dragOver ? "#6366f1" : file ? "#22c55e" : "#2e2e3e"}`,
        borderRadius: "16px", padding: "40px 24px", cursor: "pointer", textAlign: "center",
        background: file ? "rgba(34,197,94,0.04)" : dragOver ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.01)",
        transition: "all 0.3s", flex: 1
      }}>
      <input id={`file-${label}`} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
      {file ? (
        <div>
          <CheckCircle size={40} color="#22c55e" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontWeight: "700", color: "#22c55e", fontSize: "14px" }}>{file.name}</p>
          <p style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>{(file.size / 1024).toFixed(1)} KB</p>
        </div>
      ) : (
        <div>
          <Upload size={40} color="#6366f1" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>{label}</p>
          <p style={{ color: "#64748b", fontSize: "13px" }}>Drop PDF or click to browse</p>
        </div>
      )}
    </div>
  );
};

const RiskBadge = ({ risk }) => {
  const colors = { High: "#ef4444", Medium: "#f97316", Low: "#22c55e" };
  const color = colors[risk] || "#6366f1";
  return <span style={{ background: color + "20", color, padding: "2px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "700", border: `1px solid ${color}40` }}>{risk}</span>;
};

const ScoreCircle = ({ score, label }) => {
  const color = score >= 70 ? "#ef4444" : score >= 40 ? "#f97316" : "#22c55e";
  return (
    <div style={{ textAlign: "center", padding: "24px" }}>
      <div style={{ fontSize: "48px", fontWeight: "900", color }}>{score}</div>
      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>/ 100 Risk Score</div>
      <div style={{ marginTop: "8px" }}>
        <span style={{ background: color + "20", color, padding: "4px 12px", borderRadius: "12px", fontSize: "13px", fontWeight: "600" }}>
          {score >= 70 ? "High Risk" : score >= 40 ? "Medium Risk" : "Low Risk"}
        </span>
      </div>
      <div style={{ marginTop: "12px", fontSize: "14px", fontWeight: "700", color: "#94a3b8" }}>{label}</div>
    </div>
  );
};

export default function Compare() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);
  const [language, setLanguage] = useState("English");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const languages = [
  { code: "English", label: "🇬🇧 English" },
  { code: "Hindi", label: "🇮🇳 Hindi" },
  { code: "Marathi", label: "🇮🇳 Marathi" },
  { code: "Bengali", label: "🇮🇳 Bengali" },
  { code: "Tamil", label: "🇮🇳 Tamil" },
  { code: "French", label: "🇫🇷 French" },
  { code: "Spanish", label: "🇪🇸 Spanish" },
];

  const analyze = async () => {
    if (!file1 || !file2) { setError("Please upload both documents."); return; }
    setLoading(true); setError(null);
    try {
      const [res1, res2] = await Promise.all([
        axios.post(`${API_URL}/analyze`, (() => { const f = new FormData(); f.append("file", file1); f.append("language", language); return f; })()),
        axios.post(`${API_URL}/analyze`, (() => { const f = new FormData(); f.append("file", file2); f.append("language", language); return f; })()),
      ]);
      setResult1(res1.data);
      setResult2(res2.data);
    } catch {
      setError("Analysis failed. Make sure backend is running.");
    }
    setLoading(false);
  };

  const winner = result1 && result2
    ? result1.risk_score < result2.risk_score ? "Doc 1" : result2.risk_score < result1.risk_score ? "Doc 2" : "Tie"
    : null;

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e1e2e", padding: "40px 20px", textAlign: "center", background: "rgba(99,102,241,0.03)" }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: "36px", fontWeight: "800", letterSpacing: "-1px", marginBottom: "10px" }}>
          Compare{" "}
          <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Two Documents
          </span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ color: "#64748b", fontSize: "16px" }}>
          Upload two contracts and compare their risk side by side
        </motion.p>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 20px" }}>

        {/* Language Selector */}
<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
  style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
  <span style={{ fontSize: "14px", color: "#64748b" }}>🌍 Analysis Language:</span>
  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid #2e2e3e",
      borderRadius: "10px", padding: "8px 16px", color: "#fff", fontSize: "14px",
      outline: "none", cursor: "pointer"
    }}>
    {languages.map(l => (
      <option key={l.code} value={l.code} style={{ background: "#0a0a0f" }}>{l.label}</option>
    ))}
  </select>
</motion.div>


        {/* Upload boxes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", gap: "20px", marginBottom: "24px", flexWrap: "wrap" }}>
          <UploadBox file={file1} onFile={setFile1} label="Document 1" />
          <div style={{ display: "flex", alignItems: "center", fontSize: "20px", color: "#334155", fontWeight: "700" }}>VS</div>
          <UploadBox file={file2} onFile={setFile2} label="Document 2" />
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ background: "#ef444415", border: "1px solid #ef444440", borderRadius: "12px", padding: "14px 20px", marginBottom: "20px", color: "#ef4444", fontSize: "14px" }}>
            {error}
          </motion.div>
        )}

        {!loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "40px" }}>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={analyze}
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none",
                padding: "18px 60px", borderRadius: "14px", fontSize: "17px", fontWeight: "700",
                cursor: "pointer", boxShadow: "0 8px 32px rgba(99,102,241,0.35)"
              }}>
              ⚖️ Compare Documents
            </motion.button>
          </motion.div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "60px 0" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "inline-block", marginBottom: "20px" }}>
              <Loader2 size={48} color="#6366f1" />
            </motion.div>
            <p style={{ color: "#94a3b8" }}>Analyzing both documents...</p>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result1 && result2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Winner banner */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: winner === "Tie" ? "rgba(99,102,241,0.1)" : "rgba(34,197,94,0.08)", border: `1px solid ${winner === "Tie" ? "rgba(99,102,241,0.3)" : "rgba(34,197,94,0.3)"}`, borderRadius: "16px", padding: "20px", textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontWeight: "800" }}>
                  {winner === "Tie" ? "🤝 Both documents have equal risk" : `✅ ${winner} is safer to sign`}
                </p>
                <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Based on AI risk analysis</p>
              </motion.div>

              {/* Risk scores */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1e2e", borderRadius: "20px", display: "flex" }}>
                <ScoreCircle score={result1.risk_score} label="Document 1" />
                <div style={{ width: "1px", background: "#1e1e2e" }} />
                <ScoreCircle score={result2.risk_score} label="Document 2" />
              </motion.div>

              {/* Side by side comparison */}
              {[
                { title: "📋 Summary", key: "summary", render: (v) => <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.7" }}>{v}</p> },
              ].map(({ title, key, render }) => (
                <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1e2e", borderRadius: "20px", overflow: "hidden" }}>
                  <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e1e2e", fontWeight: "700", fontSize: "15px" }}>{title}</div>
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: 1, padding: "20px 24px", borderRight: "1px solid #1e1e2e" }}>
                      <p style={{ fontSize: "12px", color: "#6366f1", fontWeight: "700", marginBottom: "8px" }}>DOC 1</p>
                      {render(result1[key])}
                    </div>
                    <div style={{ flex: 1, padding: "20px 24px" }}>
                      <p style={{ fontSize: "12px", color: "#a78bfa", fontWeight: "700", marginBottom: "8px" }}>DOC 2</p>
                      {render(result2[key])}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Risky clauses comparison */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1e2e", borderRadius: "20px", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e1e2e", fontWeight: "700", fontSize: "15px" }}>
                  <AlertTriangle size={16} color="#f97316" style={{ display: "inline", marginRight: "8px" }} />
                  Risky Clauses Comparison
                </div>
                <div style={{ display: "flex" }}>
                  {[result1, result2].map((r, idx) => (
                    <div key={idx} style={{ flex: 1, padding: "20px 24px", borderRight: idx === 0 ? "1px solid #1e1e2e" : "none" }}>
                      <p style={{ fontSize: "12px", color: idx === 0 ? "#6366f1" : "#a78bfa", fontWeight: "700", marginBottom: "12px" }}>DOC {idx + 1}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {r.risky_clauses?.map((c, i) => (
                          <div key={i} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid #1e1e2e" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                              <span style={{ fontSize: "13px", fontWeight: "600" }}>{c.clause}</span>
                              <RiskBadge risk={c.risk} />
                            </div>
                            <p style={{ color: "#64748b", fontSize: "12px" }}>{c.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recommendations comparison */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1e2e", borderRadius: "20px", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e1e2e", fontWeight: "700", fontSize: "15px" }}>✅ Recommendations</div>
                <div style={{ display: "flex" }}>
                  {[result1, result2].map((r, idx) => (
                    <div key={idx} style={{ flex: 1, padding: "20px 24px", borderRight: idx === 0 ? "1px solid #1e1e2e" : "none" }}>
                      <p style={{ fontSize: "12px", color: idx === 0 ? "#6366f1" : "#a78bfa", fontWeight: "700", marginBottom: "12px" }}>DOC {idx + 1}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {r.recommendations?.map((rec, i) => (
                          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                            <CheckCircle size={14} color="#22c55e" style={{ marginTop: "3px", flexShrink: 0 }} />
                            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.6" }}>{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Compare again */}
              <motion.div style={{ textAlign: "center", paddingBottom: "40px" }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setResult1(null); setResult2(null); setFile1(null); setFile2(null); }}
                  style={{ background: "transparent", color: "#6366f1", border: "2px solid #6366f140", padding: "14px 40px", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                  ↑ Compare New Documents
                </motion.button>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}