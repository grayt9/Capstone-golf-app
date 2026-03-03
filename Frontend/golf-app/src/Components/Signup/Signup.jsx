import React, { useState } from 'react';
import './Signup.css';
import { Link } from "react-router-dom";
import logo from '../../assets/L2.png';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

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
    <div>
      <img src={logo} alt="" className='logo-signup' />
      <div className='signup'>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Create Account</button>
        </form>
        <p className='login-link'>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
