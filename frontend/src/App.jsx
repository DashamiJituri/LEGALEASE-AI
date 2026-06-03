import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/analyze" element={<><Navbar /><Analyze /></>} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}