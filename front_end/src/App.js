import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout/AdminLayout';
import HomeDashboard from './Home/HomeDashboard';
import LoginForm from './LoginForm';
import RegisterForm from './components/RegisterForm';
import UserManagerment from './UserComponent/UserManagerment';
import ProductManagement from './ProductManagement/ProductManagement';

function App() {
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

export default App;
