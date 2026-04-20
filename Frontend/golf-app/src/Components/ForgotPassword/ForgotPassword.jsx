import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../Assets/golf-ball-logo.png';
import '../Login/Login.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://capstone-golf-app-production.up.railway.app/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
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
        <p className='auth-eyebrow'>Password Reset</p>
        <h1>Forgot Password</h1>

        {submitted ? (
          <>
            <p className='auth-copy'>
              If that email is registered, you'll receive a reset link shortly. Check your inbox.
            </p>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/" style={{ color: 'var(--color-primary-dark)', fontWeight: 600 }}>Back to Login</Link>
            </p>
          </>
        ) : (
          <>
            <p className='auth-copy'>Enter your email and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit} className='auth-form'>
              {error && <p className='auth-error'>{error}</p>}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
            <p className='signup-link'>
              Remember your password? <Link to="/">Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
