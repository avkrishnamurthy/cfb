import React from "react";
import { Link, useNavigate } from 'react-router-dom'


const LoggedInNavbar = ({onLogout}) => {
    let navigate = useNavigate();
    const logout = (onLogout) => {
          localStorage.clear()
          onLogout()
          navigate("/login")
    }
  return (
    <nav>
        <Link to="/home"> Home </Link>
        <Link to="/search-team"> Search Team </Link>
        <button type="button" id="logout-button" onClick={() => logout(onLogout)}> Logout </button>
    </nav>
  );  
};

export default LoggedInNavbar;


