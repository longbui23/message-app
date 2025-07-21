import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => localStorage.getItem("userID"));

  useEffect(() => {
    if (userId) localStorage.setItem("userID", userId);
    else localStorage.removeItem("userID");
  }, [userId]);

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
