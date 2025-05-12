import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { login } from 'src/http';

import './login.scss';

const Login = () => {
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
    <div className='login-screen-container d-flex justify-content-center align-items-center'>
      <Card className='login-form-card p-5'>
        <Card.Body className='p-0 d-flex flex-column align-items-center gap-5'>
          <Card.Title className='login-form-title m-0'>Sign in to your account</Card.Title>
          <div className='w-100'>
            <Form className='login-form' onSubmit={handleSubmit}>
              <Form.Group className='mb-3'>
                <Form.Label>Email address <span className='text-danger'>*</span></Form.Label>
                <Form.Control
                  name='Email'
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password <span className='text-danger'>*</span></Form.Label>
                <InputGroup>
                  <Form.Control
                    className='border-end-0'
                    name='Password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputGroup.Text className='password-icon-container'>
                    <i
                      className={classNames(
                        'password-visibility-icon bi text-primary',
                        {
                          'bi-eye-slash-fill': showPassword,
                          'bi-eye-fill': !showPassword
                        }
                      )}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              {error && <p className='text-danger mb-0 mt-3'>{error}</p>}
              <Button className='w-100 mt-4' variant='primary' type='submit'>Sign in</Button>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
