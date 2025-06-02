import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HighlightSlider from './components/HighlightSlider';
import ProductDetail from './components/ProductDetail';
import Cart from './pages/Cart';
import MiniCartPopup from './components/MiniCartPopup';
import Checkout from './pages/Checkout';
import Register from './User/Register';
import LoginForm from './User/LoginForm';
import Account from './components/Account';
import Address from './components/Address';
import OrderHistory from './components/OrderHistory';
import OrderDetail from './components/OrderDetail';
import ProductHomePage from './components/ProductHomePage';
import ProductCatalog from './components/ProductCatalog';        
import PromotionDetail from './pages/PromotionDetail';
import { ToastContainer } from "react-toastify";
import PromotionPage from './pages/PromotionPage';
import "react-toastify/dist/ReactToastify.css";
import './AppUser.css';

  function HomePage({ onAddToCartPopup }) {
      return (
        <div>
          <div className="menu-banner">
            <img
              src="https://cdn.prod.website-files.com/63297a6e0db55f763a6d4d9a/6335846c5dfd6574c12e5031_image%20(19).webp"
              alt="Vui chơi và học hỏi"
            />
            <div className="banner-text">
              <h2>Vui chơi và học hỏi.</h2>
              <Link to="/products" className="btn-banner">MUA NGAY</Link>
            </div>
          </div>
          <section style={{ background: '#f8f8f8', padding: '20px' }}>
            <HighlightSlider onAddToCartPopup={onAddToCartPopup} />
            <div style={{ marginTop: '40px' }}>
              <div style={{ background: '#fff', padding: '40px 20px' }}>
                {window.location.pathname === '/' && (
                    <PromotionPage />
                  )}
              </div>
            </div>
          </section>
        <div style={{ position: 'relative', textAlign: 'center', margin: '40px 0' }}>
  {/* ảnh nằm trong container tương đối */}
  <img
    src="https://static.vecteezy.com/ti/vetor-gratis/p1/39227377-conjunto-do-fofa-animais-linha-mao-desenhado-estilo-aguarde-colorida-balao-em-nuvem-ceu-background-cat-sapo-coelho-pinguim-shiba-inu-cachorro-desenho-animado-colecao-kawaii-ilustracao-vetor.jpg"
    alt="Khám phá niềm vui tuổi thơ"
    style={{
      width: '80%',
      maxWidth: '960px',
      height: 'auto',
      borderRadius: '20px',
      display: 'block',
      margin: '0 auto'
    }}
  />

  {/* chữ ở giữa ảnh */}
  <div style={{
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(255, 255, 255, 0.85)',
    padding: '12px 24px',
    borderRadius: '40px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#c41c1c',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 10
  }}>
    Khám phá niềm vui tuổi thơ
  </div>
          <div style={{ padding: '20px 40px' }}>
            <ProductHomePage />
          </div>
        </div>
      </div>
      );
    }
          function ProductCatalogPageWrapper({ onAddToCartPopup }) 
          {
            const location = useLocation();
            const query = new URLSearchParams(location.search);
            const keyword = query.get("keyword");
              return (
              <ProductCatalog
              key={location.search}
              onAddToCartPopup={onAddToCartPopup}
              keyword={keyword}
              />
              );
          }

function AppUser() {
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [hoverCart, setHoverCart] = useState(false);

  const handleQtyChange = (productId, delta) => {
    const stored = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updated = stored.map(item =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    localStorage.setItem('cartItems', JSON.stringify(updated));
  };

  const handleAddToCartPopup = () => {
    setShowCartPopup(true);
    setTimeout(() => setShowCartPopup(false), 2000);
  };

  return (
    <div className="App1">
      <Header
        onCartHover={() => setHoverCart(true)}
        onCartLeave={() => setHoverCart(false)}
        showMiniCart={hoverCart}
        onUpdateQty={handleQtyChange}
      />

      {showCartPopup && !hoverCart && (
        <div style={{ position: 'fixed', top: 95, right: 24, zIndex: 9999 }}>
          <MiniCartPopup onUpdateQty={handleQtyChange} showClose={false} />
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomePage onAddToCartPopup={handleAddToCartPopup} />} />
        <Route path="/products" element={<ProductCatalogPageWrapper onAddToCartPopup={handleAddToCartPopup} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/products/:id" element={<ProductDetail onAddToCartPopup={handleAddToCartPopup} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/account" element={<Account />} />
        <Route path="/address" element={<Address />} />
        <Route path="/orderHistory" element={<OrderHistory />} />
        <Route path="/order-detail/:orderId" element={<OrderDetail />} />
        <Route path="/promotions" element={<PromotionPage />} />
        <Route path="/promotions/:id" element={<PromotionDetail />} />
      </Routes>

      <ToastContainer autoClose={1500} />
      <Footer />
    </div>
  );
}

export default AppUser;
