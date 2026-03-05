import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Login.css';
import logo from '../../assets/golf-ball-logo.png'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://capstone-golf-app-production.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
    alert(`Welcome back, ${data.username}!`);
    // Redirect to homepage
    navigate("/home");  // <-- redirects to homepage
  } else {
    alert(data.error);
  }

    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div>
      <img src={logo} alt="" className='logo-login' />
      <div className='login'>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
        <p className="signup-link">
           Don’t have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}

export default Login;
