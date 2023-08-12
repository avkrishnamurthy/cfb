import React, {useState} from 'react'
import "./SearchResult.css"
const SearchResult = (props) => {
    const result = props.result
    const updateHeismans = props.updateHeismans
    const SetUpdateHeismans = props.SetUpdateHeismans
    const [rankingSpot, setRankingSpot] = useState(null)
    const accessToken = localStorage.getItem('access')
    const handleSubmit = async (playerName) => {
        // event.preventDefault();
        console.log(playerName)
        const url = `http://localhost:8000/api/cfbd/heisman-finalists/${rankingSpot}/`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
            },
            body: JSON.stringify({ player_name: playerName})
        });
        if (response.status === 200 || response.status === 201) {
            alert('Player added successfully');
            SetUpdateHeismans(!updateHeismans)
        } else {
            // alert('Failed to add player');
        }
    };

  return (
    <div className="search-result">
        <p>{result.name}, {result.position} <input type="number" min="1" max="5" /><button type="submit">Set as ranking</button></p>
        <p>{result.team}</p>
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
            <button type="button" onClick={() => handleSubmit(result.name)}>Submit</button>
        </div>
  )
}

export default SearchResult