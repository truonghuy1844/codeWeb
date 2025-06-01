import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AccountSidebar from '../components/AccountSidebar';
import { useNavigate } from 'react-router-dom';
import './OrderHistory.css';
import { FaShoppingCart } from 'react-icons/fa';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return 'Chờ xác nhận';
      case 1: return 'Chờ lấy hàng';
      case 2: return 'Đang giao hàng';
      case 3: return 'Hoàn thành';
      default: return 'Không rõ';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0: return 'waiting';
      case 1: return 'ready';
      case 2: return 'in-progress';
      case 3: return 'completed';
      default: return 'unknown';
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.userId) {
      alert('Vui lòng đăng nhập');
      return;
    }

    axios.get(`http://localhost:5166/api/Orders?buyerId=${user.userId}`)
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error('Lỗi khi lấy đơn hàng:', err);
        alert('Không thể tải lịch sử mua hàng.');
      });
  }, []);

  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh' }}>
      <h1 className="order-title-large">Lịch sử mua hàng</h1>
      <div className="profile-container">
        <AccountSidebar />

        <div className="order-history">
          <h2 className="order-title">Lịch sử mua hàng</h2>

          {orders.length === 0 ? (
            <div className="empty-order">
              <FaShoppingCart className="empty-icon" />
              <h3>Chưa có đơn hàng nào</h3>
              <p>Lịch sử mua hàng của bạn sẽ xuất hiện ở đây</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                className="order-card"
                key={order.orderId}
                onClick={() => navigate(`/order-detail/${order.orderId}`)}
              >
                <div className="order-header">
                  <div>
                    <strong>Mã đơn hàng: </strong>
                    <span className="order-id">{order.orderId}</span> - Ngày đặt: {new Date(order.dateCreated).toLocaleDateString("vi-VN")}
                  </div>
                  <div className={`order-status ${getStatusClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </div>
                </div>

                {order.products?.length > 0 && (
                  <div className="product-item">
                    <img
                      src={order.products[0].thumbnail}
                      alt={order.products[0].productName}
                    />
                    <div className="product-info">
                      <h4>{order.products[0].productName}</h4>
                      <div className="product-details">
                        <p className="description">{order.products[0].description}</p>
                        <p>Số lượng: {order.products[0].quantity}</p>
                        <p>Giá: {order.products[0].price.toLocaleString("vi-VN")} đ</p>
                      </div>
                    </div>
                  </div>
                )}

                {order.products.length > 1 && (
                  <p style={{ fontSize: "0.85rem", color: "#999" }}>
                    Và {order.products.length - 1} sản phẩm khác...
                  </p>
                )}

                <div className="order-total">
                  Tổng tiền: {order.totalPrice.toLocaleString("vi-VN")} đ
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
