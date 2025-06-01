import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from './Logo.png';
import './MenuAdmin.css';

const MenuAdmin = () => {
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: '🏠', path: '/admin/' },
    { id: 'staff', label: 'Người dùng', icon: '👥', path: '/admin/nhan-vien' },
    { id: 'products', label: 'Sản phẩm', icon: '📦', path: '/admin/san-pham' },
    { id: 'orders', label: 'Đơn hàng', icon: '📋', path: '/admin/don-hang' }
  ];

  const activeTab = menuItems.find(item => item.path === path)?.id || '';


  return (
    <div className="menu72-container">
      <div className="menu72-header">
        <div className="menu72-logo-wrap">
          <div className="menu72-logo">
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 className="menu72-title">Admin Panel</h1>
          <p className="menu72-subtitle">Quản lý hệ thống</p>
        </div>
      </div>

      <div className="menu72-body">
        <h2 className="menu72-section">Menu chính</h2>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`menu72-link ${isActive ? 'menu72-active' : ''}`}
            >
              <div className="menu72-icon">{item.icon}</div>
              <span className="menu72-text">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MenuAdmin;
