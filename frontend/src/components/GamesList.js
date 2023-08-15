import React, { useState, useEffect } from 'react';
import TimestampComponent from './Timestamp';
import "./GamesList.css"
const PredictionList = ({ predictions }) => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
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
  const totalSlides = selectedPredictions.length
  const goToNextSlide = () => {
    setCurrentSlideIndex(prevIndex => (prevIndex + 1) % totalSlides);
  };
  
  const goToPreviousSlide = () => {
    setCurrentSlideIndex(prevIndex => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const handleWeek = (week) => {
    setSelectedWeek(week)
    setCurrentSlideIndex(0)
  }

  return (
    <div>
      <h2 align="center">Predictions</h2>

      {/* Render week buttons */}
      <div align="center">
        {Object.keys(predictionsByWeek).map(week => (
          <button key={week} onClick={() => handleWeek(Number(week))} className={selectedWeek === Number(week) ? 'selected-week' : ''}>
            Week {week}
          </button>
        ))}
      </div>

      {/* Display predictions for the selected week */}
      <div align="center">
        {selectedPredictions[currentSlideIndex] && (
          <div key={selectedPredictions[currentSlideIndex].id} className='profile-game-container'>
          <div className='profile-game-button'>
            <div className='team-info'>
              <div className='team-details'>
                <img src={selectedPredictions[currentSlideIndex].game.home_team.logos[0]} alt={selectedPredictions[currentSlideIndex].game.home_team.school} />
                <h3>{selectedPredictions[currentSlideIndex].game.home_team.abbreviation}</h3>
                {selectedPredictions[currentSlideIndex].game.home_points === null ? (
                    <p>-</p>
                ) : (
                    <p>{selectedPredictions[currentSlideIndex].game.home_points}</p>
                )}
              </div>
              <div>
                  vs.
              </div>
              <div className='team-details'>
                <img src={selectedPredictions[currentSlideIndex].game.away_team.logos[0]} alt={selectedPredictions[currentSlideIndex].game.away_team.school} />
                <h3>{selectedPredictions[currentSlideIndex].game.away_team.abbreviation}</h3>
                {selectedPredictions[currentSlideIndex].game.away_points === null ? (
                    <p>-</p>
                ) : (
                    <p>{selectedPredictions[currentSlideIndex].game.away_points}</p>
                )}
              </div>
            </div>
            <div className='game-details'>
            <p>{selectedPredictions[currentSlideIndex].game.line}</p>
                {/* <TimestampComponent timestamp={selectedPredictions[currentSlideIndex].game.lock_time}/> */}
                  <div>
                  <div className="toggle-button">
    <button
      className={`gs ${(selectedPredictions[currentSlideIndex].home_winner) ? "selected" : ""}`}
    >
      {selectedPredictions[currentSlideIndex].game.home_team.abbreviation}
    </button>
    <div className="type">
          To win
        </div>
    <button
      className={`gs ${(selectedPredictions[currentSlideIndex].home_winner===false) ? "selected" : ""}`}
    >
      {selectedPredictions[currentSlideIndex].game.away_team.abbreviation}
    </button>
  </div>
              </div>

              <div>
                  <div className="toggle-button">
    <button
      className={`gs ${(selectedPredictions[currentSlideIndex].home_cover) ? "selected" : ""}`}
    >
      {selectedPredictions[currentSlideIndex].game.home_team.abbreviation}
    </button>
    <div className="type">
          To cover
        </div>
    <button
      className={`gs ${(selectedPredictions[currentSlideIndex].home_cover===false) ? "selected" : ""}`}
    >
      {selectedPredictions[currentSlideIndex].game.away_team.abbreviation}
    </button>
  </div>
              </div>
            </div>
            <p>Score: {selectedPredictions[currentSlideIndex].score}</p>
          </div>
          <div className="slides">
          <button className="slide-button" onClick={goToPreviousSlide}>Prev</button>
      <button className="slide-button" onClick={goToNextSlide}>Next</button>
      </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default PredictionList;
