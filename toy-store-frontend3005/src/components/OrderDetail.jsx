import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import AccountSidebar from './AccountSidebar';
import './OrderDetail.css';

const getOrderStatusText = (status) => {
  switch (status) {
    case 0: return "Chờ xác nhận";
    case 1: return "Chờ lấy hàng";
    case 2: return "Đang giao hàng";
    case 3: return "Hoàn thành";
    default: return "";
  }
};

const getOrderStatusClass = (status) => {
  switch (status) {
    case 0: return "waiting";
    case 1: return "ready";
    case 2: return "in-progress";
    case 3: return "completed";
    default: return "";
  }
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`/api/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error('Lỗi khi tải chi tiết đơn hàng', err));
  }, [orderId]);

  if (!order || !Array.isArray(order.products)) {
    return <div>Đang tải dữ liệu đơn hàng...</div>;
  }

  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh' }}>
      <h1 className="order-title-large">Chi tiết đơn hàng</h1>
      <div className="profile-container">
        <AccountSidebar />

        <div className="order-detail">

          {/* Card 1: Thanh trạng thái */}
          <div className="order-card-detail">
            <h2 className="order-title">Trạng thái đơn hàng</h2>
            <div className="order-progress-header">
              <div className="order-tracking">
                {[0, 1, 2, 3].map((step) => (
                  <div className={`track-step ${order.status >= step ? 'active' : ''} ${order.status === step ? 'current' : ''}`} key={step}>
                    <div className="circle" />
                    <div className="icon">
                      {step === 0 && <i className="fa fa-file-text" />}
                      {step === 1 && <i className="fa fa-cube" />}
                      {step === 2 && <i className="fa fa-truck" />}
                      {step === 3 && <i className="fa fa-heart" />}
                    </div>
                    <div className="label">
                      {step === 0 && "Đang xử lý"}
                      {step === 1 && "Chờ lấy hàng"}
                      {step === 2 && "Đang giao hàng"}
                      {step === 3 && "Đã nhận đơn hàng"}
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/orderHistory" className="back-to-history">Xem lịch sử mua hàng</Link>
            </div>
          </div>

          {/* Card 2: Thông tin giao hàng */}
          <div className="order-card-detail">
             <h2 className="order-title">Thông tin chi tiết</h2>
            <p>
                <strong>Ngày nhận hàng dự kiến:</strong>{" "}
                {order.deliveryDate
                ? new Date(order.deliveryDate).toLocaleDateString('vi-VN')
                : new Date(new Date(order.orderDate).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
            </p>

            <p><strong>Người nhận:</strong> {order.receiverName} -
            <strong> SĐT:</strong> {order.receiverPhone}</p>
            <p><strong>Địa chỉ nhận hàng:</strong> {order.deliveryAddress}</p>
            <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
          </div>

          {/* Card 3: Danh sách sản phẩm */}
          <div className="order-card-detail">
            <h2 className="order-title">Danh sách sản phẩm</h2>
            {order.products.map((product, index) => (
              <div className="product-item" key={index}>
                <img src={product.thumbnail} alt={product.productName} />
                <div className="product-info">
                  <h4>{product.productName}</h4>
                  <p className="description">{product.description}</p>
                  <div className="product-details">
                        <p>Số lượng: {product.quantity}</p>
                        <p>Giá: {product.price.toLocaleString("vi-VN")} đ</p>
                      </div>  
                </div>
              </div>
            ))}
            <div className ="fee-shipping">
              <p>Phí vận chuyển: {order.shippingFee.toLocaleString('vi-VN')} VND</p>
            </div>
              
            <div className="order-total">
              Tổng đơn hàng: <strong>{order.totalPay.toLocaleString('vi-VN')} VND</strong>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
