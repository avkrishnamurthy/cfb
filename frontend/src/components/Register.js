// import axios from 'axios';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"
const Register = () => {
  const [username, setUsername] = useState("");
  const[email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  let navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });
      console.log("response", response)
      
      const data = await response.json();
      console.log("data", data)
      navigate("/login")

    } catch (error) {
      console.error("Registration failed: ", error);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <label>
          Username:
          <input
            className="register-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            className="register-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            className="register-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <button className="register-button" type="submit">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;
