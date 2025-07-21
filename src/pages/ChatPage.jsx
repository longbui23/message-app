import React, { useState } from "react";
import SearchBar from "../components/Search/SearchBar"; 
import ChatSidebar from "../components/Chat/ChatSideBar";
import ChatWindow from "../components/Chat/ChatWindow";

export default function ChatPage() {
  const localUserId = localStorage.getItem("userId") || "me"; // fallback for demo
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  // Always use "demo" as the other user for testing
  const demoUserId = "demo";
  const demoConversationId = [localUserId, demoUserId].sort().join("_");

  const activeConversation = conversations.find((c) => c.id === activeChat);

  const handleSelectUser = () => {
    // In demo mode, always set up the "demo" chat
    const exists = conversations.some((c) => c.id === demoConversationId);

    if (!exists) {
      const newConversation = {
        id: demoConversationId,
        name: "Demo User",
        lastMessage: "",
        avatar: "D",
      };
      setConversations((prev) => [newConversation, ...prev]);
    }
    setActiveChat(demoConversationId);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.searchBarWrapper}>
        {/* For demo: Clicking the search bar triggers the demo user */}
        <SearchBar onSelectUser={handleSelectUser} />
      </div>

      <div style={styles.chatLayout}>
        <div style={styles.sidebarWrapper}>
          <ChatSidebar
            conversations={conversations}
            activeChat={activeChat}
            onSelectChat={setActiveChat}
          />
        </div>
        <div style={styles.chatWindowWrapper}>
          {/* Always pass demo as otherUserId */}
          <ChatWindow
            conversationId={activeConversation?.id || demoConversationId}
            currentUserId={localUserId}
            otherUserId={demoUserId}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#f3f4f6",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  searchBarWrapper: {
    padding: "10px 20px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
  },
  chatLayout: { flex: 1, display: "flex", height: "100%" },
  sidebarWrapper: {
    width: "30%",
    borderRight: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    overflowY: "auto",
  },
  chatWindowWrapper: {
    width: "70%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f9fafb",
  },
};