import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MiniCartPopup from './MiniCartPopup';
import './Header.css';
import { FaUserShield } from 'react-icons/fa';

const Header = ({ onUpdateQty }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      document.body.classList.add('user-body');
    }
    return () => {
      document.body.classList.remove('user-body');
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleUserLogin = () => {
      const storedUser = localStorage.getItem('user');
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.userId) {
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (e) {
        localStorage.removeItem('user');
        setUser(null);
      }
    };
    handleUserLogin();
    window.addEventListener("userLogin", handleUserLogin);
    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    setUser(null);
    navigate('/login');
    window.location.reload();
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && keyword.trim() !== '') {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const isAdmin = user?.isAdmin === 1 || user?.isAdmin === true;

  return (
    <header className="header">
      <div className="top-bar">
        <span>🚚 Miễn phí giao hàng từ đơn 500k</span>
        <div className="top-links user-info">
          {user ? (
            <>
              {isAdmin && (
                <button className="admin-switch-button" onClick={() => navigate('/admin')}>
                  <FaUserShield /> Trang quản trị
                </button>
              )}
              <span>👤 Xin chào, <strong>{user.name || user.email}</strong></span>
              <span onClick={handleLogout} className="logout">Đăng xuất</span>
            </>
          ) : (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register">Đăng ký</Link>
            </>
          )}
        </div>
      </div>

      <nav className="nav-bar">
        <div className="logo1">
          <h1>TOY STORE</h1>
        </div>

        <ul className="menu1">
          <li><Link to="/">Trang chủ</Link></li>
          <li><Link to="/products">Sản phẩm</Link></li>
          <li><Link to="/promotions">Khuyến mãi</Link></li>
          <li><Link to="/account">Tài khoản</Link></li>
        </ul>

        <div className="search-cart">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleSearch}
            className="search-input"
          />
          <div
            className="cart-hover-area"
            onMouseEnter={() => setShowCart(true)}
            onMouseLeave={() => setShowCart(false)}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <Link to="/cart" className="cart-icon">Giỏ hàng</Link>
            {showCart && (
              <div className="popup-wrapper" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 9999 }}>
                <MiniCartPopup onClose={() => setShowCart(false)} onUpdateQty={onUpdateQty} />
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
