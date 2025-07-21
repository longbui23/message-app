
FIRESTORE:

users (collection)
  └─ userId (document)
      ├─ name: string
      ├─ avatarUrl: string
      └─ ...

conversations (collection)
  └─ conversationId (document)
      ├─ participants: [userId1, userId2]
      ├─ lastMessage: string
      ├─ lastMessageTimestamp: timestamp
      └─ unreadCounts: { userId1: number, userId2: number }

      messages (subcollection)
        └─ messageId (document)
            ├─ senderId: userId
            ├─ text: string
            ├─ timestamp: timestamp
            ├─ readBy: [userId1, userId2]  // optional, for read receipts
            └─ type: "text" | "image" | "file"  // optional message type
