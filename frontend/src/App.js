// import axios from 'axios';
import React from "react"
import Login from './pages/LoginPage'
import ProductList from "./pages/ProductListPage"
import Home from "./pages/HomePage"
import NoPage from "./pages/NoPage"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>

          <Route path="/login" element={<Login/>}/>
          <Route path="/product-list" element={<ProductList/>}/>
          <Route path="*" element={<NoPage/>}/>
          {/* <Route index element={<ProductList/>}/> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App