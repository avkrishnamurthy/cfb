// import axios from 'axios';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div>
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Register;
