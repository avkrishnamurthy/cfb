// import axios from 'axios';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = ({onLogin}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const fetchID = async (e) => {
    try {
        const response = await fetch(`http://localhost:8000/api/users/search/?username=${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
        localStorage.setItem("user_id", data[0].id)
    }
    catch {
        console.error("Fetching user id: ", e);
    }
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log(response)
      const { access, refresh } = data;
      // Store tokens in localStorage
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      if (response.status == 200) {
        localStorage.setItem("loggedIn", true)
        // localStorage.setItem()
        onLogin();
        fetchID();
        navigate(`/product-list/${username}`)
        return
      }
      alert("Invalid credentials")
      // Set authentication state to true (user is logged in)
      // You can implement this using context or Redux
      // setAuthenticated(true);

    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
