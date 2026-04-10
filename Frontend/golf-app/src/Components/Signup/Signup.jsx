import React, { useState } from 'react';
import './Signup.css';
import { Link } from "react-router-dom";
import logo from '../../Assets/golf-ball-logo.png';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Send the registration form to the backend so a new user record can be created.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://capstone-golf-app-production.up.railway.app/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: username,
          email,
          password
        })
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert('Account created successfully!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Signup failed:', err);
      alert('Signup failed. Check console for details.');
    }
  };

  return (
    // Match the login experience while guiding first-time users through signup.
    <div className='auth-shell'>
      <div className='auth-card signup'>
        <img src={logo} alt="Capstone Golf logo" className='logo-signup' />
        <p className='auth-eyebrow'>Get Started</p>
        <h1>Create Your Account</h1>
        <p className='auth-copy'>Build your golf profile, log rounds faster, and start collecting stats that actually help your game.</p>
        <form onSubmit={handleSubmit} className='auth-form'>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
          <button type="submit">Create Account</button>
        </form>
        <p className='login-link'>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
