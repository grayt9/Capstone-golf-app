import React from 'react'
import { Link } from "react-router-dom";
import './Login.css';
import logo from '../../assets/L2.png'

const Login = () => {
  return (
    <div>
      <img src={logo} alt="" className='logo-login' />
      <div className='login'>
        <h1>Login</h1>
        <form className='login-form'>
          <input type="email" placeholder="Email" />
          <br />
          <input type="password" placeholder="Password" />
          <br />
          <button type="submit">Login</button>
        </form>
        <p className="signup-link"> Don’t have an account? <Link to="/home">Sign up</Link></p>
      </div>
    </div>
  )
}

export default Login
