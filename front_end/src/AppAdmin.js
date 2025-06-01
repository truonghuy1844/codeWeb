import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeDashboard from './Admin/HomeDashboard';
import LoginForm from './User/LoginForm';
import RegisterForm from './User/RegisterForm';
import UserManagerment from './Admin/UserManagerment';
import ProductManagement from './Admin/ProductManagement';

function AppAdmin() {
  return (
   
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/don-hang" element={<LoginForm />} />
        <Route path="/nhan-vien" element={<UserManagerment />} />
        <Route path="/san-pham" element={<ProductManagement />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
  );
}

export default AppAdmin;
