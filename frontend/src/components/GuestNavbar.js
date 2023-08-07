import React from "react";
import { Link } from 'react-router-dom'

const GuestNavbar = () => {
  return (
    <nav>
        <Link to="/home"> Home </Link>
        <Link to="/login"> Login </Link>
        <Link to="/create-account"> Create Account </Link>
    </nav>
  );  
};

export default GuestNavbar;