import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MiniCartPopup from './MiniCartPopup';
import './Header.css';

const Header = ({ onUpdateQty }) => {
  const [showCart, setShowCart] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

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

    handleUserLogin(); // Khi component mount
    window.addEventListener("userLogin", handleUserLogin);

    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/login');
    window.location.reload(); // Reload để reset UI
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && keyword.trim() !== '') {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };
  
  return (
    <header className="header">
      <div className="top-bar">
        <span>🚚 Miễn phí giao hàng từ đơn 500k</span>
        <div className="top-links">
          {user ? (
            <>
              <span>👤 Xin chào, <strong>{user.name || user.email}</strong></span>
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#ffcc00',
                  cursor: 'pointer',
                }}
              >
                <div className="logout"> Đăng xuất </div>
              </button>
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
