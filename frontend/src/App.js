// import axios from 'axios';
import React, {useState} from "react"
import Login from './pages/LoginPage'
import ProductList from "./pages/ProductListPage"
import Register from "./pages/RegisterPage"
import Home from "./pages/HomePage"
import NoPage from "./pages/NoPage"
import LoggedInNavbar from "./components/LoggedInNavbar"
import GuestNavbar from "./components/GuestNavbar"
import { Routes, Route } from 'react-router-dom'
import SearchTeam from "./pages/SearchTeamPage"
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  return (
    <div>
        {isLoggedIn ? (
        <LoggedInNavbar onLogout={handleLogout} />
      ) : (
        <GuestNavbar />
      )}
        <Routes>
          <Route index element={<Home/>}/>
          <Route path="/home" element={<Home />}/>

          <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
          <Route path="/create-account" element={<Register />}/>
          <Route path="/product-list/:username" element={<ProductList/>}/>
          <Route path="/search-team" element={<SearchTeam/>}/>
          <Route path="*" element={<NoPage/>}/>
        </Routes>

        <div>Footer</div>
    </div>
  )
}

export default App