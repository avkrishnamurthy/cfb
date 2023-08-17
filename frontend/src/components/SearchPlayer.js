import React, {useState} from "react";
// import { Link, useNavigate } from 'react-router-dom'
import useTokenRefresh from "./useTokenRefresh";

const SearchTeam = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [players, setPlayers] = useState([]);
    const accessToken = useTokenRefresh();
    const backendURL = process.env.REACT_APP_API_URL;
  
    const handleSearch = async () => {
      try {
        const response = await fetch(`${backendURL}/api/cfbd/?search_term=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          setPlayers(data);
        }
        else {
          setPlayers(["Unauthenticated"]);
        }
        
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
        {players && players[0] === "Unauthenticated" ? (
          <p>Unauthenticated...</p>
      ) : (
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
      )}
          
        </div>
      </div>
    );
  };

export default SearchTeam;


