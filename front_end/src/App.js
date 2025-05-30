import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout/AdminLayout';
import HomeDashboard from './Home/HomeDashboard';
import LoginForm from './LoginForm';

function App() {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/don-hang" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
}

export default App;
