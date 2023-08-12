import React, { useState, useRef } from 'react'
import {FaSearch} from "react-icons/fa"
import "./SearchBar.css"
const SearchBar = ({setPlayerSearchResults}) => {
    const [input, setInput] = useState("")
    const accessToken = localStorage.getItem('access')
    const queryRef = useRef('')

    const fetchPlayers = (value) => {
        if (value.length < 4) {
            setPlayerSearchResults([])
            return
        }
        queryRef.current = value;

        fetch(`http://localhost:8000/api/cfbd/?search_term=${value}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
            },
          }).then((response) => response.json())
          .then((json) => {
            if (value === queryRef.current) {
                setPlayerSearchResults(json)
                console.log(json, value)
            }
            
          })
      };

    const handleChange = (value) => {
        setInput(value);
        setTimeout(() => {
            fetchPlayers(value);
        }, 300); 
    }

  return (
    <div className="input-wrapper">
        <FaSearch id='search-icon'/>
        <input id="player-search" placeholder='Search players...' value={input} onChange={(e)=>handleChange(e.target.value)}/>
    </div>
  )
}

export default SearchBar