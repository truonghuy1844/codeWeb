import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressId, setAddressId] = useState('');
  const [note, setNote] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isBuyNow = new URLSearchParams(window.location.search).get('mode') === 'buynow';

  useEffect(() => {
    if (!user?.userId) return;

    // Lấy thông tin người dùng
    axios.get(`http://localhost:5166/api/User/${user.userId}`)
      .then(res => {
        setName(res.data.name || '');
        setPhone(res.data.phone || '');
      })
      .catch(err => console.error('Lỗi lấy thông tin user:', err));

    // Lấy địa chỉ mặc định
    axios.get(`http://localhost:5166/api/Address/default/${user.userId}`)
      .then(res => {
        setAddress(res.data.address || '');
        setAddressId(res.data.addressId || '');
      })
      .catch(err => {
        console.error('Không tìm thấy địa chỉ mặc định:', err);
        alert('Không tìm thấy địa chỉ mặc định.');
      });

    // Lấy sản phẩm
    if (isBuyNow) {
      const product = JSON.parse(sessionStorage.getItem('buynowProduct'));
      if (product) setItems([product]);
    } else {
      axios.get(`http://localhost:5166/api/Cart?userId=${user.userId}`)
        .then(res => setItems(res.data))
        .catch(err => console.error('Lỗi lấy giỏ hàng:', err));
    }
  }, []);

  useEffect(() => {
    let totalPrice = 0;
    let totalDiscount = 0;

    items.forEach(item => {
      const price1 = item.price1 || item.price;
      const price2 = item.price2 && item.price2 < price1 ? item.price2 : price1;
      totalPrice += price2 * item.quantity;
      totalDiscount += (price1 - price2) * item.quantity;
    });

    setTotal(totalPrice);
    setDiscount(totalDiscount);
  }, [items]);

  const shippingFee = total < 500000 ? 30000 : 0;
  const finalAmount = total + shippingFee;

  const handleConfirm = async () => {
    if (!user?.userId) return alert('Vui lòng đăng nhập.');
    if (!addressId) return alert('Không tìm thấy địa chỉ mặc định.');

    const payload = {
      orderId: `od_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`,
      buyer: user.userId,
      seller: 5,
      description: note || '',
      addressId: addressId,
      status: 0, 
      items: items.map(item => {
        const price1 = item.price1 || item.price;
        const price2 = item.price2 && item.price2 < price1 ? item.price2 : price1;

        return {
          productId: item.productId,
          quantity: item.quantity,
          cost: item.cost || 0,
          price: price2,
          price1: price1,
          price2: item.price2 || 0
        };
      })
    };

    try {
      await axios.post('http://localhost:5166/api/Orders/create', payload);
      alert('Đặt hàng thành công!');
      if (!isBuyNow) {
        await axios.delete(`http://localhost:5166/api/Cart/clear?userId=${user.userId}`);
      }
      navigate('/');
    } catch (err) {
      console.error('Lỗi gửi đơn hàng:', err.response?.data || err.message);
      alert('Đặt hàng thất bại!');
    }
  };

  return (
    <div className="checkout-page">
      <h2>Thanh toán</h2>
      <div className="checkout-container">
        <div className="left">
          <div className="address-option">
            <label style={{ fontSize: '18px', fontWeight: 600 }}>
              📍 Giao hàng đến địa chỉ mặc định
            </label>
          </div>

          <input placeholder="Họ và tên" value={name} readOnly />
          <input placeholder="Số điện thoại" value={phone} readOnly />
          <input placeholder="Địa chỉ giao hàng" value={address} readOnly />
          <textarea
            placeholder="Ghi chú (tuỳ chọn)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>

        <div className="right">
          {items.map((item) => (
            <div className="checkout-item" key={item.productId}>
              <img src={item.urlImage} alt={item.productName} />
              <div>
                <div>{item.productName}</div>
                <div>
                  {item.quantity} x{' '}
                  {item.price2 && item.price2 < item.price1 ? (
                    <>
                      <span className="price-discounted">{item.price2.toLocaleString()}₫</span>
                      <span className="price-original" style={{ textDecoration: 'line-through', marginLeft: 5 }}>
                        {item.price1.toLocaleString()}₫
                      </span>
                    </>
                  ) : (
                    <span>{item.price.toLocaleString()}₫</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="summary">
            <p><span>Tạm tính</span><span>{total.toLocaleString()} ₫</span></p>
            <p><span>Tiết kiệm</span><span>{discount.toLocaleString()} ₫</span></p>
            <p><span>Phí vận chuyển</span><span>{shippingFee.toLocaleString()} ₫</span></p>
            <h3><span>Tổng cộng</span><span>{finalAmount.toLocaleString()} ₫</span></h3>
          </div>

          <button className="confirm-btn" onClick={handleConfirm}>Xác nhận thanh toán</button>
          <button className="continue-btn" onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
