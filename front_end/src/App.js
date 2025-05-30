import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';

import Header from './components/Header';
import HighlightSlider from './components/HighlightSlider';
import ProductList from './components/ProductList';
import Cart from './pages/Cart';
import Footer from './components/Footer';

function HomePage() {
  return (
    <div>
      {/* Banner chỉ hiển thị ở trang chủ */}
      <div className="menu-banner">
        <img
          src="https://cdn.prod.website-files.com/63297a6e0db55f763a6d4d9a/6335846c5dfd6574c12e5031_image%20(19).webp"
          alt="Vui chơi và học hỏi"
        />
        <div className="banner-text">
          <h2>Vui chơi và học hỏi.</h2>
          <Link to="/products" className="btn-banner">
            MUA NGAY
          </Link>
        </div>
      </div>

      <section style={{ background: '#f8f8f8', padding: '20px' }}>
        <HighlightSlider />
      </section>

      <section style={{ padding: '20px' }}>
        <h2>Danh sách sản phẩm</h2>
        <ProductList />
      </section>
    </div>
  );
}

// Tạo wrapper để render lại khi từ khoá tìm kiếm thay đổi
function ProductListPageWrapper() {
  const location = useLocation();
  return <ProductList key={location.search} />;
}

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPageWrapper />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
