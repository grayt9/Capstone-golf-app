import React from 'react'
import './Navbar.css'
import logo from '../../assets/golf-ball-logo.png'


const Navbar = () => {
  return (
    <nav className='container'>
      <img src={logo} alt="" className='logo' />
      <ul>
        <li><button className='btn'>Home</button></li>
        <li><button className='btn'>Stats</button></li>
        <li><button className='btn'>Courses</button></li>
        <li><button className='btn'>Rounds</button></li>
        <li><button className='btn'>Settings</button></li>
      </ul>
    </nav>
  )
}

export default Navbar
