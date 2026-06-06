import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Auth from "./pages/Auth";
import Compare from "./pages/Compare";

function ProtectedRoute({ children, user }) {
  if (user === null) return <Navigate to="/auth" />;
  if (user === undefined) return null;
  return children;
}

export default function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar user={user} /><Home /></>} />
        <Route path="/auth" element={user ? <Navigate to="/analyze" /> : <Auth />} />
        <Route path="/analyze" element={<><Navbar user={user} /><Analyze user={user} /></>} />
        <Route path="/compare" element={
          <ProtectedRoute user={user}>
            <Navbar user={user} /><Compare />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}