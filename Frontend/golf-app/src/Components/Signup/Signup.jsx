import { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from "react-router-dom";
import logo from '../../Assets/golf-ball-logo.png';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://capstone-golf-app-production.up.railway.app/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-shell'>
      <div className='auth-card signup'>
        <img src={logo} alt="Capstone Golf logo" className='logo-signup' />
        <p className='auth-eyebrow'>Get Started</p>
        <h1>Create Your Account</h1>
        <p className='auth-copy'>Build your golf profile, log rounds faster, and start collecting stats that actually help your game.</p>

        {success ? (
          <div className='signup-success'>
            <p className='signup-success-icon'>✓</p>
            <p className='signup-success-text'>Account created! Heading to login…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='auth-form'>
            {error && <p className='auth-error'>{error}</p>}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}

        <p className='login-link'>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
