import React, { useState, useEffect } from 'react';

const Heisman = () => {
    const [rankingSpot, setRankingSpot] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [heismanFinalists, setHeismanFinalists] = useState({})
    const accessToken = localStorage.getItem('access')
    const [updateHeismans, SetUpdateHeismans] = useState(false)

    const handleSearch = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/cfbd/?search_term=${searchTerm}`, {
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
      
    useEffect(() => {
        const fetchHeismanFinalists = async (event) => {
        try {
            const response = await fetch("http://localhost:8000/api/cfbd/heisman-finalists/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
            });
            const data = await response.json();
            setHeismanFinalists(data.results[0])
            console.log(data.results[0])
            
            }
            
           catch (error) {
            console.error("Error fetching heisman finalists: ", error);
          }
    }
    fetchHeismanFinalists();
    }, [updateHeismans]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const url = `http://localhost:8000/api/cfbd/heisman-finalists/${rankingSpot}/`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // Include the access token in the request header

                // Add your authentication headers here
            },
            body: JSON.stringify({ player_name: playerName})
        });

        if (response.status === 200 || response.status === 201) {
            alert('Player added successfully');
            SetUpdateHeismans(!updateHeismans)
        } else {
            alert('Failed to add player');
        }
    };

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="ranking-spot">Ranking Spot:</label>
            <input
                type="number"
                id="ranking-spot"
                min="1"
                max="5"
                value={rankingSpot}
                onChange={(e) => setRankingSpot(e.target.value)}
                required
            />
            <label htmlFor="player-name">Player Name:</label>
            <input
                type="text"
                id="player-name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
            />
            <button type="submit">Submit</button>
        </form>

        <div>
            <h2> Heisman Finalists</h2>
            {heismanFinalists ? (
            <div>
                <ol>
                    <div>
                    <li>{heismanFinalists.player_1}</li>

                    </div>
                    <li>{heismanFinalists.player_2}</li>
                    <li>{heismanFinalists.player_3}</li>
                    <li>{heismanFinalists.player_4}</li>
                    <li>{heismanFinalists.player_5}</li>
                </ol>
            </div>
            ) : (
            <p>Loading...</p>
            )}
        </div>
    </div>
    );
};

export default Heisman;
