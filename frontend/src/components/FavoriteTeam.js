import React, { useState, useEffect } from "react";

const FavoriteTeam = ({user_id}) => {
  const [favoriteTeam, setFavoriteTeam] = useState([]);
  const accessToken = localStorage.getItem("access");
  const backendURL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    // Fetch data from the API after the component mounts
    const fetchFavoriteTeam = async () => {
      try {
        const response = await fetch(`${backendURL}/api/cfbd/favorite-team/${user_id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
            },
        });
        const data = await response.json();
        setFavoriteTeam(data['team']); // Update the state with the fetched product data
        //setA(data['team']['id'])
      } catch (error) {
        console.error("Error fetching favorite team: ", error);
      }
    };

    fetchFavoriteTeam();
  }, []); // Run the effect whenever the access token changes

  return (
    <div>
      {favoriteTeam ? (
        <div>
            <p> {favoriteTeam.school}</p>
            {favoriteTeam.logos && favoriteTeam.logos[0] && (
            <img src={favoriteTeam.logos[0]} alt="Team Logo" />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );  
};

export default FavoriteTeam;