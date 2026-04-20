import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../../Assets/golf-ball-logo.png';
import '../Login/Login.css';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://capstone-golf-app-production.up.railway.app/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 2000);
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

  if (!token) {
    return (
      <div className='auth-shell'>
        <div className='auth-card login'>
          <img src={logo} alt="Capstone Golf logo" className='logo-login' />
          <p className='auth-copy' style={{ textAlign: 'center', marginTop: '1rem' }}>
            Invalid reset link. <Link to="/" style={{ color: 'var(--color-primary-dark)', fontWeight: 600 }}>Go to Login</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='auth-shell'>
      <div className='auth-card login'>
        <img src={logo} alt="Capstone Golf logo" className='logo-login' />
        <p className='auth-eyebrow'>Password Reset</p>
        <h1>New Password</h1>

        {success ? (
          <>
            <p className='auth-copy'>Password updated! Heading to login…</p>
          </>
        ) : (
          <>
            <p className='auth-copy'>Enter a new password for your account.</p>
            <form onSubmit={handleSubmit} className='auth-form'>
              {error && <p className='auth-error'>{error}</p>}
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
