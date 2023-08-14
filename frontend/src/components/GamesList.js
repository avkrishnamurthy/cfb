import React, { useState, useEffect } from 'react';

const PredictionList = ({ predictions }) => {
  const [selectedWeek, setSelectedWeek] = useState(1);

  // Group predictions by the week of the associated game
  const predictionsByWeek = predictions.reduce((acc, prediction) => {
    const week = prediction.game.week;
    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(prediction);
    return acc;
  }, {});

  // Get predictions for the selected week
  const selectedPredictions = predictionsByWeek[selectedWeek] || [];

  return (
    <div>
      <h2>Prediction List</h2>

      {/* Render week buttons */}
      <div>
        {Object.keys(predictionsByWeek).map(week => (
          <button key={week} onClick={() => setSelectedWeek(Number(week))}>
            Week {week}
          </button>
        ))}
      </div>

      {/* Display predictions for the selected week */}
      <div>
        {selectedPredictions.map(prediction => (
          <div key={prediction.id} className='game-container'>
          <div className='game-button'>
            <div className='team-info'>
              <div className='team-details'>
                <img src={prediction.game.home_team.logos[0]} alt={prediction.game.home_team.school} />
                <h3>{prediction.game.home_team.abbreviation}</h3>
                <p>{prediction.game.home_points}</p>
              </div>
              <div>
                  vs.
              </div>
              <div className='team-details'>
                <img src={prediction.game.away_team.logos[0]} alt={prediction.game.away_team.school} />
                <h3>{prediction.game.away_team.abbreviation}</h3>
                <p>{prediction.game.away_points}</p>
              </div>
            </div>
            <div className='game-details'>
              <p>{prediction.game.year}</p>
              <p>{prediction.game.week}</p>
              <p>Locks at {prediction.game.lock_time}</p>
              <p>{prediction.game.locked}</p>
              <p>{prediction.game.line}</p>
              <p>{prediction.game.game_id}</p>
                  <div>
                  <div className="toggle-button">
    <button
      className={`gs ${(prediction.home_winner) ? "selected" : ""}`}
    >
      {prediction.game.home_team.abbreviation}
    </button>
    <div>
          To win
        </div>
    <button
      className={`gs ${(!prediction.home_winner) ? "selected" : ""}`}
    >
      {prediction.game.away_team.abbreviation}
    </button>
  </div>
              </div>

              <div>
                  <div className="toggle-button">
    <button
      className={`gs ${(prediction.home_cover) ? "selected" : ""}`}
    >
      {prediction.game.home_team.abbreviation}
    </button>
    <div>
          To cover
        </div>
    <button
      className={`gs ${(!prediction.home_cover) ? "selected" : ""}`}
    >
      {prediction.game.away_team.abbreviation}
    </button>
  </div>
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionList;
