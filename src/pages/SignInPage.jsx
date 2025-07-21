import React, { useState } from "react";
import SignUp from "../components/Auth/SignUp";
import Login from "../components/Auth/Login";

const SignInPage = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
      <div
      >
        {!showSignUp ? (
          <Login onSwitchToSignUp={() => setShowSignUp(true)} />
        ) : (
          <SignUp onSwitchToLogin={() => setShowSignUp(false)} />
        )}
      </div>
  );
};

export default SignInPage;

const styles = {
  pageContainer: {
    display: "flex",
    height: "100vh", 
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    backgroundColor: "#f0f2f5",
  },
  spacer: {
    flex: 7, 
    backgroundColor: "#f0f2f5",
  },
  heading: {
    marginBottom: "30px",
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    color: "#333",
  },
};