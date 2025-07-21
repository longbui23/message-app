import { useState, useEffect } from "react";
import {
  loginUser,
  loginWithGoogle,
  loginWithFacebook,
  logoutUser,
} from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login({ onSwitchToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const clearError = () => {
    setError("");
  };

  // Load user session and redirect if already logged in
  useEffect(() => {
    const uid = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail");
    const displayName = localStorage.getItem("userName");
    if (uid) {
      const user = { uid, email, displayName };
      setLoggedInUser(user);
      navigate("/chat"); // redirect to chat automatically
    }
  }, [navigate]);

  const saveUserToStorage = (user) => {
    localStorage.setItem("userId", user.uid);
    localStorage.setItem("userEmail", user.email || "");
    localStorage.setItem("userName", user.displayName || "");
  };

  const clearStorage = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
  };

  const redirectToChat = (user) => {
    saveUserToStorage(user);
    setLoggedInUser(user);
    navigate("/chat"); // redirect immediately after login
  };

  // Email & Password login
  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);
    try {
      const user = await loginUser(email, password);
      redirectToChat(user);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Google login
  const handleLoginWithGoogle = async () => {
    clearError();
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      redirectToChat(user);
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Facebook login
  const handleLoginWithFacebook = async () => {
    clearError();
    setIsLoading(true);
    try {
      const user = await loginWithFacebook();
      redirectToChat(user);
    } catch (err) {
      setError(err.message || "Facebook login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setLoggedInUser(null);
      clearStorage();
      setEmail("");
      setPassword("");
      navigate("/"); // redirect to login page after logout
    } catch (err) {
      setError(err.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {!loggedInUser ? (
        <div style={styles.form}>
          <h2 style={styles.heading}>LOGIN</h2>

          <div style={styles.inputGroup}>
            <span style={styles.icon}>📧</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                clearError();
                setEmail(e.target.value);
              }}
              style={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <div style={styles.inputGroup}>
            <span style={styles.icon}>🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                clearError();
                setPassword(e.target.value);
              }}
              style={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <div style={styles.rememberMe}>
            <input type="checkbox" id="remember" disabled={isLoading} />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button
            type="submit"
            style={{
              ...styles.loginButton,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            disabled={isLoading}
            onClick={handleLogin}
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>

          {error && <p style={styles.error}>{error}</p>}

          <p style={styles.altText}>Or login with</p>
          <div style={styles.socialButtons}>
            <button
              type="button"
              style={styles.socialBtn}
              onClick={handleLoginWithFacebook}
              disabled={isLoading}
            >
              Facebook
            </button>
            <button
              type="button"
              style={styles.socialBtn}
              onClick={handleLoginWithGoogle}
              disabled={isLoading}
            >
              Google
            </button>
          </div>

          <p style={styles.signUpText}>
            Not a member?{" "}
            <button
              onClick={onSwitchToSignUp}
              style={styles.signUpButton}
              disabled={isLoading}
              type="button"
            >
              Sign up now
            </button>
          </p>
        </div>
      ) : (
        <div style={styles.loggedInBox}>
          <h3 style={styles.welcomeText}>
            Welcome, {loggedInUser.displayName || loggedInUser.email}
          </h3>
          <p style={styles.userEmail}>{loggedInUser.email}</p>
          <button
            style={{
              ...styles.logoutButton,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? "LOGGING OUT..." : "LOGOUT"}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    backgroundColor: "#f9fafb",
  },
  form: {
    width: "100%",
    maxWidth: "28rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1f2937",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    marginBottom: "1rem",
    padding: "0.5rem 0.75rem",
    backgroundColor: "#f9fafb",
    transition: "border-color 0.2s ease",
  },
  icon: {
    marginRight: "0.75rem",
    fontSize: "16px",
    color: "#6b7280",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "1rem",
    color: "#1f2937",
    minWidth: 0,
  },
  rememberMe: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
    fontSize: "0.875rem",
    color: "#4b5563",
  },
  loginButton: {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#ec4899",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "1.25rem",
    transition: "background-color 0.2s ease, opacity 0.2s ease",
  },
  altText: {
    textAlign: "center",
    marginBottom: "0.75rem",
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  socialButtons: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1.25rem",
  },
  socialBtn: {
    flex: 1,
    padding: "0.5rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#fff",
    fontWeight: "500",
    fontSize: "0.875rem",
    transition: "background-color 0.2s ease, border-color 0.2s ease",
    whiteSpace: "nowrap",
  },
  signUpText: {
    textAlign: "center",
    marginTop: "0.75rem",
    fontSize: "0.875rem",
    color: "#4b5563",
    lineHeight: 1.4,
  },
  signUpButton: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "0.875rem",
    padding: "0",
    transition: "color 0.2s ease",
  },
  error: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: "1rem",
    fontSize: "0.875rem",
    padding: "0.5rem",
    backgroundColor: "#fef2f2",
    borderRadius: "4px",
    border: "1px solid #fecaca",
  },
  loggedInBox: {
    textAlign: "center",
    width: "100%",
    maxWidth: "28rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    padding: "2rem",
  },
  welcomeText: {
    marginBottom: "0.5rem",
    fontSize: "1.25rem",
    color: "#1f2937",
    fontWeight: "600",
    wordBreak: "break-word",
  },
  userEmail: {
    marginBottom: "1.5rem",
    fontSize: "0.875rem",
    color: "#6b7280",
    wordBreak: "break-word",
  },
  logoutButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.2s ease, opacity 0.2s ease",
    minWidth: "120px",
  },
};
