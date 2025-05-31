import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './PromotionDetail.css';
import { FaTags } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PromotionDetail = () => {
  const { id } = useParams(); // id = promotion_id
  const [products, setProducts] = useState([]);
  const [promotionInfo, setPromotionInfo] = useState(null);

  useEffect(() => {
    // Load product list for promotion
    axios.get(`http://localhost:5166/api/promotion/${id}/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error("Lỗi tải sản phẩm khuyến mãi:", err));

    // Load promotion info
    axios.get(`http://localhost:5166/api/promotion/list`)
      .then(res => {
        const promo = res.data.find(p => p.Id === id);
        if (promo) setPromotionInfo(promo);
      })
      .catch(err => console.error("Lỗi tải thông tin khuyến mãi:", err));
  }, [id]);

  const calculateDiscount = (original, current) => {
    if (!original || !current || current >= original) return null;
    const percent = Math.round(((original - current) / original) * 100);
    return `-${percent}%`;
  };

  const handleAddToCart = (item) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      toast.warn("Vui lòng đăng nhập để mua hàng.");
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      return;
    }

    const cartItem = {
      userId: user.userId,
      productId: item.productId,
      productName: item.name,
      quantity: 1,
      price: item.price2 && item.price2 < item.price1 ? item.price2 : item.price1,
    };

    axios.post('http://localhost:5166/api/cart/add', cartItem)
      .then(() => toast.success('Đã thêm vào giỏ hàng'))
      .catch(() => toast.error('Lỗi khi thêm vào giỏ hàng'));
  };

  return (
    <div className="promotion-detail">
      {promotionInfo && (
        <div className="promotion-header">
          <h2>🎁 {promotionInfo.Title}</h2>
          <p><strong>📅 {promotionInfo.Date}</strong></p>
          <p>{promotionInfo.Description}</p>
        </div>
      )}

      <div className="promotion-title">
        <FaTags className="icon" />
        <span>Sản phẩm khuyến mãi</span>
      </div>

      <div className="product-grid">
        {products.map((item) => {
          const originalPrice = item.price1;
          const discountedPrice =
            item.price2 && item.price2 < item.price1 ? item.price2 : item.price1;
          const discount = calculateDiscount(originalPrice, discountedPrice);

          return (
            <div key={item.productId} className="product-card">
              {discount && <div className="discount-badge">{discount}</div>}

              {/* Link ảnh + tên */}
              <Link
                to={`/products/${item.productId}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img
                  src={item.image || item.url_image1 || 'https://via.placeholder.com/150'}
                  alt={item.name}
                />
                <h4>{item.name}</h4>
              </Link>

              <div className="price-wrapper">
                <span className="product-price">
                  {Number(discountedPrice).toLocaleString('vi-VN')} ₫
                </span>
                {discount && (
                  <span className="product-original">
                    {Number(originalPrice).toLocaleString('vi-VN')} ₫
                  </span>
                )}
              </div>

              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(item)}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromotionDetail;
