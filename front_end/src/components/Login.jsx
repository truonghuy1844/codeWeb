import React from 'react';
import LoginForm from './LoginForm';

const Login = () => {
  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh' }}>
      <div style={{ padding: '2rem' }}>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
