import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// --------------------- Conversations ---------------------

// Fetch all conversations for a given user
export async function fetchUserConversations(userID) {
  const conversationsRef = collection(db, "conversations");
  const snapshot = await getDocs(conversationsRef);

  const conversations = snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }))
    .filter((conv) => conv.participants?.includes(userID))
    .sort(
      (a, b) =>
        (b.lastMessageAt?.seconds || 0) - (a.lastMessageAt?.seconds || 0)
    );

  return conversations;
}

// Fetch conversation by two users (create ID based on userIDs)
export async function fetchConversationByParticipants(userID, selectedUserID) {
  const conversationId = [userID, selectedUserID].sort().join("_");
  const conversationRef = doc(db, "conversations", conversationId);
  const docSnap = await getDoc(conversationRef);

  if (!docSnap.exists()) {
    return null;
  }

  return { id: docSnap.id, ...docSnap.data() };
}

// --------------------- Messages ---------------------

// Fetch all messages for a conversation (sorted)
export async function fetchMessages(conversationID) {
  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef, 
    where("conversationId","==",conversationID),
    orderBy("createdAt", "asc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

// Real-time listener for messages
export function listentoMessages(conversationId, callback) {
  const messagesRef = collection(
    db,
    "conversations",
    conversationId,
    "messages"
  );
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
}

// --------------------- Sending Messages ---------------------

// Sends a message 
export async function sendMessage(senderId, receiverId, text) {
  const conversationId = [senderId, receiverId].sort().join("_");
  const conversationRef = doc(db, "conversations", conversationId);
  const messageRef = collection(db, "messages");

  const conversationSnap = await getDoc(conversationRef);
  if (!conversationSnap.exists()) {
    // Create conversation doc with participants and lastMessage
    await setDoc(conversationRef, {
      participants: [senderId, receiverId],
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
    });
  } else {
    // Update conversation last message and timestamp
    await updateDoc(conversationRef, {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
    });
  }

  // Ad message to messages collection
  const newMessage = await addDoc(messagesRef, {
    senderId,
    text,
    createdAt: serverTimestamp(),
    conversationId,
  });

  return newMessage.id;
  
}

// --------------------- Mark Messages as Read ---------------------

export async function markMessagesAsRead(conversationId, userId) {
  const messagesRef = collection(
    db,
    "conversations",
    conversationId,
    "messages"
  );
  const snapshot = await getDocs(messagesRef);

  const updates = snapshot.docs.map(async (docSnap) => {
    const msg = docSnap.data();
    if (msg.receiverId === userId && !msg.read) {
      await updateDoc(docSnap.ref, { read: true });
    }
  });

  return Promise.all(updates);
}