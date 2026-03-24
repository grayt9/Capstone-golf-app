import React from 'react'
import Navbar from '../Navbar/Navbar'
import './Home.css'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className='page-shell'>
      <Navbar/>
      <section className='page-hero home-hero'>
        <p className='page-eyebrow'>Dashboard</p>
        <h1 className='page-title'>Play smarter, not just more often.</h1>
        <p className='page-copy'>
          Keep your golf data organized in one calm, focused workspace. Review performance trends,
          track familiar courses, and make each round easier to log.
        </p>
        <button className='home-cta' onClick={() => navigate("/courses")}>
          Play Round
        </button>
      </section>
      <section className='page-grid'>
        <article className='stat-card'>
          <h3>Recent Rounds</h3>
          <p className='stat-value'>12</p>
          <p className='muted'>A strong base for spotting trends over time.</p>
        </article>
        <article className='stat-card'>
          <h3>Average Score</h3>
          <p className='stat-value'>84</p>
          <p className='muted'>A quick pulse check on overall form.</p>
        </article>
        <article className='stat-card'>
          <h3>Tracked Courses</h3>
          <p className='stat-value'>7</p>
          <p className='muted'>Enough course history to compare conditions and results.</p>
        </article>
      </section>
    </div>
  )
}

export default Home
