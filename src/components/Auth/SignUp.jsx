import { useState } from "react";
import { registerUser, 
  loginWithGoogle, loginWithFacebook 
} from "../../services/authService"; 

export default function SignUp({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleSignUp = async () => {
    clearMessages();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const user = await registerUser(email, password, displayName);
      setSuccess(`Successfully created account for ${email}`);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDisplayName("");
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  // Google SignUp
  const handleGoogleSignUp = async () => {
    clearMessages();
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      setSuccess(`Successfully signed up with Google as ${user.email}`);
    } catch (err) {
      setError(err.message || "Google sign up failed");
    } finally {
      setLoading(false);
    }
  };

  // FB SignUp
  const handleFacebookSignUp = async () => {
    clearMessages();
    setLoading(true);
    try {
      const user = await loginWithFacebook();
      setSuccess(`Successfully signed up with Facebook as ${user.email}`);
    } catch (err) {
      setError(err.message || "Facebook sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.heading}>
          SIGN UP
        </h2>

        <div style={styles.inputContainer}>
          <div style={styles.inputGroup}>
            <span style={styles.icon}>👤</span>
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => {
                clearMessages();
                setDisplayName(e.target.value);
              }}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <span style={styles.icon}>📧</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                clearMessages();
                setEmail(e.target.value);
              }}
              style={styles.input}
              required
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <span style={styles.icon}>🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                clearMessages();
                setPassword(e.target.value);
              }}
              style={styles.input}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <span style={styles.icon}>🔒</span>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                clearMessages();
                setConfirmPassword(e.target.value);
              }}
              style={styles.input}
              required
              minLength={6}
              disabled={loading}
            />
          </div>
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading || !email || !password || !confirmPassword}
          style={styles.signUpButton}
        >
          {loading ? "Signing Up..." : "SIGN UP"}
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <div style={styles.socialButtons}>
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            style={styles.googleButton}
          >
            🔗 Sign up with Google
          </button>

          <button
            onClick={handleFacebookSignUp}
            disabled={loading}
            style={styles.facebookButton}
          >
            📘 Sign up with Facebook
          </button>
        </div>

        {error && (
          <p style={styles.error}>{error}</p>
        )}
        {success && (
          <p style={styles.success}>{success}</p>
        )}

        <p style={styles.toggleText}>
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            style={styles.toggleButton}
            disabled={loading}
          >
            Login
          </button>
        </p>
      </div>
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
  formCard: {
    width: "100%",
    maxWidth: "28rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    padding: "1.5rem",
    "@media (min-width: 640px)": {
      padding: "2rem",
    },
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "700",
    textAlign: "center",
    color: "#1f2937",
    marginBottom: "1.5rem",
    "@media (min-width: 640px)": {
      fontSize: "1.875rem",
    },
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#f9fafb",
    padding: "0.5rem 0.75rem",
  },
  icon: {
    color: "#6b7280",
    marginRight: "0.75rem",
  },
  input: {
    flex: "1",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    fontSize: "1rem",
    color: "#1f2937",
  },
  signUpButton: {
    width: "100%",
    marginTop: "1.5rem",
    padding: "0.75rem 1rem",
    backgroundColor: "#ec4899",
    color: "#fff",
    fontWeight: "600",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontSize: "1rem",
    opacity: 1,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "1.5rem 0",
  },
  dividerText: {
    backgroundColor: "#fff",
    color: "#6b7280",
    fontSize: "0.875rem",
    margin: "0 auto",
    padding: "0 1rem",
    position: "relative",
  },
  socialButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  googleButton: {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#fff",
    color: "#374151",
    fontWeight: "500",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontSize: "0.875rem",
  },
  facebookButton: {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#1877f2",
    color: "#fff",
    fontWeight: "500",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontSize: "0.875rem",
  },
  error: {
    color: "#ef4444",
    textAlign: "center",
    marginTop: "1rem",
    fontSize: "0.875rem",
  },
  success: {
    color: "#10b981",
    textAlign: "center",
    marginTop: "1rem",
    fontSize: "0.875rem",
  },
  toggleText: {
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "0.875rem",
    color: "#4b5563",
  },
  toggleButton: {
    color: "#3b82f6",
    textDecoration: "underline",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
};