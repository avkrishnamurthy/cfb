import React from "react";
import { Link } from 'react-router-dom'

const GuestNavbar = () => {
  return (
    
    <nav className="navbar-container">
        <ul className="nav-list">
        <li><Link to="/home"> Home </Link></li>
        <li><Link to="/login"> Login </Link></li>
        <li><Link to="/create-account"> Create Account </Link></li>
        </ul>
    </nav>
  );  
};

export default GuestNavbar;