import React from 'react'
import './Signup.css'
import { Link } from "react-router-dom";
import logo from '../../assets/L2.png'

function Signup() {
  return (
    <div>
       <img src={logo} alt="" className='logo-signup' />
      <div className='signup'>
        <h1>Sign Up</h1>
        <form>
          <input type="text" placeholder="Username" />
          <br />
          <input type="email" placeholder="Email" />
          <br />
          <input type="password" placeholder="Password" />
          <br />
          <button type="submit">Create Account</button>
        </form>
        <p className='login-link'>Already have an account?{" "}<Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}

export default Signup