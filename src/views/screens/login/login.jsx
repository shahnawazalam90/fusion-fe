import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import { login } from 'src/http';

import './login.scss';

const { Text, Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <Card className='login-form-card'>
        <div className='d-flex flex-column gap-5 p-5'>
          <Title className='text-align-center' level={3}>Sign in to your account</Title>
          <div className='d-flex flex-column gap-3'>
            <div className='d-flex flex-column gap-2'>
              <div className='d-flex flex-column gap-1'>
                <Title level={5}>Email <Text type='danger'>*</Text></Title>
                <Input
                  size='large'
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  value={email}
                  onPressEnter={handleSubmit}
                />
              </div>
              <div className='d-flex flex-column gap-1'>
                <Title level={5}>Password <Text type='danger'>*</Text></Title>
                <Input.Password
                  name='password'
                  size='large'
                  placeholder='Enter your password'
                  iconRender={(visible) => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined />)}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  value={password}
                  onPressEnter={handleSubmit}
                />
              </div>
              {error && <Text type='danger'>{error}</Text>}
            </div>
            <Button type='primary' size='large' onClick={handleSubmit}>Sign In</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
