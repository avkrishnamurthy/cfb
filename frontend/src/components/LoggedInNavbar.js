import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import UserSearch from "./UserSearch";

const LoggedInNavbar = ({onLogout}) => {
    let navigate = useNavigate();
    const logout = () => {
          localStorage.clear()
          onLogout();
          navigate("/login")
    }
  return (
    <nav>
        <Link to="/home"> Home </Link>
        <Link to="/search-player"> Search Player </Link>
        <Link to="/search-team">Search Team </Link>
        <Link to="/profile">Profile</Link>
        <UserSearch/>
        <button type="button" id="logout-button" onClick={() => logout()}> Logout </button>
    </nav>
  );  
};

export default LoggedInNavbar;


