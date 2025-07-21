import React, { useEffect, useState } from "react";
import {
  fetchUserSettings,
  updateUserSettings,
  deleteUserAccount,
} from "../services/userService";

export default function SettingsPage() {
  // Read userId from localStorage
  const userId = localStorage.getItem("userId");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [googleLinked, setGoogleLinked] = useState(false);
  const [facebookLinked, setFacebookLinked] = useState(false);

  const [message, setMessage] = useState("");
  const [pendingChanges, setPendingChanges] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!userId) {
        setMessage("User not logged in.");
        return;
      }
      const data = await fetchUserSettings(userId);
      if (data) {
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setBio(data.bio || "");
        setAvatar(data.avatar || "https://via.placeholder.com/120");
        setNotificationsEnabled(data.notificationsEnabled ?? true);
        setPrivacyEnabled(data.privacyEnabled ?? false);
        setGoogleLinked(data.googleLinked ?? false);
        setFacebookLinked(data.facebookLinked ?? false);
      }
    }
    loadData();
  }, [userId]);

  const handleFieldChange = (setter) => (e) => {
    setter(e.target.value);
    setPendingChanges(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setPendingChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      setMessage("Cannot update: user not logged in.");
      return;
    }

    const updates = {
      firstName,
      lastName,
      email,
      phone,
      bio,
      avatar,
      googleLinked,
      facebookLinked,
      notificationsEnabled,
      privacyEnabled,
    };

    try {
      const res = await updateUserSettings(userId, updates);
      setMessage(res.message || "Profile updated!");
      setPendingChanges(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("Failed to save profile.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      setMessage("Cannot delete: user not logged in.");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      try {
        const res = await deleteUserAccount(userId);
        setMessage(res.message || "Account deleted.");
      } catch (error) {
        console.error("Error deleting account:", error);
        setMessage("Failed to delete account.");
      }
    }
  };

  const toggleGoogle = () => {
    setGoogleLinked((prev) => !prev);
    setPendingChanges(true);
  };

  const toggleFacebook = () => {
    setFacebookLinked((prev) => !prev);
    setPendingChanges(true);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    setPendingChanges(true);
  };

  const togglePrivacy = () => {
    setPrivacyEnabled((prev) => !prev);
    setPendingChanges(true);
  };

  return (
    <div style={styles.container}>
      {/* Avatar Section */}
      <div style={styles.avatarSection}>
        <img src={avatar} alt="avatar" style={styles.avatar} />
        <label style={styles.avatarBtn}>
          Change Avatar
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </label>
      </div>

      {/* Profile Info */}
      <h2 style={styles.sectionTitle}>Profile</h2>
      <div style={styles.rowInputs}>
        <input
          style={{ ...styles.input, flex: 1, marginRight: 8 }}
          value={firstName}
          onChange={handleFieldChange(setFirstName)}
          placeholder="First Name"
        />
        <input
          style={{ ...styles.input, flex: 1 }}
          value={lastName}
          onChange={handleFieldChange(setLastName)}
          placeholder="Last Name"
        />
      </div>
      <input
        style={styles.input}
        value={email}
        onChange={handleFieldChange(setEmail)}
        placeholder="Email"
      />
      <input
        style={styles.input}
        value={phone}
        onChange={handleFieldChange(setPhone)}
        placeholder="Phone Number"
      />
      <textarea
        style={styles.textarea}
        value={bio}
        onChange={handleFieldChange(setBio)}
        placeholder="Bio"
      />

      {/* Linked Accounts */}
      <h3 style={styles.subTitle}>Linked Accounts</h3>
      <div style={styles.linkedRow}>
        <span>Google</span>
        <button
          style={{
            ...styles.linkBtn,
            backgroundColor: googleLinked ? "#10B981" : "#3B82F6",
          }}
          onClick={toggleGoogle}
        >
          {googleLinked ? "Linked" : "Link Account"}
        </button>
      </div>
      <div style={styles.linkedRow}>
        <span>Facebook</span>
        <button
          style={{
            ...styles.linkBtn,
            backgroundColor: facebookLinked ? "#10B981" : "#1877F2",
          }}
          onClick={toggleFacebook}
        >
          {facebookLinked ? "Linked" : "Link Account"}
        </button>
      </div>

      {/* Preferences */}
      <h2 style={styles.sectionTitle}>Preferences</h2>
      <div style={styles.toggleRow}>
        <span>Notifications</span>
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={toggleNotifications}
        />
      </div>
      <div style={styles.toggleRow}>
        <span>Privacy Controls</span>
        <input
          type="checkbox"
          checked={privacyEnabled}
          onChange={togglePrivacy}
        />
      </div>

      {/* Action Buttons */}
      <button
        style={{
          ...styles.saveBtn,
          opacity: pendingChanges ? 1 : 0.6,
          cursor: pendingChanges ? "pointer" : "not-allowed",
        }}
        disabled={!pendingChanges}
        onClick={handleSave}
      >
        Update Changes
      </button>

      <button style={styles.deleteBtn} onClick={handleDeleteAccount}>
        Delete Account
      </button>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: "2rem auto",
    padding: "1.5rem",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    backgroundColor: "#fff",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  avatarSection: {
    textAlign: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #d1d5db",
    display: "block",
    margin: "0 auto 12px",
  },
  avatarBtn: {
    display: "inline-block",
    backgroundColor: "#3B82F6",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  subTitle: {
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
  },
  rowInputs: {
    display: "flex",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 12,
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 12,
    outline: "none",
    minHeight: 80,
  },
  linkedRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  linkBtn: {
    padding: "8px 12px",
    borderRadius: 6,
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
  },
  toggleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  saveBtn: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#10B981",
    color: "#fff",
    padding: "12px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
  },
  deleteBtn: {
    marginTop: 12,
    width: "100%",
    backgroundColor: "#EF4444",
    color: "#fff",
    padding: "12px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    color: "#2563eb",
  },
};