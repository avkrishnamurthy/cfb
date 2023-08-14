import React, { useState } from "react";
import './UserSearch.css'
import { useNavigate } from "react-router-dom";
const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const accessToken = localStorage.getItem("access");
  const navigate = useNavigate();
  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/search/?username=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
        },
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching user search results: ", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prevShow) => !prevShow);
  };

  const visitProfile = (user_id) => {
    navigate(`/profile/${user_id}`)
    window.location.reload()
  }

  return (
    <div className="dropdown">
      <button className="dropbtn" onClick={toggleDropdown}>
        User Search
      </button>
      {showDropdown && (
        <div className="dropdown-content">
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button onClick={handleSearch}>Search</button>
          {searchResults.map((user) => (
            <div key={user.id}>
              <p>Username: {user.username}</p>
              <button type="button" onClick={() => visitProfile(user.id)}> Visit Profile </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;