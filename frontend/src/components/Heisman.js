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
        if (!heismanFinalists || heismanFinalists.length < 1) {
            return
        }
        const playerNames = Object.values(heismanFinalists);
        const imageMap = {}; // Temporary map to store image data
        for (const playerName of playerNames) {
            try {
                const imageResponse = await fetch(`http://localhost:8000/api/cfbd/player-image/${playerName}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const imageData = await imageResponse.json();

                // Store the image data in the temporary map
                imageMap[playerName] = {img: imageData.img, team: imageData.team, position: imageData.position};
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

        <div>
  <h2>Heisman Finalists</h2>
  {heismanFinalists ? (
    <div className="heisman-cards">
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="heisman-card">
          
          {playerImages[heismanFinalists[`player_${index}`]] ? (
            <div className="player-details">
            <h3>{index}. {heismanFinalists[`player_${index}`]}</h3>
            <hr></hr>
            <p>{playerImages[heismanFinalists[`player_${index}`]].position}</p>
            <img className="heisman-player-img"
              src={playerImages[heismanFinalists[`player_${index}`]].img}
              alt={heismanFinalists[`player_${index}`]}
            />
            {playerImages[heismanFinalists[`player_${index}`]].team ? (
              <img className="heisman-team-img"
                src={playerImages[heismanFinalists[`player_${index}`]].team.logos[0]}
                alt={`${heismanFinalists[`player_${index}`]} Team Logo`}
              />
            ) : (
              <div></div>
            )}
          </div>
          ) : (
            <div></div>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div>
      <p>No finalists available.</p>
    </div>
  )}
</div>

<div className="search-bar-container">
            <SearchBar setPlayerSearchResults={setPlayerSearchResults}/> 
            <SearchResultList playerSearchResults={playerSearchResults} updateHeismans={updateHeismans} SetUpdateHeismans={SetUpdateHeismans}/>
        </div>

        {/* <div>
            <h2> Heisman Finalists</h2>
            {heismanFinalists ? (
            <div>
                <ol className="heisman-list">
                    <li>{heismanFinalists.player_1}</li>
                    {playerImages[heismanFinalists.player_1] ? (
                            <div>
                                <p>{playerImages[heismanFinalists.player_1].position}</p>
                                <img src={playerImages[heismanFinalists.player_1].img} alt={heismanFinalists.player_1} />
                                {playerImages[heismanFinalists.player_1].team ? (
                                    <img src={playerImages[heismanFinalists.player_1].team.logos[0]} alt={heismanFinalists.player_1 + ' Team Logo'} />
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        ) : (
                            <div></div>
                        )}
                    <li>{heismanFinalists.player_2}</li>
                    {playerImages[heismanFinalists.player_2] ? (
                            <div>
                                <p>{playerImages[heismanFinalists.player_2].position}</p>
                                <img src={playerImages[heismanFinalists.player_2].img} alt={heismanFinalists.player_2} />
                                {playerImages[heismanFinalists.player_2].team ? (
                                    <img src={playerImages[heismanFinalists.player_2].team.logos[0]} alt={heismanFinalists.player_2 + ' Team Logo'} />
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        ) : (
                            <div></div>
                        )}
                    <li>{heismanFinalists.player_3}</li>
                    {playerImages[heismanFinalists.player_3] ? (
                            <div>
                                <p>{playerImages[heismanFinalists.player_3].position}</p>
                                <img src={playerImages[heismanFinalists.player_3].img} alt={heismanFinalists.player_3} />
                                {playerImages[heismanFinalists.player_3].team ? (
                                    <img src={playerImages[heismanFinalists.player_3].team.logos[0]} alt={heismanFinalists.player_3 + ' Team Logo'} />
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        ) : (
                            <div></div>
                        )}
                    <li>{heismanFinalists.player_4}</li>
                    {playerImages[heismanFinalists.player_4] ? (
                            <div>
                                <p>{playerImages[heismanFinalists.player_4].position}</p>
                                <img src={playerImages[heismanFinalists.player_4].img} alt={heismanFinalists.player_4} />
                                {playerImages[heismanFinalists.player_4].team ? (
                                    <img src={playerImages[heismanFinalists.player_4].team.logos[0]} alt={heismanFinalists.player_4 + ' Team Logo'} />
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        ) : (
                            <div></div>
                        )}
                    <li>{heismanFinalists.player_5}</li>
                    {playerImages[heismanFinalists.player_5] ? (
                            <div>
                                <p>{playerImages[heismanFinalists.player_5].position}</p>
                                <img src={playerImages[heismanFinalists.player_5].img} alt={heismanFinalists.player_5} />
                                {playerImages[heismanFinalists.player_5].team ? (
                                    <img src={playerImages[heismanFinalists.player_5].team.logos[0]} alt={heismanFinalists.player_5 + ' Team Logo'} />
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        ) : (
                            <div></div>
                        )}
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
        </div> */}
    </div>
    );
};

export default Heisman;
