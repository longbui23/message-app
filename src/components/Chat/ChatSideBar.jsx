import React, { useState, useEffect } from "react";
import { fetchUserConversations } from "../../services/chatService";

export default function ChatSidebar({ userId, activeChat, onSelectChat }) {
  const [conversations, setConversations] = useState([]);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);

  // Load conversations (from Firestore or placeholder)
  useEffect(() => {
    async function loadChats() {
      const chats = await fetchUserConversations(userId);
      setConversations(chats);
    }
    loadChats();
  }, [userId]);

  const handleToggleUser = (user) => {
    if (groupUsers.includes(user)) {
      setGroupUsers(groupUsers.filter((u) => u !== user));
    } else {
      setGroupUsers([...groupUsers, user]);
    }
  };

  const handleCreateGroup = () => {
    alert(`Group "${groupName}" created with: ${groupUsers.join(", ")}`);
    setGroupName("");
    setGroupUsers([]);
    setShowGroupForm(false);
  };

  return (
    <div style={styles.sidebar}>
      {/* Sidebar Title */}
      <h2 style={styles.sidebarTitle}>Chats</h2>

      {/* Create Group Chat Button */}
      <button style={styles.groupButton} onClick={() => setShowGroupForm(true)}>
        + Create Group Chat
      </button>

      {/* List of Chats */}
      <div style={styles.chatList}>
        {conversations.map((chat) => {
          const displayName =
            chat.name ||
            chat.participants?.filter((p) => p !== userId).join(", ") ||
            "Unknown Chat";

          return (
            <div
              key={chat.id}
              style={{
                ...styles.chatItem,
                backgroundColor: chat.id === activeChat ? "#e5e7eb" : "transparent",
              }}
              onClick={() => onSelectChat(chat.id)}
            >
              <div style={styles.avatar}>{displayName.charAt(0).toUpperCase()}</div>
              <div style={styles.textContainer}>
                <div style={styles.chatName}>{displayName}</div>
                <div style={styles.chatPreview}>{chat.lastMessage || "No messages yet"}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Group Chat Modal */}
      {showGroupForm && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Create Group Chat</h3>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={styles.modalInput}
            />
            <p style={styles.modalSubtitle}>Select Users:</p>
            <div style={styles.userList}>
              {conversations.map((conv) => {
                const name =
                  conv.name || conv.participants?.filter((p) => p !== userId).join(", ");
                return (
                  <label key={conv.id} style={styles.userItem}>
                    <input
                      type="checkbox"
                      checked={groupUsers.includes(name)}
                      onChange={() => handleToggleUser(name)}
                    />
                    <span>{name}</span>
                  </label>
                );
              })}
            </div>
            <div style={styles.modalActions}>
              <button style={styles.createButton} onClick={handleCreateGroup}>
                Create
              </button>
              <button style={styles.cancelButton} onClick={() => setShowGroupForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  sidebar: {
    flex: "0 0 25%",         
    minWidth: "200px",      
    maxWidth: "350px",      
    borderRight: "1px solid #e5e7eb",
    backgroundColor: "#fff",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflowX: "hidden",    
  },
  sidebarTitle: {
    marginBottom: "0.5rem",
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  groupButton: {
    padding: "0.5rem",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "1rem",
  },
  chatList: {
    flex: 1,
    overflowY: "hidden",      
    overflowX: "hidden",    
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  chatItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    minWidth: 0,           
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#0d9488",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    flexShrink: 0,         
  },
  textContainer: {
    minWidth: 0,           
  },
  chatName: {
    fontWeight: "600",
    whiteSpace: "nowrap",   
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  chatPreview: {
    fontSize: "0.875rem",
    color: "#6b7280",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  modalTitle: { fontSize: "1.1rem", fontWeight: "bold" },
  modalInput: {
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "0.9rem",
  },
  modalSubtitle: { fontWeight: "500" },
  userList: {
    maxHeight: "150px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  userItem: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    fontSize: "0.9rem",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
  },
  createButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
