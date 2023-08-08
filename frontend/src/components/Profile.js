import React from "react";
import FavoriteTeam from "./FavoriteTeam";

const Profile = () => {
    const user_id = localStorage.getItem("user_id")
  return (
    <FavoriteTeam user_id={user_id}/>
  );  
};

export default Profile;