import React, {useState, useEffect} from "react";
import './PredictionSwitch.css'
const PredictionSwitch = (props) => {
    const prediction = props.prediction
    const type = props.type
    const game = props.game
    console.log(game.locked)
    const [selectedSide, setSelectedSide] = useState(null);
    const accessToken = localStorage.getItem('access')
    // const [firstClick, setFirstClick] = useState(false)

    const updatePrediction = async (side, prediction_id) => {
        let value = true
        if (side === "right") value = false

        let body = JSON.stringify({home_winner: value})
        if (type==="To cover") body = JSON.stringify({home_cover: value})

        try {
          const response = await fetch(`http://localhost:8000/api/cfbd/predictions/${prediction_id}/update/`, {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
              },
              body: body,
          });
          const data = await response.json();

          if (response.status === 200) {
            alert("Prediction updated")
          } else {
            // Failed to add team to favorites
            alert("Failed to update prediction.");
          }
          // console.log(data)
          //setA(data['team']['id'])
        } catch (error) {
          console.error("Error fetching games: ", error);
        }
      };

    const handleSideClick = (side) => {
        if (side===selectedSide) return
        setSelectedSide(side === selectedSide ? null : side);
        updatePrediction(side, prediction.id)

    }

        const createPrediction = async (side) => {
        let value = true
        if (side === "right") value = false

        let body = JSON.stringify({home_winner: value, game_id: game.id, week: game.week, year: game.year})
        if (type==="To cover") body = JSON.stringify({home_cover: value, game_id: game.id, week: game.week, year: game.year})
        try {
            
            const response = await fetch("http://localhost:8000/api/cfbd/predictions/create/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              
              body: body
            });
      
            if (response.status === 201) {
              // Team added to favorites successfully
            } else {
              // Failed to add team to favorites
              alert("Failed to submit prediction.");
            }
          } catch (error) {
            console.error("Error adding prediction: ", error);
          }

    }

    const handleFirstClick = (side) => {
        setSelectedSide(side === selectedSide ? null : side);
        createPrediction(side)
        alert("Prediction submitted");
        window.location.reload()
    }
useEffect(() => {
    if (prediction) {
        let isHome = true
        if (type === "To win") {
            isHome = prediction.home_winner
        }
        else {
            isHome = prediction.home_cover
        }
    //   const isHomeCover = prediction.home_cover;
    //   console.log(prediction['game']['away_team']['color'])
      if (isHome) {
        setSelectedSide("left");
      } else if (isHome!=null) {
        setSelectedSide("right");
      }
    }
  }, [prediction]);

  if (prediction === null) {
    // console.log(game.home_team)
    // If there is no prediction, display in the middle
    return (
        <div className="toggle-button">
          <button
            className={`side ${selectedSide === "left" ? "selected" : ""}`}
            onClick={() => handleFirstClick("left")}
          >
            {game.home_team.abbreviation}
          </button>
          <div>
            {type}
          </div>
          <div>
          </div>
          <button
        className={`side ${selectedSide === "right" ? "selected" : ""}`}
        onClick={() => handleFirstClick("right")}
      >
        {game.away_team.abbreviation}
      </button>
          </div>
    )
  }

  return (
    <div className="toggle-button">
      <button
        className={`side ${(selectedSide === "left") ? "selected" : ""}`}
        onClick={() => handleSideClick("left")}
      >
        {game.home_team.abbreviation}
      </button>
      <div>
            {type}
          </div>
      <button
        className={`side ${(selectedSide === "right") ? "selected" : ""}`}
        onClick={() => handleSideClick("right")}
      >
        {game.away_team.abbreviation}
      </button>
    </div>
  );
};

export default PredictionSwitch;