import React, { useState, useRef } from 'react'
import {FaSearch} from "react-icons/fa"
import "./SearchBar.css"
const SearchBar = ({setPlayerSearchResults, accessToken}) => {
    // const setPlayerSearchResults = props.setPlayerSearchResults
    // const accessToken = props.accessToken
    const [input, setInput] = useState("")
    const queryRef = useRef('')
    const backendURL = process.env.REACT_APP_API_URL;

    const fetchPlayers = (value) => {
        if (value.length < 4) {
            setPlayerSearchResults([])
            return
        }
        queryRef.current = value;

        fetch(`${backendURL}/api/cfbd/?search_term=${value}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
            },
          }).then((response) => response.json())
          .then((json) => {
            if (value === queryRef.current) {
                setPlayerSearchResults(json)
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