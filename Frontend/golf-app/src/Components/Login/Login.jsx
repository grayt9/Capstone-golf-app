import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Login.css';
import logo from '../../Assets/golf-ball-logo.png'

function Login({ setUserId }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Submit credentials to the backend, then save the returned user id so the
  // rest of the app knows which golfer is active.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://capstone-golf-app-production.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("login response:", data) //test

      if (res.ok) {
        setUserId(data.userId);
        alert(`Welcome back, ${data.username}!`);
        // Send the user to the dashboard once authentication succeeds.
        navigate("/home");
      } else {
        alert(data.error);
  }

    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    // Present a focused login card with a route to account creation for new users.
    <div className='auth-shell'>
      <div className='auth-card login'>
        <img src={logo} alt="Capstone Golf logo" className='logo-login' />
        <p className='auth-eyebrow'>Welcome Back</p>
        <h1>Login</h1>
        <p className='auth-copy'>Pick up where you left off and keep your rounds, stats, and courses in one place.</p>
        <form onSubmit={handleSubmit} className='auth-form'>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p className="signup-link">
           Don’t have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}

export default Login;
