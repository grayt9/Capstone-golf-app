import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from './Components/Signup/signup'
import Login from "./Components/Login/login"
import Background from './Components/Background/Background'
import Home from "./Components/Home/Home"


const App = () => {
  return (
    <BrowserRouter>
      <Background>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Background>
    </BrowserRouter>
  )
}

export default App
