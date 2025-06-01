import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHeader.css'; // có thể dùng lại CSS hoặc tạo file riêng

const AdminHeader = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed && parsed.userId) {
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem('user');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="left">
          <Link to="/" className="back-to-user">← Trang người dùng</Link>
        </div>

        <div className="right">
          {user ? (
            <>
              <span>👤 {user.name || user.email}</span>
              <button onClick={handleLogout} className="logout-btn">
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
