import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Signup from './Components/Signup/Signup'
import Login from './Components/Login/Login'
import Background from './Components/Background/Background'
import Home from "./Components/Home/Home"
import Stats from './Components/Stats/Stats'
import Courses from './Components/Courses/Courses'
import Rounds from './Components/Rounds/Rounds'


const App = () => {
  return (
    <BrowserRouter>
      <Background>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/rounds" element={<Rounds />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Background>
    </BrowserRouter>
  )
}

export default App
