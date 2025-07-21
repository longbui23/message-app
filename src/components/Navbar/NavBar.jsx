import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("userId"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getLinkStyle = (isActive) => ({
    textDecoration: "none",
    color: isActive ? "#fff" : "#333",
    fontWeight: isActive ? "700" : "500",
    padding: "8px 16px",
    borderRadius: "20px",
    backgroundColor: isActive ? "#4f46e5" : "transparent",
    transition: "all 0.3s ease",
  });

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContent}>
        {isLoggedIn ? (
          <>
            <NavLink to="/chat" style={({ isActive }) => getLinkStyle(isActive)}>
              💬 Chat
            </NavLink>
            <NavLink to="/setting" style={({ isActive }) => getLinkStyle(isActive)}>
              ⚙️ Settings
            </NavLink>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <NavLink to="/" style={({ isActive }) => getLinkStyle(isActive)}>
            🔑 Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "linear-gradient(to right, #f8fafc, #e0e7ff)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    padding: "12px 0",
    zIndex: 1000,
  },
  navContent: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
};
