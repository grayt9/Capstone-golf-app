import React from 'react'
import Navbar from '../Navbar/Navbar'
import './Courses.css'


const Courses = () => {
  return (
    <div className='page-shell'>
      <Navbar/>
      <section className='page-hero'>
        <p className='page-eyebrow'>Courses</p>
        <h1 className='page-title'>Keep every course profile clear and comparable.</h1>
        <p className='page-copy'>
          A course directory works best when it feels structured at a glance. This layout gives you room for
          yardage, par, and notes without falling into a plain table-only view.
        </p>
      </section>
      <section className='page-grid'>
        <article className='feature-card'>
          <h3>Yardage Overview</h3>
          <p className='muted'>Surface course length and par immediately in each card.</p>
        </article>
        <article className='feature-card'>
          <h3>Play Notes</h3>
          <p className='muted'>Reserve space for weather, pace, or memorable tendencies.</p>
        </article>
        <article className='feature-card'>
          <h3>Quick Comparison</h3>
          <p className='muted'>Make it easy to scan familiar courses before tee time.</p>
        </article>
      </section>
    </div>
  )
}

export default Courses
