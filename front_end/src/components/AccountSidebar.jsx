// src/components/AccountSidebar.jsx
import React from 'react';
import { FaUser, FaMapMarkerAlt, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import './AccountSidebar.css';

const AccountSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="profile-sidebar">
      <h2>Tài khoản của tôi</h2>
      <ul>
        <li>
          <NavLink to="/account" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaUser className="sidebar-icon" /> Thông tin cá nhân
          </NavLink>
        </li>
        <li>
          <NavLink to="/address" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaMapMarkerAlt className="sidebar-icon" /> Địa chỉ 
          </NavLink>
        </li>
        <li>
          <NavLink to="/orderHistory" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaClipboardList className="sidebar-icon" /> Lịch sử mua hàng
          </NavLink>
        </li>
        <li onClick={handleLogout}>
          <span style={{ cursor: 'pointer' }}>
            <FaSignOutAlt className="sidebar-icon" /> Đăng xuất
          </span>
        </li>
      </ul>
    </div>
  );
};

export default AccountSidebar;
