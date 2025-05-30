import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const [items, setItems] = useState([]);

  // 🛒 Gọi API lấy giỏ hàng của userId=1
  useEffect(() => {
    axios.get('http://localhost:5228/api/cart?userId=1')
      .then((res) => {
        console.log('✅ Dữ liệu giỏ hàng:', res.data);
        setItems(res.data);
      })
      .catch((err) => {
        console.error('❌ Lỗi khi gọi API giỏ hàng:', err);
        alert('Không thể tải giỏ hàng');
      });
  }, []);

  const handleRemove = (productId) => {
    axios.delete(`http://localhost:5228/api/cart/remove?userId=1&productId=${productId}`)
      .then(() => {
        setItems(prev => prev.filter(item => item.productId !== productId));
      })
      .catch((err) => {
        console.error('❌ Xoá thất bại:', err);
        alert('Không thể xoá sản phẩm khỏi giỏ hàng');
      });
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h2>🛒 Giỏ hàng</h2>
      {items.length === 0 ? (
        <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productName}</td>
                  <td>{item.price.toLocaleString('vi-VN')} ₫</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</td>
                  <td>
                    <button className="remove-btn" onClick={() => handleRemove(item.productId)}>🗑 Xoá</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="cart-total">Tổng: {total.toLocaleString('vi-VN')} ₫</h3>
        </>
      )}
    </div>
  );
};

export default Cart;
