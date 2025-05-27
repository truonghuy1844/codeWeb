import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && keyword.trim() !== '') {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <header className="header">
      {/* Thanh trên cùng */}
      <div className="top-bar">
        <span>🚚 Miễn phí giao hàng từ đơn 500k</span>
        <div className="top-links">
          <Link to="/login">Đăng nhập</Link>
          <Link to="/register">Đăng ký</Link>
        </div>
      </div>

      {/* Thanh điều hướng chính */}
      <nav className="nav-bar">
        <div className="logo">
          <h1>🎁 TOY STORE</h1>
        </div>

        <ul className="menu">
          <li><Link to="/">Trang chủ</Link></li>
          <li><Link to="/products">Sản phẩm</Link></li>
          <li><Link to="/promotions">Khuyến mãi</Link></li>
          <li><Link to="/account">Tài khoản</Link></li>
        </ul>

        {/* Tìm kiếm + giỏ hàng */}
        <div className="search-cart">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleSearch}
            className="search-input"
          />
          <Link to="/cart" className="cart-icon">🛒 Giỏ hàng</Link>
        </div>
      </nav>

    
    </header>
  );
};

export default Header;
