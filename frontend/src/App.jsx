import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Closet from "./pages/Closet";
import Outfits from "./pages/Outfits";
import Calendar from "./pages/Calendar";
import Feed from "./pages/Feed";
import Home from "./pages/Home";
import "./index.css";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/closet" element={<Closet />} />
        <Route path="/outfits" element={<Outfits />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;