import React, { useState, useEffect } from "react";
import "./Leaderboard.css";
import useTokenRefresh from "./useTokenRefresh";
const Leaderboard = () => {
  const [topScores, setTopScores] = useState([]);
  const [favoriteTeams, setFavoriteTeams] = useState({});
  const accessToken = useTokenRefresh();
  const backendURL = process.env.REACT_APP_API_URL;
  
  const fetchFavoriteTeams = async () => {
    if (!topScores || topScores.length < 1) {
      return;
    }

    const users = Object.values(topScores);
    const imageMap = {};

    for (const user of users) {
      try {
        const imageResponse = await fetch(`${backendURL}/api/cfbd/favorite-team/${user.user_id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const imageData = await imageResponse.json();

        imageMap[user.username] = { favoriteTeam: imageData['team'] };
      } catch (error) {
        console.log(`Error fetching image for ${user.username}:`, error);
      }
    }

    setFavoriteTeams(imageMap);
  };

  useEffect(() => {
    const fetchTopScores = async () => {
      try {
        const response = await fetch(`${backendURL}/api/cfbd/leaderboard/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        setTopScores(data);

        if (response.status !== 200) {
          console.error("Error fetching games");
        }
      } catch (error) {
        console.error("Error fetching games: ", error);
      }
    };

    fetchTopScores();
  }, []);

  useEffect(() => {
    fetchFavoriteTeams();
  }, [topScores]);

  return (
    <div>
      <h2 align="center"> Season Leaderboard </h2>
      {topScores && topScores.length > 0 ? (
        <div className="leaderboard">
          <ol>
            {topScores.map((topScore) => (
              <li key={topScore.username} className="leaderboard-card">
                <div className="user-info">
                  <a className="username" href={`http://localhost:3000/profile/${topScore.user_id}`}>
                    {topScore.username}
                  </a>
                  {favoriteTeams != null && favoriteTeams[topScore.username] != null && favoriteTeams[topScore.username].favoriteTeam != null && (
                    <img
                      className="leaderboard-favorite-team-img"
                      src={favoriteTeams[topScore.username].favoriteTeam.logos[0]}
                      alt={favoriteTeams[topScore.username].favoriteTeam.school}
                    />
                  )}
                </div>
                {topScore.total_score !== null && (
                  <p className="score">Score: {topScore.total_score}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Leaderboard;
