// Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(event.target);
    const credentials = Object.fromEntries(formData);

    try {
      const response = await fetch('http://10.1.34.13:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/home/${data.username}`);
        setAttempts(0); // Reset attempts on success
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');

        if (response.status === 403) {
          setShowRegisterDialog(true);
        } else {
          setAttempts(prevAttempts => prevAttempts + 1);
          if (attempts >= 2) {
            setShowRegisterDialog(true);
          }
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData);

    if (userData.password !== userData.reenterPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://10.1.34.13:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/home/${data.username}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await fetch('http://10.1.34.13:5000/api/test', { method: 'GET' });
        const data = await response.json();
        console.log('Backend test:', data);
      } catch (error) {
        console.error('Backend test failed:', error);
      }
    };
    testBackend();
  }, []);

  return (
    <div className="login-container">
      <div className="login-card" style={{ marginTop: '200px', marginBottom: '200px' }}>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <p>{isRegistering ? 'Create a new account' : 'Enter your credentials to login'}</p>
        <form onSubmit={isRegistering ? handleRegister : handleSubmit}>
          {isRegistering && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" name="phone" type="text" required />
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="username">Username/Email/Phone</label>
            <input id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="reenterPassword">Re-enter Password</label>
              <input id="reenterPassword" name="reenterPassword" type="password" required />
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>
        <button className="link-button" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>

      {showRegisterDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Login Failed</h3>
            <p>You are not registered or have exceeded login attempts. Would you like to register?</p>
            <button onClick={() => {
              setShowRegisterDialog(false);
              setIsRegistering(true);
            }}>
              Register
            </button>
            <br></br><br></br>
            <button onClick={() => setShowRegisterDialog(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
