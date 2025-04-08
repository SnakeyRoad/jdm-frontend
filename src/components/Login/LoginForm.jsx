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
      // For testing purposes, bypass the API call and directly authenticate
      // This is useful if the API mock is causing issues
      if ((role === 'kid' && username === 'testkid' && password === 'pass') ||
          (role === 'doctor' && username === 'drhouse' && password === 'pass')) {
        onLogin(username, role);
        return;
      }
      
      // If not test accounts, use the API
      const result = await authenticateUser(username, password, role);
      
      if (result.success) {
        onLogin(username, role);
      } else {
        setError(result.error || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Bypass error for test accounts if API fails
      if ((role === 'kid' && username === 'testkid' && password === 'pass') ||
          (role === 'doctor' && username === 'drhouse' && password === 'pass')) {
        onLogin(username, role);
        return;
      }
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">JDM Tracker Login</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your test username (e.g., testkid)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password (e.g., pass)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I am a:
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                value="kid"
                checked={role === 'kid'}
                onChange={() => setRole('kid')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Kid / Patient</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                value="doctor"
                checked={role === 'doctor'}
                onChange={() => setRole('doctor')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Doctor / Clinician</span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="text-center text-xs text-gray-500 mt-4">
          <p>For testing: Use "testkid"/"pass" for Kid or "drhouse"/"pass" for Doctor</p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;