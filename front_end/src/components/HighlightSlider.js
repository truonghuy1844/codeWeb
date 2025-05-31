import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HighlightSlider.css';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const HighlightSlider = ({ onAddToCartPopup }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5166/api/product/highlight')
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error('API lỗi:', err);
        toast.error('Không thể tải sản phẩm nổi bật.');
      });
  }, []);

  const calculateDiscount = (original, current) => {
    if (!original || !current || current >= original) return null;
    return Math.round(((original - current) / original) * 100);
  };

  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.warn("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }

    const price = product.price2 && product.price2 < product.price1 ? product.price2 : product.price1;

    const cartItem = {
      userId: user.userId,
      productId: product.productId,
      productName: product.name,
      quantity: 1,
      price,
    };

    axios.post('http://localhost:5166/api/cart/add', cartItem)
      .then((res) => {
        toast.success(res.data.message || 'Đã thêm vào giỏ hàng');
        if (onAddToCartPopup) onAddToCartPopup();
      })
      .catch((err) => toast.error('Lỗi: ' + (err.response?.data || err.message)));
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  return (
  <div className="highlight-slider">
    <div className="highlight-wrapper">
      <h2 className="highlight-title">Sản phẩm nổi bật</h2>
      {products.length === 0 ? (
        <p>Đang tải sản phẩm nổi bật...</p>
      ) : (
        <Slider {...settings}>
          {products.map((p) => {
            const hasDiscount = p.price2 && p.price2 < p.price1;
            const discountPercent = calculateDiscount(p.price1, p.price2);

            return (
              <div className="highlight-card" key={p.productId}>
                {hasDiscount && (
                  <div className="discount-badge">-{discountPercent}%</div>
                )}

                <Link to={`/products/${p.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={p.urlImage1 || 'https://via.placeholder.com/150'} alt={p.name} />
                  <h4>{p.name}</h4>
                </Link>

                <div className="price-wrapper">
                  <span className="product-price">
                    {(hasDiscount ? p.price2 : p.price1).toLocaleString('vi-VN')} ₫
                  </span>
                  {hasDiscount && (
                    <span className="product-original">
                      {p.price1.toLocaleString('vi-VN')} ₫
                    </span>
                  )}
                </div>

                <button onClick={() => handleAddToCart(p)}>Thêm vào giỏ hàng</button>
              </div>
            );
          })}
        </Slider>
      )}
    </div>
  </div>
);

};

export default HighlightSlider;
