import React from 'react'
import "./SearchResultList.css"
import SearchResult from './SearchResult'
const SearchResultList = (props) => {

  const playerSearchResults = props.playerSearchResults
  const updateHeismans=props.updateHeismans
  const SetUpdateHeismans=props.SetUpdateHeismans
  const accessToken = props.accessToken
  return (
    <div className="results-list">
      {playerSearchResults && playerSearchResults.length > 0 ? (
        <div>
          {playerSearchResults.map((result, id) => (
            <div key={id}>
              <SearchResult result={result} updateHeismans={updateHeismans} SetUpdateHeismans={SetUpdateHeismans} accessToken={accessToken}/>
            </div>
          ))}
        </div>
      ) : (
        <div></div>
      )}
      </div>
  )
}

export default SearchResultList