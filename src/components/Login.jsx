import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = ({ setUserDetails }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Authenticate user
      const response = await axios.post("http://localhost:8080/api/login", formData);

      // Fetch user details using the email
      const userDetailsResponse = await axios.get(`http://localhost:8080/api/email/${formData.email}`);
      const userDetails = userDetailsResponse.data;

      // Store user details in local storage
      localStorage.setItem("userDetails", JSON.stringify(userDetails));

      // Update parent state with user details
      setUserDetails(userDetails);
      navigate("/dashboard");
    } catch (error) {
      console.error("There was an error with the login request!", error);
      setResponseMessage("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} >
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default Login;
