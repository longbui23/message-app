import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/Setting";
import Navbar from "./components/Navbar/NavBar";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/setting" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
