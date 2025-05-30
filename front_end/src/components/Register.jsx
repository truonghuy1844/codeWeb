// src/pages/Register.jsx
import React from 'react';
import RegisterForm from './RegisterForm';

const Register = () => {
  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh' }}>
      <div style={{ padding: '2rem' }}>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
