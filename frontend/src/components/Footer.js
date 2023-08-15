import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import './Footer.css'; // Import your CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <ul className="footer-link-list"><li className="footer-link"><Link to="/home">Home</Link></li></ul>
      <div className="footer-logo">
          {/* <img src="logo.png" alt="App Logo" /> */}
          <h3>BlitzPicks</h3>
        </div>
        <p>&copy; 2023 BlitzPicks. All rights reserved.</p>
        <p>Ajay Krishnamurthy</p>
      </div>
    </footer>
  );
};

export default Footer;
