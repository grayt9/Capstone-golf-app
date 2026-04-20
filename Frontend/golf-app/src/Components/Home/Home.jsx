import { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import './Home.css'
import { useNavigate } from 'react-router-dom'

const Home = ({ userId }) => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!userId) return
    fetch(`https://capstone-golf-app-production.up.railway.app/api/stats/${userId}`)
      .then(res => res.json())
      .then(data => {
        const roundCount = data.length
        const avgScore = roundCount > 0
          ? (data.reduce((sum, r) => sum + Number(r.TotalScore), 0) / roundCount).toFixed(1)
          : 0
        const uniqueCourses = new Set(data.map(r => r.CourseName)).size
        setStats({ roundCount, avgScore, uniqueCourses })
      })
      .catch(err => console.error(err))
  }, [userId])

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
          <p className='stat-value'>{stats ? stats.roundCount : '—'}</p>
          <p className='muted'>A strong base for spotting trends over time.</p>
        </article>
        <article className='stat-card'>
          <h3>Average Score</h3>
          <p className='stat-value'>{stats ? stats.avgScore : '—'}</p>
          <p className='muted'>A quick pulse check on overall form.</p>
        </article>
        <article className='stat-card'>
          <h3>Tracked Courses</h3>
          <p className='stat-value'>{stats ? stats.uniqueCourses : '—'}</p>
          <p className='muted'>Enough course history to compare conditions and results.</p>
        </article>
      </section>
    </div>
  )
}

export default Home
