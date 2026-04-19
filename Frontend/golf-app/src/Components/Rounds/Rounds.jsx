import { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import './Rounds.css'

const Rounds = ({ userId }) => {
  const [rounds, setRounds] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [holeData, setHoleData] = useState({})
  const [holeLoading, setHoleLoading] = useState(false)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    fetch(`https://capstone-golf-app-production.up.railway.app/api/stats/${userId}`)
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.DatePlayed) - new Date(a.DatePlayed))
        setRounds(sorted)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [userId])

  const handleExpand = (round) => {
    const id = round.RoundID
    if (expandedId === id) { setExpandedId(null); return }

    setExpandedId(id)

    if (holeData[id]) return

    setHoleLoading(true)
    fetch(`https://capstone-golf-app-production.up.railway.app/api/rounds/${id}/holes`)
      .then(res => res.json())
      .then(data => setHoleData(prev => ({ ...prev, [id]: data })))
      .catch(err => console.error(err))
      .finally(() => setHoleLoading(false))
  }

  return (
    <div className='page-shell'>
      <Navbar />
      <section className='page-hero'>
        <p className='page-eyebrow'>Rounds</p>
        <h1 className='page-title'>Every round, all in one place.</h1>
        <p className='page-copy'>
          A full history of your rounds — sorted by most recent. Click any round to see hole-by-hole detail.
        </p>
      </section>

      <section className='rounds-list'>
        {loading && <p className='muted'>Loading rounds...</p>}

        {!loading && rounds.length === 0 && (
          <p className='muted'>No rounds yet. Play a round to see your history here.</p>
        )}

        {rounds.map((round) => {
          const id = round.RoundID
          const isOpen = expandedId === id
          const holes = holeData[id]

          return (
            <article key={id} className={`round-row ${isOpen ? 'round-row--open' : ''}`}>
              <button className='round-summary' onClick={() => handleExpand(round)}>
                <div className='round-meta'>
                  <p className='round-course'>{round.CourseName}</p>
                  <p className='round-date'>
                    {new Date(round.DatePlayed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className='round-right'>
                  <div className='round-stats'>
                    <div className='round-stat'>
                      <span className='round-stat-label'>Score</span>
                      <span className='round-stat-value'>{round.TotalScore}</span>
                    </div>
                    <div className='round-stat'>
                      <span className='round-stat-label'>Putts</span>
                      <span className='round-stat-value'>{round.TotalPutts}</span>
                    </div>
                    <div className='round-stat'>
                      <span className='round-stat-label'>GIR</span>
                      <span className='round-stat-value'>{Number(round.GIRPercent).toFixed(0)}%</span>
                    </div>
                    <div className='round-stat'>
                      <span className='round-stat-label'>Fairway</span>
                      <span className='round-stat-value'>{Number(round.FairwayPercent).toFixed(0)}%</span>
                    </div>
                  </div>
                  <span className={`round-chevron ${isOpen ? 'round-chevron--up' : ''}`}>▾</span>
                </div>
              </button>

              {isOpen && (
                <div className='round-detail'>
                  {holeLoading && !holes && <p className='muted' style={{ padding: '1rem' }}>Loading holes...</p>}
                  {holes && (
                    <table className='holes-table'>
                      <thead>
                        <tr>
                          <th>Hole</th>
                          <th>Par</th>
                          <th>Score</th>
                          <th>+/-</th>
                          <th>Putts</th>
                          <th>GIR</th>
                          <th>FW</th>
                        </tr>
                      </thead>
                      <tbody>
                        {holes.map(h => {
                          const diff = h.Score - h.Par
                          return (
                            <tr key={h.HoleNumber}>
                              <td>{h.HoleNumber}</td>
                              <td>{h.Par}</td>
                              <td>{h.Score}</td>
                              <td className={diff < 0 ? 'under-par' : diff === 0 ? 'even-par' : 'over-par'}>
                                {diff === 0 ? 'E' : diff > 0 ? `+${diff}` : diff}
                              </td>
                              <td>{h.Putts}</td>
                              <td>{h.GIR ? '✓' : '–'}</td>
                              <td>{h.FairwayHit ? '✓' : '–'}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </section>
    </div>
  )
}

export default Rounds
