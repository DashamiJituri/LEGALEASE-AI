import { Link, useLocation, useNavigate } from "react-router-dom";
import { Scale, LogOut } from "lucide-react";
import { supabase } from "../supabase";

export default function Navbar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav style={{
      padding: "20px 40px", borderBottom: "1px solid #1e1e2e", display: "flex",
      alignItems: "center", justifyContent: "space-between",
      background: "rgba(10,10,15,0.8)", backdropFilter: "blur(20px)",
      position: "sticky", top: 0, zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Scale size={20} color="#fff" />
        </div>
        <span style={{ fontSize: "20px", fontWeight: "800", background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          LegalEase AI
        </span>
      </Link>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Link to="/" style={{
          textDecoration: "none", padding: "8px 18px", borderRadius: "10px", fontSize: "14px", fontWeight: "600",
          color: location.pathname === "/" ? "#fff" : "#64748b",
          background: location.pathname === "/" ? "#6366f120" : "transparent",
          border: location.pathname === "/" ? "1px solid #6366f140" : "1px solid transparent"
        }}>Home</Link>

        {user && <>
          <Link to="/analyze" style={{
            textDecoration: "none", padding: "8px 18px", borderRadius: "10px", fontSize: "14px", fontWeight: "600",
            color: location.pathname === "/analyze" ? "#fff" : "#64748b",
            background: location.pathname === "/analyze" ? "#6366f120" : "transparent",
            border: location.pathname === "/analyze" ? "1px solid #6366f140" : "1px solid transparent"
          }}>Analyze</Link>

          <Link to="/compare" style={{
            textDecoration: "none", padding: "8px 18px", borderRadius: "10px", fontSize: "14px", fontWeight: "600",
            color: location.pathname === "/compare" ? "#fff" : "#64748b",
            background: location.pathname === "/compare" ? "#6366f120" : "transparent",
            border: location.pathname === "/compare" ? "1px solid #6366f140" : "1px solid transparent"
          }}>Compare</Link>
        </>}

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#475569" }}>{user.email?.split("@")[0]}</span>
            <button onClick={logout} style={{
              background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)",
              padding: "8px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: "600",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
            }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <Link to="/auth">
            <button style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none",
              padding: "10px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer"
            }}>
              Sign In →
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}