import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import UserSearch from "./UserSearch";

const LoggedInNavbar = ({onLogout}) => {
    const user_id = localStorage.getItem('user_id')
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
        <Link to="/search-team"> Search Team </Link>
        <Link to={`/profile/${user_id}`}> Profile </Link>
        <Link to="/games"> Games </Link>
        <Link to="/leaderboard"> Leaderboard </Link>
        <Link to="/heisman"> Heisman </Link>
        <UserSearch/>
        <button type="button" id="logout-button" onClick={() => logout()}> Logout </button>
    </nav>
  );  
};

export default LoggedInNavbar;


