import React, { useState, useEffect } from 'react';

const Heisman = () => {
    const [rankingSpot, setRankingSpot] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [heismanFinalists, setHeismanFinalists] = useState({})
    const accessToken = localStorage.getItem('access')

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
    }, []);

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
                {heismanFinalists.player_1}
                {heismanFinalists.player_2}
                {heismanFinalists.player_3}
                {heismanFinalists.player_4}
                {heismanFinalists.player_5}
            </div>
            ) : (
            <p>Loading...</p>
            )}
        </div>
    </div>
    );
};

export default Heisman;
