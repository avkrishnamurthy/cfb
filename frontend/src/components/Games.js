import React, { useState, useEffect } from "react";
import './Games.css'
const Games = () => {
  const [games, setGames] = useState([]);
  const accessToken = localStorage.getItem("access");
  useEffect(() => {
    // Fetch data from the API after the component mounts
    const fetchGames = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/cfbd/games/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
            },
        });
        const data = await response.json();
        // console.log(data)
        setGames(data.results); // Update the state with the fetched product data
        //setA(data['team']['id'])
      } catch (error) {
        console.error("Error fetching games: ", error);
      }
    };

    fetchGames();
  }, []); // Run the effect whenever the access token changes

  return (
    <div>
      {games && games.length > 0 ? (
        <div>
          {games.map((game) => (
            <div key={game.id}>
              <h3>{game.home_team.school}</h3>
              <img src={game.home_team.logos[0]}></img>
              <h3>{game.away_team.school}</h3>
              <img src={game.away_team.logos[0]}></img>
              <p>{game.year}</p>
              <p>{game.week}</p>
              <p>{game.lock_time}</p>
              <p>{game.locked}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );  
};

export default Games;