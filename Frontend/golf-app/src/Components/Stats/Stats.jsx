import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import './Stats.css'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

const FILTERS = [
  { key: "TotalScore", label: "Score" },
  { key: "TotalPutts", label: "Putts" },
  { key: "GIRPercent", label: "GIR %" },
  { key: "FairwayPercent", label: "Fairway %" },
]

const Stats = ({ userId }) => {
  const [rounds, setRounds] = useState([])
  const [activeFilter, setActiveFilter] = useState("TotalScore")

  useEffect(() => {
    console.log("userId in stats:", userId) //testing
    if (!userId) return
    fetch(`https://capstone-golf-app-production.up.railway.app/api/stats/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log("stats data:", data) //testing 
        setRounds(data)
      })
      .catch(err => console.error(err))
  }, [userId])

  const dateCounts = rounds.reduce((acc, r) => {
    const d = new Date(r.DatePlayed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    acc[d] = (acc[d] || 0) + 1
    return acc
  }, {})

  const chartData = rounds.map(r => {
    const date = new Date(r.DatePlayed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const label = dateCounts[date] > 1 ? `${date} · ${r.CourseName.split(' ')[0]}` : date
    return { date: label, course: r.CourseName, value: r[activeFilter] }
  })

  return (
    <div className='page-shell'>
      <Navbar />
      <section className='page-hero'>
        <p className='page-eyebrow'>Stats</p>
        <h1 className='page-title'>Measure what actually improves your round.</h1>
      </section>

      <section style={{ padding: "0 2rem 2rem" }}>

        {/* Filter toggles */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem" }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                background: activeFilter === f.key ? "#4a7c59" : "#fff",
                color: activeFilter === f.key ? "#fff" : "#333",
                cursor: "pointer",
                fontWeight: activeFilter === f.key ? "500" : "400"
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Line chart */}
        {rounds.length === 0 ? (
          <p style={{ color: "#888" }}>No round data yet. Play a round to see your stats.</p>
        ) : (
          <div style={{ background: 'var(--color-surface-strong)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const { date, course, value } = payload[0].payload
                return (
                  <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}>
                    <p style={{ fontWeight: 600, marginBottom: 2 }}>{course}</p>
                    <p style={{ color: '#888', marginBottom: 4 }}>{date}</p>
                    <p style={{ color: '#2f6b3c', fontWeight: 500 }}>{FILTERS.find(f => f.key === activeFilter)?.label}: {value}</p>
                  </div>
                )
              }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4a7c59"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          </div>
        )}

        {/* Summary cards */}
        {rounds.length > 0 && (
          <div style={{ display: "flex", gap: "12px", marginTop: "2rem", flexWrap: "wrap" }}>
            <div className="stat-card">
              <p className="stat-label">Rounds Played</p>
              <p className="stat-value">{rounds.length}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Avg Score</p>
              <p className="stat-value">
                {(rounds.reduce((a, r) => a + Number(r.TotalScore), 0) / rounds.length).toFixed(1)}
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Avg Putts</p>
              <p className="stat-value">
                {(rounds.reduce((a, r) => a + Number(r.TotalPutts), 0) / rounds.length).toFixed(1)}
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Avg GIR %</p>
              <p className="stat-value">
                {(rounds.reduce((a, r) => a + Number(r.GIRPercent), 0) / rounds.length).toFixed(1)}%
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Avg Fairway %</p>
              <p className="stat-value">
                {(rounds.reduce((a, r) => a + Number(r.FairwayPercent), 0) / rounds.length).toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Stats