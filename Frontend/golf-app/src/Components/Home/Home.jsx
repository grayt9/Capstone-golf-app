import React from 'react'
import Navbar from '../Navbar/Navbar'
import './Home.css'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Navbar/>

      <div className="home-container">
        <h1>Home Page</h1>

        <button onClick={() => navigate("/courses")}>
          Play Round
        </button>
      </div>
    </div>
  )
}

export default Home
