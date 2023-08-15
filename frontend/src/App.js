// import axios from 'axios';
import React, {useState, useEffect} from "react"
import Login from './pages/LoginPage'
import ProductList from "./pages/ProductListPage"
import Register from "./pages/RegisterPage"
import Home from "./pages/HomePage"
import NoPage from "./pages/NoPage"
import LoggedInNavbar from "./components/LoggedInNavbar"
import GuestNavbar from "./components/GuestNavbar"
import { Routes, Route } from 'react-router-dom'
import SearchPlayer from "./pages/SearchPlayerPage"
import SearchTeam from "./pages/SearchTeamPage"
import Profile from "./pages/ProfilePage"
import Games from "./pages/GamesPage"
import Leaderboard from "./pages/LeaderboardPage"
import Heisman from "./pages/HeismanPage"
import Footer from "./components/Footer"
import "./App.css"
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check the local storage to see if the user is logged in
    const loggedInStatus = localStorage.getItem('loggedIn');
    setIsLoggedIn(loggedInStatus === "true");
  }, [isLoggedIn]);

  return (
    <div className="app-container">
      <div className="content-container">
        {isLoggedIn ? (
        <LoggedInNavbar onLogout={() => setIsLoggedIn(false)}/>
      ) : (
        <GuestNavbar />
      )}
        <Routes>
          <Route index element={<Home/>}/>
          <Route path="/home" element={<Home />}/>

          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />}/>
          <Route path="/create-account" element={<Register />}/>
          <Route path="/product-list/:username" element={<ProductList/>}/>
          <Route path="/search-player" element={<SearchPlayer/>}/>
          <Route path="/search-team" element={<SearchTeam/>}/>
          <Route path="/profile/:user_id" element={<Profile/>}/>
          <Route path="/games" element={<Games/>}/>
          <Route path="/leaderboard" element={<Leaderboard />}/>
          <Route path="/heisman" element={<Heisman />}/>
          <Route path="*" element={<NoPage/>}/>
        </Routes>
        </div>
        <Footer/>
    </div>
  )
}

export default App