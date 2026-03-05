import React from 'react'
import './Navbar.css'
import logo from '../../assets/golf-ball-logo.png'
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <nav className='container'>
      <img src={logo} alt="" className='logo' />
      <ul>
        <li><Link to="/home" className="btn">Home</Link></li>
        <li><Link to="/stats" className="btn">Stats</Link></li>
        <li><Link to="/courses" className="btn">Courses</Link></li>
        <li><Link to="/rounds" className="btn">Rounds</Link></li>
        <li><Link to="/" className="btn">Sign Out</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
