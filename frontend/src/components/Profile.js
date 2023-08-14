import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import GamesList from "./GamesList"
import "./Profile.css"
const Profile = () => {
    const [profileData, setProfileData] = useState({})
    let { user_id } = useParams();
    const accessToken = localStorage.getItem('access')
    const [heismanImage, setHeismanImage] = useState([])

    useEffect(() => {
        const fetchHeismanImage = async(event) => {
            try {
                const response = await fetch(`http://localhost:8000/api/users/profile/${user_id}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
                });
                const data = await response.json();
                console.log(data)
                if (response.status === 200 || response.status === 201) {
                    setProfileData(data)
                }

            }
                
            catch (error) {
            console.error("Error fetching heisman finalists: ", error);
            }
        }
        const fetchProfileData = async(event) => {
            try {
                const response = await fetch(`http://localhost:8000/api/users/profile/${user_id}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
                });
                const data = await response.json();
                console.log(data)
                if (response.status === 200 || response.status === 201) {
                    setProfileData(data)
                }

            }
                
            catch (error) {
            console.error("Error fetching heisman finalists: ", error);
            }
        }
        fetchProfileData();
        fetchHeismanImage();
    }, []);

  return (

    <div>
        {"username" in profileData ? (
            <div>
            <div>{profileData.username}</div>
            <div>
                {profileData.favorite_team && (profileData.favorite_team).length>0 ? (
                    <img src={profileData.favorite_team[0].team.logos[0]}></img>
                ) : (
                    <div>User has not set favorite team</div>
                )}
                </div>
                <GamesList predictions={profileData.predictions}/>
                {/* <div>
      {profileData.predictions && profileData.predictions.length > 0 ? (
        <div>
          {profileData.predictions.map((prediction) => (
            <div key={prediction.id} className='game-container'>
            <div className='game-button'>
              <div className='team-info'>
                <div className='team-details'>
                  <img src={prediction.game.home_team.logos[0]} alt={prediction.game.home_team.school} />
                  <h3>{prediction.game.home_team.abbreviation}</h3>
                  <p>{prediction.game.home_points}</p>
                </div>
                <div>
                    vs.
                </div>
                <div className='team-details'>
                  <img src={prediction.game.away_team.logos[0]} alt={prediction.game.away_team.school} />
                  <h3>{prediction.game.away_team.abbreviation}</h3>
                  <p>{prediction.game.away_points}</p>
                </div>
              </div>
              <div className='game-details'>
                <p>{prediction.game.year}</p>
                <p>{prediction.game.week}</p>
                <p>Locks at {prediction.game.lock_time}</p>
                <p>{prediction.game.locked}</p>
                <p>{prediction.game.line}</p>
                <p>{prediction.game.game_id}</p>
                    <div>
                    <div className="toggle-button">
      <button
        className={`gs ${(prediction.home_winner) ? "selected" : ""}`}
      >
        {prediction.game.home_team.abbreviation}
      </button>
      <div>
            To win
          </div>
      <button
        className={`gs ${(!prediction.home_winner) ? "selected" : ""}`}
      >
        {prediction.game.away_team.abbreviation}
      </button>
    </div>
                </div>

                <div>
                    <div className="toggle-button">
      <button
        className={`gs ${(prediction.home_cover) ? "selected" : ""}`}
      >
        {prediction.game.home_team.abbreviation}
      </button>
      <div>
            To cover
          </div>
      <button
        className={`gs ${(!prediction.home_cover) ? "selected" : ""}`}
      >
        {prediction.game.away_team.abbreviation}
      </button>
    </div>
                </div>
              </div>
            </div>
          </div>
          
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div> */}

    <div>
            <h2> Heisman Finalists</h2>
            {profileData.heisman_finalists ? (
            <div>
                {/* <ol>
                    <li>{profileData.heisman_finalists[0].player_1}</li>
                    <li>{profileData.heisman_finalists[0].player_2}</li>
                    <li>{profileData.heisman_finalists[0].player_3}</li>
                    <li>{profileData.heisman_finalists[0].player_4}</li>
                    <li>{profileData.heisman_finalists[0].player_5}</li>
                </ol> */}
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


            
        ) : (
            <div>User does not exist</div>
        )}
    
        </div>
  );  
};

export default Profile;