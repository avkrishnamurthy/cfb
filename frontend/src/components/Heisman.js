import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import SearchResultList from './SearchResultList';
import "./Heisman.css"
const Heisman = () => {

    const [heismanFinalists, setHeismanFinalists] = useState({})
    const accessToken = localStorage.getItem('access')
    const user_id = localStorage.getItem("user_id")
    const [updateHeismans, SetUpdateHeismans] = useState(false)
    const [playerSearchResults, setPlayerSearchResults] = useState([])
    const [playerImages, setPlayerImages] = useState({});
      
    const fetchHeismanFinalists = async (event) => {
        try {
            const response = await fetch(`http://localhost:8000/api/cfbd/heisman-finalists/?user=${user_id}`, {
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

    const fetchPlayerImages = async () => {
        const playerNames = Object.values(heismanFinalists);
        const imageMap = {}; // Temporary map to store image data
        console.log(playerNames)
        for (const playerName of playerNames) {
            try {
                const imageResponse = await fetch(`http://localhost:8000/api/cfbd/player-image/${playerName}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const imageData = await imageResponse.json();
                console.log(`Image data for ${playerName}:`, imageData);

                // Store the image data in the temporary map
                imageMap[playerName] = imageData.img;
            } catch (error) {
                console.log(`Error fetching image for ${playerName}:`, error);
            }
        }

        // Update the state with the stored image data
        console.log("Image map", (imageMap))
        setPlayerImages(imageMap);
    }
    
    useEffect(() => {
        fetchHeismanFinalists();
        // fetchPlayerImages();

    }, [updateHeismans]);

    useEffect(() => {
        // After the playerImages state has been updated,
        // the images should be displayed immediately.
        fetchPlayerImages();
    }, [heismanFinalists]); // Add playerImages as a dependency

    return (
        <div>
        <div className="search-bar-container">
            <SearchBar setPlayerSearchResults={setPlayerSearchResults}/> 
            <SearchResultList playerSearchResults={playerSearchResults} updateHeismans={updateHeismans} SetUpdateHeismans={SetUpdateHeismans}/>
        </div>
        <div>
            <h2> Heisman Finalists</h2>
            {heismanFinalists ? (
            <div>
                <ol className="heisman-list">
                    <li>{heismanFinalists.player_1}</li>
                    <img src={playerImages[heismanFinalists.player_1]}></img>
                    <li>{heismanFinalists.player_2}</li>
                    <img src={playerImages[heismanFinalists.player_2]}></img>
                    <li>{heismanFinalists.player_3}</li>
                    <img src={playerImages[heismanFinalists.player_3]}></img>
                    <li>{heismanFinalists.player_4}</li>
                    <img src={playerImages[heismanFinalists.player_4]}></img>
                    <li>{heismanFinalists.player_5}</li>
                    <img src={playerImages[heismanFinalists.player_5]}></img>
                </ol>
            </div>
            ) : (
                <div>
                <ol>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ol>
            </div>
            )}
        </div>
    </div>
    );
};

export default Heisman;
