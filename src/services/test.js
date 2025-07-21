import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBa0syaWBFm6_Ui6BJkRG6Ulh_okPBZksU",
  authDomain: "backend-auth-e78e3.firebaseapp.com",
  projectId: "backend-auth-e78e3",
  storageBucket: "backend-auth-e78e3.firebasestorage.app",
  messagingSenderId: "244192787054",
  appId: "1:244192787054:web:2fb2fe3116e1f711f1447f",
  measurementId: "G-FMZ0P0BZVC",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function searchUserByName(namePrefix) {
  try {
    const usersRef = collection(db, "users");

    let q;
    if (!namePrefix || namePrefix.trim() === "") {
      q = query(usersRef); // Get all users
    } else {
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

// Run the function with empty string to get all users:
searchUserByName("").then(users => {
  console.log("All users:", users);
}).catch(err => {
  console.error("Error fetching users:", err);
});
