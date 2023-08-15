import React, {useState, useEffect} from 'react'
import "./SearchResult.css"
const SearchResult = (props) => {

    const  {REACT_APP_GOOGLE_API_KEY, REACT_APP_CX} = process.env

    const loadGoogleApi = () => {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.onload = () => {
            /* eslint-disable */
          gapi.load("client", initGoogleClient);
        };
        document.head.appendChild(script);
      };

    const result = props.result
    const updateHeismans = props.updateHeismans
    const SetUpdateHeismans = props.SetUpdateHeismans
    const [rankingSpot, setRankingSpot] = useState(null)
    const accessToken = localStorage.getItem('access')

      const initGoogleClient = () => {
        /* eslint-disable */
        gapi.client.init({
          apiKey: `${REACT_APP_GOOGLE_API_KEY}`, // Replace with your API key
          discoveryDocs: ["https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest"],
        })
        .then(() => {
          console.log("GAPI client loaded for API");
        })
        .catch(err => {
          console.error("Error loading GAPI client for API", err);
        });
      };
    
      const executeGoogleSearch = async (playerName, playerTeam) => {
        /* eslint-disable */
        try {
            const response = await gapi.client.search.cse.list({
              cx: `${REACT_APP_CX}`,
              q: `${playerName} ${playerTeam} headshots`,
              searchType: "image",
            });
      
            // console.log("Response", response);
            return response;
          } catch (err) {
            console.error("Execute error", err);
          }
      };

      useEffect(() => {
        loadGoogleApi();
      }, []);

    const fetchTeam = async(playerTeam) => {
        try {
            const response = await fetch(`http://localhost:8000/api/cfbd/teams/?team=${playerTeam}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
            const data = await response.json()
            return data

        }
        catch {
            console.log("Failed to fetch team")
        }
    }

    const handleSubmit = async (playerName, playerTeam, position) => {
        // event.preventDefault();
        let imageData = null
        let body = null;
        try {
            const imageResponse = await fetch(`http://localhost:8000/api/cfbd/player-image/${playerName}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
                },
            });
            imageData = await imageResponse.json();
        }
        catch {
            console.log("Here")
        }

        if (!imageData || !imageData.img) {
            const img_resp = await executeGoogleSearch(playerName, playerTeam);
            const team_resp = await fetchTeam(playerTeam);
            console.log(team_resp)
            if (team_resp.results) {
                body = JSON.stringify({ player_name: playerName, player_img_url: img_resp.result.items[0].link, team_id: team_resp.results[0].id, position: position})
            }
            else {
                console.log("Error fetching team")
            }
            // body = JSON.stringify({ player_name: playerName, player_img_url: img_resp.result.items[0].link, team_id: team_resp.results.id})
        }
        else {
            body = JSON.stringify({player_name: playerName})
        }
        console.log(body)

        const url = `http://localhost:8000/api/cfbd/heisman-finalists/${rankingSpot}/`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
            },
            body: body
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
        <p>{result.name}, {result.position}</p>
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
            <button type="button" onClick={() => handleSubmit(result.name, result.team, result.position)}>Submit</button>
        </div>
  )
}

export default SearchResult