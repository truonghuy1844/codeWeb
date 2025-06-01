import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AccountSidebar from './AccountSidebar';
import './OrderDetail.css';

const getOrderStatusText = (status) => {
  switch (status) {
    case 0: return "Chờ xác nhận";
    case 1: return "Chờ lấy hàng";
    case 2: return "Đang giao hàng";
    case 3: return "Hoàn thành";
    default: return "Không xác định";
  }
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5166/api/orders/${orderId}`)
      .then((res) => {
        const orderData = res.data;

        const totalPrice = orderData.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
        const shippingFee = totalPrice >= 500000 ? 0 : 30000;
        const totalPay = totalPrice + shippingFee;

        setOrder({
          ...orderData,
          shippingFee,
          totalPay,
        });
      })
      .catch((err) => {
        console.error('Lỗi khi tải chi tiết đơn hàng', err);
        alert("Không thể tải chi tiết đơn hàng");
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div style={{ padding: 20 }}>Đang tải dữ liệu đơn hàng...</div>;
  if (!order) return <div style={{ padding: 20 }}>Không tìm thấy đơn hàng.</div>;

  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh' }}>
      <h1 className="order-title-large">Chi tiết đơn hàng</h1>
      <div className="profile-container">
        <AccountSidebar />

        <div className="order-detail">
          {/* Trạng thái đơn hàng */}
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

          {/* Thông tin giao hàng */}
          <div className="order-card-detail">
            <h2 className="order-title">Thông tin giao hàng</h2>
            <p>
              <strong>Ngày nhận hàng dự kiến:</strong>{" "}
              {order.deliveryDate
                ? new Date(order.deliveryDate).toLocaleDateString('vi-VN')
                : new Date(new Date(order.orderDate).getTime() + 3 * 86400000).toLocaleDateString('vi-VN')}
            </p>
            <p><strong>Người nhận:</strong> {order.receiverName}</p>
            <p><strong>SĐT:</strong> {order.receiverPhone}</p>
            <p><strong>Địa chỉ nhận hàng:</strong> {order.deliveryAddress}</p>
            <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod || "Chưa cập nhật"}</p>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="order-card-detail">
            <h2 className="order-title">Danh sách sản phẩm</h2>
            {order.products.map((product, idx) => (
              <div className="product-item" key={idx}>
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

            <div className="fee-shipping">
              <p>Phí vận chuyển: {order.shippingFee.toLocaleString('vi-VN')} đ</p>
            </div>

            <div className="order-total">
              Tổng cộng: <strong>{order.totalPay.toLocaleString('vi-VN')} đ</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
