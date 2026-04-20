import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Login.css';
import logo from '../../Assets/golf-ball-logo.png'

function Login({ setUserId }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://capstone-golf-app-production.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserId(data.userId);
        localStorage.setItem("userId", data.userId);
        navigate("/home");
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-shell'>
      <div className='auth-card login'>
        <img src={logo} alt="Capstone Golf logo" className='logo-login' />
        <p className='auth-eyebrow'>Welcome Back</p>
        <h1>Login</h1>
        <p className='auth-copy'>Pick up where you left off and keep your rounds, stats, and courses in one place.</p>
        <form onSubmit={handleSubmit} className='auth-form'>
          {error && <p className='auth-error'>{error}</p>}
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
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p className="signup-link">
          <Link to="/forgot-password">Forgot your password?</Link>
        </p>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
