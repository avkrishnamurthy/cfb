import React, {useState, useEffect} from "react";

const Leaderboard = () => {
    const [topScores, setTopScores] = useState([])
    const accessToken = localStorage.getItem('access')
    useEffect(() => {
        const fetchTopScores = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/cfbd/leaderboard/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
                    },
                });
                const data = await response.json();
                setTopScores(data)
                console.log(data)
                if (response.status != 200) {
                console.error("Error fetching games")
                }
            } catch (error) {
                console.error("Error fetching games: ", error);
            }
        }
        fetchTopScores();
    }, []);

    return (
        <div>
      <h2> Season Leaderboard </h2>
      {topScores && topScores.length > 0 ? (
        <div>
          {topScores.map((topScore) => (
            <div key={topScore.username}>
              <h3>{topScore.username}</h3>
              <p>Score: {topScore.total_score}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    )
}

export default Leaderboard