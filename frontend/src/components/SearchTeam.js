import React, {useState} from "react";
// import { Link, useNavigate } from 'react-router-dom'


const SearchTeam = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [players, setPlayers] = useState([]);
  
    const handleSearch = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/cfbd/?search_term=${searchTerm}`);
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching player data: ", error);
      }
    };
  
    return (
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>Search</button>
        <div>
          {players.map((player) => (
            <div key={player.id}>
              <p>{player.name}</p>
              <p>Team: {player.team}</p>
              <p>Position: {player.position}</p>
              {/* Add more player details as needed */}
            </div>
          ))}
        </div>
      </div>
    );
  };

export default SearchTeam;


