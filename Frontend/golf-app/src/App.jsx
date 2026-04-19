import React, { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import Signup from './Components/Signup/Signup'
import Login from './Components/Login/Login'
import Background from './Components/Background/Background'
import Home from "./Components/Home/Home"
import Stats from './Components/Stats/Stats'
import Courses from './Components/Courses/Courses'
import Rounds from './Components/Rounds/Rounds'
import Scorecard from './Components/Scorecard/Scorecard'

const App = () => {
  //const [userId, setUserId] = useState(null)
  const [userId, setUserId] = useState(localStorage.getItem("userId"))
  console.log("App userId state:", userId)
  return (
    <Background>
      <Routes>
        <Route path="/" element={<Login setUserId={setUserId} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/rounds" element={<Rounds userId={userId} />} />
        <Route path="/courses" element={<Courses userId={userId} />} />
        <Route path="/scorecard" element={<Scorecard userId={userId} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/stats" element={<Stats userId={userId} />} />
      </Routes>
    </Background>
  )
}

export default App
