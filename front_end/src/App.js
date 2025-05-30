import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout/AdminLayout';
import HomeDashboard from './Home/HomeDashboard';
import OrderList from './Order/OrderList';

function App() {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/don-hang" element={<OrderList />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
}

export default App;
