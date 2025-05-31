import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout/AdminLayout';
import HomeDashboard from './Admin/HomeDashboard';
import LoginForm from './User/LoginForm';
import RegisterForm from './User/RegisterForm';
import UserManagerment from './Admin/UserManagerment';
import ProductManagement from './Admin/ProductManagement';

function AppAdmin() {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/don-hang" element={<LoginForm />} />
          <Route path="/nhan-vien" element={<UserManagerment />} />
          <Route path="/san-pham" element={<ProductManagement/>} />
        <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
}

export default AppAdmin;
