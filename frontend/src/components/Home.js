import React from "react";
import "./Home.css"; // Add your own CSS styles for grid layout
import osu from "../images/osu.jpeg"
import boise from "../images/boise.jpeg"
import bama from "../images/bama.webp"
import byu from "../images/byu.webp"
import michigan from "../images/michigan.webp"
import pennstate from "../images/pennstate.webp"
import rosebowl from "../images/rosebowl.webp"
// import OSU from "./images/osu.jpeg"
const stadiums = [
  osu,
  boise,
  bama,
  byu,
  pennstate,
  rosebowl
];

const Home = () => {
  return (
    <div className="home-container">
      <h2 align="center">Welcome to BlitzPicks</h2>
      <p align="center">Join the community and make your picks!</p>

      <div className="stadium-grid">
        <ul className="stadium-grid-list">
        {stadiums.map((stadium, index) => (
          <div key={index} className="stadium-card">
            <li><img src={stadium} alt={`Stadium ${index + 1}`} /></li>
          </div>
        ))}
        </ul>
      </div>
      <img className="michigan" align="center" src={michigan}/>
    </div>
  );
};

export default Home;
