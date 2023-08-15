import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import UserSearch from "./UserSearch";
import './LoggedInNavbar.css'; // Import your custom CSS file for styling

const LoggedInNavbar = ({ onLogout }) => {
  const user_id = localStorage.getItem('user_id')
  let navigate = useNavigate();
  
  const logout = () => {
    localStorage.clear();
    onLogout();
    navigate("/login");
  }
  
  return (
    <nav className="navbar-container">
      <ul className="nav-list">
        <li><Link to="/home">Home</Link></li>
        {/* <li><Link to="/search-player">Search Player</Link></li> */}
        <li><Link to="/search-team">Search Team</Link></li>
        <li><Link to="/games">Games</Link></li>
        <li><Link to="/heisman">Heisman</Link></li>
        <li><Link to="/leaderboard">Leaderboard</Link></li>
        <li><Link to={`/profile/${user_id}`}>Profile</Link></li>
        <UserSearch/>
      </ul>
      
      <button type="button" className="logout-button" onClick={() => logout()}>Logout</button>
    </nav>
  );  
};

export default LoggedInNavbar;
