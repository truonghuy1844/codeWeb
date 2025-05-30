import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AccountSidebar from '../components/AccountSidebar';
import './OrderHistory.css';
import { FaShoppingCart } from 'react-icons/fa';


const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [buyerId, setBuyerId] = useState(null);

  {/*Sửa*/}
  const getStatusLabel = (status) => {
switch (status) {
case 0: return "Chờ xác nhận";
case 1: return "Chờ lấy hàng";
case 2: return "Đang giao hàng";
case 3: return "Hoàn thành";
  }
};
const getStatusClass = (status) => {
switch (status) {
case 0: return "waiting";
case 1: return "ready";
case 2: return "in-progress";
case 3: return "completed";
  }

};
{/*tới đây*/}

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (!storedId) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    setBuyerId(storedId);

    axios
      .get(`/api/Orders?buyerId=${storedId}`)
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Lỗi khi lấy đơn hàng", err);
        alert("Không thể tải lịch sử mua hàng.");
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
              <div className="order-card" key={order.orderId} onClick={() => window.location.href = `/order-detail/${order.orderId}`}>
                <div className="order-header">
                  <div>
                    <strong>Mã đơn hàng: </strong><span className="order-id">{order.orderId}</span>- 
                    Ngày đặt: {new Date(order.dateCreated).toLocaleDateString("vi-VN")}
                  </div>
                  {/* đây cũng sửa*/}
                  <div className={`order-status ${getStatusClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </div>
                </div>
                  {/*Sửa*/}
                {order.products.length > 0 && (
                  <div className="product-item">
                    <img src={order.products[0].thumbnail} alt={order.products[0].productName} />
                    <div className="product-info"><h4>{order.products[0].productName}</h4>
                      <div className="product-details">
                        <p>Số lượng: {order.products[0].quantity}</p>
                        <p>Giá: {order.products[0].price.toLocaleString("vi-VN")} đ</p>
                      </div>
                      <p className="description">{order.products[0].description}</p>
                    </div>
                  </div>
              )}

              {order.products.length > 1 && (
                <p style={{ fontSize: "0.85rem", color: "#999" }}>
                  Và {order.products.length - 1} sản phẩm khác...
                </p>
              )}
              {/*tới đây nè*/}
                <div className="order-total">
                  Tổng tiền: <strong>{order.totalPrice?.toLocaleString("vi-VN")} đ</strong>
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