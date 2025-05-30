import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MiniCartPopup.css';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';

const MiniCartPopup = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      const res = await axios.get(`http://localhost:5228/api/Cart?userId=${user.userId}`);
      setItems(res.data);
      const sum = res.data.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotal(sum);
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
    }
  };

  const updateQuantity = async (productId, delta) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const item = items.find(i => i.productId === productId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    try {
      await axios.patch("http://localhost:5228/api/Cart/update", {
        userId: user.userId,
        productId,
        quantity: newQuantity
      });
      fetchCart();
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
    }
  };

  const removeItem = async (productId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      await axios.delete("http://localhost:5228/api/Cart/remove", {
        params: {
          userId: user.userId,
          productId
        }
      });
      fetchCart();
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  return (
    <div className="mini-cart-popup">
      <h3>Giỏ hàng</h3>
      {items.length === 0 ? (
         <div className="empty-order">
          <FaShoppingCart className="empty-icon" />
              <h3>Chưa có sản phẩm nào</h3>
            <p>Thêm sản phẩm để bắt đầu mua sắm</p>
          </div>
      ) : (
        <>
          {items.map(item => (
            <div key={item.productId} className="cart-item">
              <img src={item.urlImage} alt={item.productName} />
              <div className="cart-details">
                <div className="cart-name">{item.productName}</div>
                <div className="cart-price">
                  <span className="discounted-price">
                    {item.price.toLocaleString('vi-VN')} ₫
                  </span>
                  {item.price1 && item.price1 > item.price && (
                    <span className="original-price">
                      {item.price1.toLocaleString('vi-VN')} ₫
                    </span>
                  )}
                </div>
                <div className="qty-box">
                  <button onClick={() => updateQuantity(item.productId, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, 1)}>+</button>
                </div>
              </div>
              <button onClick={() => removeItem(item.productId)}>x</button>
            </div>
          ))}

          <div className="total-summary">
            Tổng cộng: <span>{total.toLocaleString('vi-VN')} ₫</span>
          </div>

          <div className="cart-buttons">
            <button onClick={() => navigate('/cart')}>Xem giỏ hàng</button>
            <button onClick={() => navigate('/checkout')}>Thanh toán ngay</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MiniCartPopup;
