import React from "react";

const PredictionSwitch = ({ prediction }) => {
  if (prediction === null) {
    // If there is no prediction, display in the middle
    return <div className="prediction-switch middle">No Prediction</div>;
  }

  const isHomeCover = prediction.home_cover;
  const switchSideClass = isHomeCover ? "home-cover" : "away-cover";

  return (
    <div className={`prediction-switch ${switchSideClass}`}>
      {isHomeCover ? "Home" : "Away"} Cover
    </div>
  );
};

export default PredictionSwitch;