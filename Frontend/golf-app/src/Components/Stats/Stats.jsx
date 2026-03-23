import React from 'react'
import Navbar from '../Navbar/Navbar'
import './Stats.css'



const Stats = () => {
  return (
    <div className='page-shell'>
      <Navbar/>
      <section className='page-hero'>
        <p className='page-eyebrow'>Stats</p>
        <h1 className='page-title'>Measure what actually improves your round.</h1>
        <p className='page-copy'>
          This page is set up for focused performance summaries. As you wire in data, cards like these can
          surface the metrics golfers care about most without crowding the screen.
        </p>
      </section>
      <section className='page-grid'>
        <article className='feature-card'>
          <h3>Scoring Trend</h3>
          <p className='muted'>Highlight improvement over the last 5 to 10 rounds.</p>
        </article>
        <article className='feature-card'>
          <h3>Putting Snapshot</h3>
          <p className='muted'>Call out average putts per round with an easy visual benchmark.</p>
        </article>
        <article className='feature-card'>
          <h3>Fairways and GIR</h3>
          <p className='muted'>Pair accuracy metrics together so users can read ball-striking faster.</p>
        </article>
      </section>
    </div>
  )
}

export default Stats
