import React from 'react'
import Navbar from '../Navbar/Navbar'
import './Rounds.css'

const Rounds = () => {
  return (
    // Placeholder page for round history and future round-management tools.
    <div className='page-shell'>
      <Navbar/>
      <section className='page-hero'>
        <p className='page-eyebrow'>Rounds</p>
        <h1 className='page-title'>Make round entry feel fast and focused.</h1>
        <p className='page-copy'>
          Logging a round should feel simple, especially after a long day on the course. This structure gives
          you a clear hero area up top and flexible space underneath for round history or entry forms.
        </p>
      </section>
      <section className='section-stack'>
        <article className='feature-card'>
          <h3>Recent Round History</h3>
          <p className='muted'>Use this area for a compact list of the latest scorecards and played dates.</p>
        </article>
        <article className='feature-card'>
          <h3>Round Builder</h3>
          <p className='muted'>A good next step would be a multi-step entry flow with course selection, date, and hole details.</p>
        </article>
      </section>
    </div>
  )
}

export default Rounds
