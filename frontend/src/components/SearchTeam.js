import React, { useState, useEffect } from "react";

const SearchTeam = () => {
  const user_id = localStorage.getItem("user_id")
  const [teamsByConference, setTeamsByConference] = useState({});
  const [collapsedConferences, setCollapsedConferences] = useState({});
  const accessToken = localStorage.getItem("access");
  const [favoriteTeam, setFavoriteTeam] = useState([])

  useEffect(() => {
    // Fetch data from the API after the component mounts
    const fetchFavoriteTeam = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/cfbd/favorite-team/${user_id}`, {
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

  const fetchAllTeams = async (url) => {
    try {
      const allTeams = {};

      while (url) {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();

        if (response.status === 200) {
          // Group teams by conference
          data.results.forEach((team) => {
            const conference = team.conference;
            if (!allTeams[conference]) {
              allTeams[conference] = [];
            }
            allTeams[conference].push(team);
          });

          url = data.next;
        } else {
          setTeamsByConference({ "Unauthenticated": ["Unauthenticated"] });
          return;
        }
      }

      setTeamsByConference(allTeams);
    } catch (error) {
      console.error("Error fetching team data: ", error);
    }
  };

  useEffect(() => {
    const url = "http://localhost:8000/api/cfbd/teams/";
    fetchAllTeams(url);
  }, []);

  const toggleConference = (conference) => {
    setCollapsedConferences((prevCollapsed) => ({
      ...prevCollapsed,
      [conference]: !prevCollapsed[conference],
    }));
  };

  const addFavoriteTeam = async (team_id) => {
    let method = "POST"
    let url = "http://localhost:8000/api/cfbd/favorite-team/"
    if (favoriteTeam) {
        method = "PATCH"
        url = `http://localhost:8000/api/cfbd/favorite-team/${user_id}/update/`
    }
    console.log(team_id)
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ team_id: team_id }),
      });

      if (response.status === 200 || response.status === 201) {
        // Team added to favorites successfully
        alert("Set team as favorite!");
        window.location.reload()
      } else {
        // Failed to add team to favorites
        alert("Failed to add team to favorites.");
      }
    } catch (error) {
      console.error("Error adding team to favorites: ", error);
    }
  };

  return (
    <div>
      {Object.entries(teamsByConference).map(([conference, teams]) => (
        <div key={conference}>
          <button onClick={() => toggleConference(conference)}>
            {conference}
          </button>
          {collapsedConferences[conference] && (
            <div>
              {teams.map((team) => (
                <div key={team.id}>
                  {/* Convert the team information into a button */}
                  <button onClick={() => addFavoriteTeam(team.id)}>
                    <p>{team.school} {team.mascot}</p>
                    <img className="team-images" src={team.logos[0]} alt={team.school} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchTeam;