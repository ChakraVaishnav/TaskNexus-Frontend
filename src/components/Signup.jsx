import React from "react";
import "./Signup.css";

const Signup = () => {
  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleGithubSignup = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <div className="signup-buttons">
        <button onClick={handleGoogleSignup}>Sign up with Google</button>
        <button onClick={handleGithubSignup}>Sign up with GitHub</button>
      </div>
    </div>
  );
};

export default Signup;
