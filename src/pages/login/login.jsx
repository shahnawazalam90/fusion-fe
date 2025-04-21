import React from 'react';
import './login.css';

function Login() {
  return (
    <div className='login-container'>

    <section className="login-section">
      <h1 className="login-heading mb-5 text-center">Sign in to your account</h1>
        <div className="input-fields-section">
          <div>
            <label htmlFor="email" className="form-label mb-2">
              Email address <span className="text-danger">*</span>
            </label>
            <input type="email" className="form-control mb-3" id="email" placeholder="Enter your email" />
          </div>

          <div className="position-relative mb-4">
            <label htmlFor="password" className="form-label mb-2">
              Password <span className="text-danger">*</span>
            </label>
            <input type="password" className="form-control" id="password" placeholder="Enter your password"/>
            <img src="../../../src/assets/eye.svg" id="togglePassword" className="position-absolute password-icon" />
         
          </div>
        </div>
      <button className="signin-button">Sign in</button>
    </section>
    </div>
  );
}

export default Login;
