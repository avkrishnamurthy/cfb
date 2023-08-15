import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import GamesList from "./GamesList"
import "./Profile.css"
const Profile = () => {
    const [profileData, setProfileData] = useState({})
    let { user_id } = useParams();
    const [playerData, setPlayerData] = useState({})
    const accessToken = localStorage.getItem('access')

    useEffect(() => {
        const fetchProfileData = async(event) => {
            try {
                const response = await fetch(`http://localhost:8000/api/users/profile/${user_id}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
                });
                const data = await response.json();
                if (response.status === 200 || response.status === 201) {
                    setProfileData(data)
                    if (data.player_images && data.heisman_finalists) {
                        let player_map = {}
                        
                        for (let i = 0; i<data.player_images.length; i++) {
                            player_map[data.player_images[i]['player']] = data.player_images[i]
                        }
                        console.log(player_map)
                        setPlayerData(player_map)
                    }
                }

            }
                
            catch (error) {
            console.error("Error fetching heisman finalists: ", error);
            }
        }
        // const fetchProfileData = async(event) => {
        //     try {
        //         const response = await fetch(`http://localhost:8000/api/users/profile/${user_id}/`, {
        //         method: "GET",
        //         headers: {
        //             Authorization: `Bearer ${accessToken}`
        //         }
        //         });
        //         const data = await response.json();
        //         console.log(data)
        //         if (response.status === 200 || response.status === 201) {
        //             setProfileData(data)
        //         }

        //     }
                
        //     catch (error) {
        //     console.error("Error fetching heisman finalists: ", error);
        //     }
        // }
        fetchProfileData();
        // fetchHeismanImage();
    }, [user_id]);

  return (
    <div>
        {"username" in profileData ? (
            <div>
                <div className="header">
            <h1 >{profileData.username}'s profile</h1>
                {profileData.favorite_team && (profileData.favorite_team).length>0 ? (
                    <img className="favorite-team-img" src={profileData.favorite_team[0].team.logos[0]}></img>
                ) : (
                    null
                )}
                </div>
                <hr></hr>
                <GamesList predictions={profileData.predictions}/>
                <div>
  <h2 align="center">Heisman Finalists</h2>
  {profileData.heisman_finalists && profileData.heisman_finalists.length>0 ? (
    <div className="heisman-cards">
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="heisman-card">
          
          {profileData.player_images ? (
            <div className="player-details">
            <h3>{index}. {profileData.heisman_finalists[0][`player_${index}`]}</h3>
            <hr></hr>
            {profileData.heisman_finalists[0][`player_${index}`]!=null ? (
                <div>
                    <p>{playerData[profileData.heisman_finalists[0][`player_${index}`]].position}</p>
                {/* <p>{profileData.player_images[index-1].position}</p> */}
                <img className="heisman-player-img"
                  src={playerData[profileData.heisman_finalists[0][`player_${index}`]].img}
                  alt={profileData.heisman_finalists[`player_${index}`]}
                />
                {playerData[profileData.heisman_finalists[0][`player_${index}`]].team ? (
                  <img className="heisman-team-img"
                    src={playerData[profileData.heisman_finalists[0][`player_${index}`]].team.logos[0]}
                    alt={`${profileData.heisman_finalists[`player_${index}`]} Team Logo`}
                  />
                  
                ) : (
                  null
                )}
                </div>
            ) : (
                null
            )}
          </div>
          ) : (
            null
          )}
        </div>
      ))}
    </div>
  ) : (
    <div>
      <p align="center">No finalists available.</p>
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