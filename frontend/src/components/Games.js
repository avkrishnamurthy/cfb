import React, { useState, useEffect } from "react";
import {format} from 'date-fns'
import './Games.css'
import PredictionSwitch from "./PredictionSwitch";
import TimestampComponent from "./Timestamp";
import {AiFillLock} from "react-icons/ai"
const Games = () => {
  const [games, setGames] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const accessToken = localStorage.getItem("access");
  const week = 1
  const user_id = localStorage.getItem('user_id')

const getPrediction = (gameId) => {
    return predictions.find((prediction) => prediction['game'].game_id === gameId) || null;
  };

useEffect(() => {
    // Fetch user's predictions for the current week
    const fetchPredictions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/cfbd/predictions/?week=${week}&user=${user_id}`, {
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
        <div className='game-cards'>
            <h1 align="center"> Games Of The Week</h1>
            <h3 align="center">Week {games[0].week}</h3>
            <div className="row-one">
          {games.slice(0, 3).map((game) => (
            <div key={game.id} className={`game-container ${game.locked ? "locked" : ""}`}>
            <div className='game-button'>
            {game.locked ? (
                    <AiFillLock/>
                ) : (
                    null
                )}
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
                <p>{game.line}</p>
                <TimestampComponent timestamp={game.lock_time}/>
                <p></p>
                    <div>
                <PredictionSwitch prediction={(getPrediction(game.game_id))} type={"To win"} game={game} />
                <PredictionSwitch prediction={(getPrediction(game.game_id))} type={"To cover"} game={game} />
                </div>
              </div>
            </div>
          </div>
          
          ))}
          </div>
          <div className="row-two">
          {games.slice(3).map((game) => (
            <div key={game.id} className={`game-container ${game.locked ? "locked" : ""}`}>
            <div className='game-button'>
            {game.locked ? (
                    <AiFillLock/>
                ) : (
                    null
                )}
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
                <p>{game.line}</p>
                <TimestampComponent timestamp={game.lock_time}/>
                <p></p>
                    <div>
                <PredictionSwitch prediction={(getPrediction(game.game_id))} type={"To win"} game={game} />
                <PredictionSwitch prediction={(getPrediction(game.game_id))} type={"To cover"} game={game} />
                </div>
              </div>
            </div>
          </div>
          
          ))}

          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );  
};

export default Games;