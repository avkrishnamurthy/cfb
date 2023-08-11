import React, { useState, useEffect } from "react";
import './Games.css'
import Switch from '@mui/material/Switch'
import PredictionSwitch from "./PredictionSwitch";
const Games = () => {
  const [games, setGames] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const accessToken = localStorage.getItem("access");

const getPrediction = (gameId) => {
    return predictions.find((prediction) => prediction['game'].game_id === gameId) || null;
  };

useEffect(() => {
    // Fetch user's predictions for the current week
    const fetchPredictions = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/cfbd/predictions/?week=current", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setPredictions(data.results);
      } catch (error) {
        console.error("Error fetching user predictions: ", error);
      }
    };

    fetchPredictions();
  }, []);


  useEffect(() => {
    // Fetch data from the API after the component mounts
    const fetchGames = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/cfbd/games/?week=current`, {
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
            <div key={game.id} className='game-container'>
            <div className='game-button'>
              <div className='team-info'>
                <div className='team-details'>
                  <img src={game.home_team.logos[0]} alt={game.home_team.school} />
                  <h3>{game.home_team.abbreviation}</h3>
                </div>
                <div>
                    vs.
                </div>
                <div className='team-details'>
                  <img src={game.away_team.logos[0]} alt={game.away_team.school} />
                  <h3>{game.away_team.abbreviation}</h3>
                </div>
              </div>
              <div className='game-details'>
                <p>{game.year}</p>
                <p>{game.week}</p>
                <p>Locks at {game.lock_time}</p>
                <p>{game.locked}</p>
                <p>{game.line}</p>
                <p>{game.game_id}</p>
                    <div>
                <PredictionSwitch prediction={(getPrediction(game.game_id))} type={"To win"} game={game}/>
                <PredictionSwitch prediction={(getPrediction(game.game_id))} type={"To cover"} game={game}/>
                </div>
                <div className='toggle-buttons'>
    </div>
              </div>
            </div>
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