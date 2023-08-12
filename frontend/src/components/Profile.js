import React, {useEffect, useState} from "react";
import FavoriteTeam from "./FavoriteTeam";
import { useParams } from "react-router-dom";

const Profile = () => {
    // const user_id = localStorage.getItem("user_id")
    const [profileData, setProfileData] = useState([])
    let { user_id } = useParams();
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
                // setProfileData(data.results[0)
                // console.log(data.results[0])
                console.log(data)
                
                }
                
               catch (error) {
                console.error("Error fetching heisman finalists: ", error);
              }
        }
        fetchProfileData();
    }, []);
    
  return (
    <FavoriteTeam user_id={user_id}/>
  );  
};

export default Profile;