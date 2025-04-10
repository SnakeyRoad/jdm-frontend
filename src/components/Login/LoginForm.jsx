import React, { useState } from 'react';
import { authenticateUser } from '../../utils/api';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('kid');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (
          (role === 'kid' && username === 'testkid' && password === 'pass') ||
          (role === 'doctor' && username === 'drhouse' && password === 'pass')
      ) {
        onLogin(username, role);
        return;
      }

      const result = await authenticateUser(username, password, role);

      if (result.success) {
        onLogin(username, role);
      } else {
        setError(result.error || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (
          (role === 'kid' && username === 'testkid' && password === 'pass') ||
          (role === 'doctor' && username === 'drhouse' && password === 'pass')
      ) {
        onLogin(username, role);
        return;
      }
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="login-container">
        <div className="login-box">
          <h2>JDM Tracker Login</h2>

          {error && (
              <div className="login-error">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
            />

            <label htmlFor="password">Password</label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
            />

            <div className="login-role">
              <p>I am a:</p>
              <label>
                <input
                    type="radio"
                    value="kid"
                    checked={role === 'kid'}
                    onChange={() => setRole('kid')}
                />
                Kid / Patient
              </label>
              <label>
                <input
                    type="radio"
                    value="doctor"
                    checked={role === 'doctor'}
                    onChange={() => setRole('doctor')}
                />
                Doctor / Clinician
              </label>
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <p className="login-note">
              For testing: Use "testkid"/"pass" for Kid or "drhouse"/"pass" for Doctor
            </p>
          </form>
        </div>
      </div>
  );
};

export default LoginForm;
