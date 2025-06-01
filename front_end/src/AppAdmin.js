import { Routes, Route, Navigate } from 'react-router-dom';
import HomeDashboard from './Admin/HomeDashboard';
import UserManagerment from './Admin/UserManagerment';
import ProductManagement from './Admin/ProductManagement';
import OrderList from './Admin/OrderManagement';
import RegisterForm from './User/RegisterForm';

function AppAdmin() {
  return (
    <Routes>
      <Route path="/" element={<HomeDashboard />} />
      <Route path="nhan-vien" element={<UserManagerment />} />
      <Route path="san-pham" element={<ProductManagement />} />
      <Route path="don-hang" element={<OrderList />} />
      <Route path="register" element={<RegisterForm />} />
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
}

export default AppAdmin;