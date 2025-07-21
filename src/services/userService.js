import { db } from "./firebase"; 
import {
  doc,
  getDoc,
  getDocs,
  where,
  setDoc,
  deleteDoc,
  serverTimestamp,
  collection, query
} from "firebase/firestore";

// Fetch account info
export async function fetchUserSettings(userId) {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return { id: snapshot.id, ...snapshot.data() };
}

// Update account info
export async function updateUserSettings(userId, updates) {
  const userRef = doc(db, "users", userId);

  await setDoc(
    userRef,
    {
      ...updates,
      updatedAt: serverTimestamp(),
    },
  );

  return { success: true, message: "User settings updated." };
}

// Delete account
export async function deleteUserAccount(userId) {
  const userRef = doc(db, "users", userId);
  await deleteDoc(userRef);

  return { success: true, message: "User account deleted." };
}

// Fetch lists of users
export async function searchUserByName(namePrefix) {
  try {
    const usersRef = collection(db, "users");

    let q;
    if (!namePrefix || namePrefix.trim() === "") {
      // If no prefix, get all users
      q = query(usersRef);
    } else {
      // Search for users where firstName starts with namePrefix
      q = query(
        usersRef,
        where("firstName", ">=", namePrefix),
        where("firstName", "<=", namePrefix + "\uf8ff")
      );
    }

    const querySnapshot = await getDocs(q);
    const users = [];

    querySnapshot.forEach((doc) => {
      users.push({
        uid: doc.id,
        ...doc.data(),
      });
    });

    return users;
  } catch (error) {
    console.error("Cannot find users", error);
    throw error;
  }
}
