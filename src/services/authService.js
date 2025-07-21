import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider
    } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Register
export const registerUser = async (email, password, displayName = "") => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (displayName) {
            await updateProfile(user, {displayName});
        }

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: displayName || user.email.split("@")[0],
            createdAt: new Date(),
        });

        return user;
    } catch(error) {
        console.error("Error registered user:", error);
        throw error;
    }
};

// Raw Login
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in", error);
        throw error;
    }
};

// Google login
export const loginWithGoogle = async() => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        throw error;
    }
};

// Facebook Login
export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; 
  } catch (error) {
    throw error;
  }
};

// Logout
export const logoutUser = async() => {
    try {
        await signOut(auth);
    } catch (error) {
        console.log("Error logging out:", error);
        throw error;
    }
};

// Subscribe/listener
export const SubscribetoAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
}