import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from './Logo.png';

const MenuAdmin = () => {
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: '🏠', path: '/admin', gradient: 'from-emerald-500 to-teal-600' },
    { id: 'staff', label: 'Nhân viên', icon: '👥', path: '/admin/nhan-vien', gradient: 'from-violet-500 to-purple-600' },
    { id: 'products', label: 'Sản phẩm', icon: '📦', path: '/admin/san-pham', gradient: 'from-orange-500 to-red-600' },
    { id: 'orders', label: 'Đơn hàng', icon: '📋', path: '/admin/don-hang', gradient: 'from-blue-500 to-indigo-600' }
  ];

  // xác định tab nào đang active theo URL
  const activeTab = menuItems.find(item => path.startsWith(item.path))?.id || 'home';

  return (
    <div className="w-72 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <img src={logo} alt="Logo" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
          <h1 className="mt-4 font-bold text-lg text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-sm text-slate-400">Quản lý hệ thống</p>
        </div>
      </div>

      {/* Menu */}
      <div className="p-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu chính</h2>
        <nav className="space-y-3">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} shadow-lg shadow-${item.gradient.split('-')[1]}-500/25 scale-105`
                    : 'hover:bg-slate-700/50 hover:scale-102'
                }`}
              >
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 blur-sm`}></div>
                )}

                <div className={`relative z-10 w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                }`}>
                  <span className="transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                </div>

                <span className={`relative z-10 font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-300 group-hover:text-white'
                }`}>
                  {item.label}
                </span>

                {isActive && (
                  <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MenuAdmin;
