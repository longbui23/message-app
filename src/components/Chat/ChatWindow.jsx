import React, { useState, useEffect, useRef, useCallback } from "react";
import { Phone, Video, Info, Mic, Image } from "lucide-react";
import {
  fetchMessages,
  listentoMessages,
  sendMessage,
  fetchConversationByParticipants,
} from "../../services/chatService";

export default function ChatWindow({ conversationId, currentUserId }) {
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(conversationId);

  const [userA, userB] = activeConversationId ? activeConversationId.split("_") : [];
  const otherUserId = currentUserId === userA ? userB : userA || "Demo";

  // Fetch messages + subscribe
  useEffect(() => {
    if (!activeConversationId) {
      // Demo fallback
      setMessages([
        {
          id: "1",
          senderId: currentUserId || "me",
          text: "Welcome! This is a demo chat.",
          createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 },
        },
        {
          id: "2",
          senderId: "Demo",
          text: "Start a conversation to send messages!",
          createdAt: { seconds: Math.floor(Date.now() / 1000) - 1800 },
        },
      ]);
      return;
    }

    let unsubscribe;
    const fetchAndListen = async () => {
      const initial = await fetchMessages(activeConversationId);
      setMessages(initial.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds));

      unsubscribe = listentoMessages(activeConversationId, (newMessages) => {
        const sorted = newMessages.sort(
          (a, b) => a.createdAt?.seconds - b.createdAt?.seconds
        );
        setMessages(sorted);
      });
    };

    fetchAndListen();
    return () => unsubscribe && unsubscribe();
  }, [activeConversationId, currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container || isFetchingOlder || messages.length === 0) return;

    if (container.scrollTop < 50) {
      setIsFetchingOlder(true);
      setTimeout(() => {
        const older = [
          {
            id: `old-${Date.now()}`,
            senderId: otherUserId,
            text: "Older message (pagination demo)...",
            createdAt: { seconds: messages[0]?.createdAt?.seconds - 300 },
          },
        ];
        setMessages((prev) => [...older, ...prev]);
        setIsFetchingOlder(false);
      }, 800);
    }
  }, [messages, isFetchingOlder, otherUserId]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    try {
      let convId = activeConversationId;

      // If no conversation exists, fetch or create one
      if (!convId) {
        const existingConv = await fetchConversationByParticipants(currentUserId, otherUserId);
        convId = existingConv?.id || [currentUserId, otherUserId].sort().join("_");
        setActiveConversationId(convId);
      }

      // Optimistically add message to UI
      const tempMessage = {
        id: `temp-${Date.now()}`,
        senderId: currentUserId,
        text: input,
        createdAt: { seconds: Math.floor(Date.now() / 1000) },
      };
      setMessages((prev) => [...prev, tempMessage]);

      // Save message to Firestore
      await sendMessage(currentUserId, otherUserId, input);

      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatar}>{otherUserId?.[0]?.toUpperCase() || "?"}</div>
          <div>
            <h3 style={styles.contactName}>{otherUserId || "Demo"}</h3>
            <p style={styles.statusText}>{activeConversationId ? "Active now" : "Demo Mode"}</p>
          </div>
        </div>
        <div style={styles.headerButtons}>
          <button style={styles.headerButton}><Phone size={20} /></button>
          <button style={styles.headerButton}><Video size={20} /></button>
          <button style={styles.headerButton}><Info size={20} /></button>
        </div>
      </div>

      {/* Chat Messages */}
      <div style={styles.chatArea} ref={chatContainerRef} onScroll={handleScroll}>
        {isFetchingOlder && <div style={styles.loadingOlder}>Loading older messages...</div>}
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.messageBubble,
              alignSelf: msg.senderId === currentUserId ? "flex-end" : "flex-start",
              backgroundColor: msg.senderId === currentUserId ? "#2563eb" : "#e5e7eb",
              color: msg.senderId === currentUserId ? "#fff" : "#111827",
            }}
          >
            <p style={{ margin: 0 }}>{msg.text}</p>
            <div style={styles.timestamp}>
              {msg.createdAt?.seconds
                ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputSection}>
        <div style={styles.inputContainer}>
          <button style={styles.iconButton}><Mic size={20} /></button>
          <button style={styles.iconButton}><Image size={20} /></button>
          <input
            style={styles.textInput}
            placeholder={
              activeConversationId ? "Type a message..." : "Demo mode: start chatting"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            style={styles.sendButton}
            onClick={handleSendMessage}
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#fff" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderBottom: "1px solid #e5e7eb" },
  headerLeft: { display: "flex", alignItems: "center", gap: "0.75rem" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#0d9488", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" },
  contactName: { fontWeight: 600, color: "#111827" },
  statusText: { fontSize: "0.875rem", color: "#6b7280" },
  headerButtons: { display: "flex", gap: "0.75rem" },
  headerButton: { background: "transparent", border: "none", cursor: "pointer", color: "#9333ea" },
  chatArea: { flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem", overflowY: "auto", backgroundColor: "#f9fafb" },
  loadingOlder: { textAlign: "center", fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.5rem" },
  messageBubble: { maxWidth: "70%", borderRadius: "0.75rem", padding: "0.5rem 0.75rem", fontSize: "0.9rem", position: "relative" },
  timestamp: { fontSize: "0.7rem", marginTop: "0.25rem", opacity: 0.7 },
  inputSection: { flexShrink: 0, padding: "0.5rem 1rem", borderTop: "1px solid #e5e7eb", backgroundColor: "#fff" },
  inputContainer: { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0.5rem", backgroundColor: "#f3f4f6", borderRadius: "9999px" },
  iconButton: { background: "transparent", border: "none", color: "#2563eb", cursor: "pointer" },
  textInput: { flex: 1, border: "none", outline: "none", background: "transparent", padding: "0.5rem", fontSize: "0.9rem" },
  sendButton: { border: "none", backgroundColor: "#2563eb", color: "#fff", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", cursor: "pointer" },
};
