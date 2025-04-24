import React, { useState } from 'react';
import { useNavigate } from "react-router";

import { login } from '../../http';

import Eye from '../../../src/assets/eye.svg';
import EyeOff from '../../../src/assets/eye_off.svg';

import './login.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');

    login(email, password)
      .then((response) => {
        if (response.status === 'success') {
          navigate('/dashboard');
        } else {
          setError('Invalid email or password. Please try again.');
        }
      })
      .catch((err) => {
        console.error('Login error:', err);
        setError('An error occurred during login. Please try again later.');
      });
  };

  return (
    <div className='login-container'>
      <form className="login-section" onSubmit={handleSubmit}>
        <h1 className="login-heading mb-5 text-center">Sign in to your account</h1>
        <div className="input-fields-section">
          <div>
            <label htmlFor="email" className="form-label mb-2">
              Email address <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control mb-3"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="position-relative mb-4">
            <label htmlFor="password" className="form-label mb-2">
              Password <span className="text-danger">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={showPassword ? EyeOff : Eye}
              id="togglePassword"
              className="position-absolute password-icon"
              onClick={() => setShowPassword(!showPassword)}
              alt="Toggle Password Visibility"
            />
          </div>
        </div>
        {error && <p className="text-danger mb-3">{error}</p>}
        <button className="signin-button">Sign in</button>
      </form>
    </div>
  );
}

export default Login;
