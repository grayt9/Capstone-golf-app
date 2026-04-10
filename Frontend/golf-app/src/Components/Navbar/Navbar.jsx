import React from 'react'
import './Navbar.css'
import logo from '../../Assets/golf-ball-logo.png'
import { NavLink } from "react-router-dom";


const Navbar = () => {
  // NavLink supplies an isActive flag, which lets the current page highlight itself.
  const getNavClassName = ({ isActive }) => isActive ? 'btn active' : 'btn'
  const getSignOutClassName = ({ isActive }) => isActive ? 'btn btn-signout active' : 'btn btn-signout'

  return (
    // Shared site navigation used across the main logged-in pages.
    <nav className='site-nav'>
      <div className='container nav-inner'>
        <div className='brand-mark'>
          <img src={logo} alt="Capstone Golf logo" className='logo' />
          <div className='brand-copy'>
            <span className='brand-title'>Capstone Golf</span>
            <span className='brand-subtitle'>Track rounds with confidence</span>
          </div>
        </div>
        <ul className='nav-links'>
          <li><NavLink to="/home" className={getNavClassName}>Home</NavLink></li>
          <li><NavLink to="/stats" className={getNavClassName}>Stats</NavLink></li>
          <li><NavLink to="/courses" className={getNavClassName}>Courses</NavLink></li>
          <li><NavLink to="/rounds" className={getNavClassName}>Rounds</NavLink></li>
          <li><NavLink to="/" className={getSignOutClassName}>Sign Out</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
