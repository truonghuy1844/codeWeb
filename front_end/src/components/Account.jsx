import React, { useState, useEffect } from 'react';
import './Account.css';
import axios from 'axios';
import AccountSidebar from './AccountSidebar';

const Account = () => {
  const [user, setUser] = useState({
    userId: '',
    name: '',
    birthday: '',
    address: '',
    phoneNumber: '',
    email: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;

    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5166/api/User/${userId}`);
        const data = res.data;
        setUser(prev => ({
          ...prev,
          userId,
          name: data.name || '',
          birthday: data.birthday || '',
          phoneNumber: data.phone || '',
          email: data.email || ''
        }));
      } catch (err) {
        console.error("Lỗi khi tải thông tin người dùng:", err);
      }
    };

    const fetchDefaultAddress = async () => {
      try {
        const res = await axios.get(`http://localhost:5166/api/Address/default/${userId}`);
        const { address } = res.data;
        setUser(prev => ({ ...prev, address })); 
      } catch (err) {
        setUser(prev => ({ ...prev, address: 'Chưa có địa chỉ mặc định' }));
      }
    };

    fetchUserInfo();
    fetchDefaultAddress();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const isOnlyDigits = /^\d*$/.test(value);
      if (!isOnlyDigits) {
        setPhoneError("Số điện thoại không hợp lệ");
      } else if (value.length > 10) {
        setPhoneError("Không vượt quá 10 số");
      } else if (value.length < 10) {
        setPhoneError("Số điện thoại phải có 10 số");
      } else {
        setPhoneError("");
      }
    }

    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (phoneError || !user.phoneNumber) {
      alert("Vui lòng sửa lỗi trước khi lưu.");
      return;
    }

    try {
      await axios.put(`http://localhost:5166/api/User/${userId}`, {
        name: user.name,
        birthday: user.birthday,
        phoneNumber: user.phoneNumber,
        address: user.address,
        email: user.email
      });

      alert("Cập nhật thành công!");
      setIsEditing(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err.response ? err.response.data : err.message);
      alert("Lỗi cập nhật!");
    }
};

  return (
    <div style={{ background: '#f8f8f8', minHeight: '80vh' }}>
      <h1 className="order-title-large">Thông tin cá nhân</h1>
      <div className="profile-container">
        <AccountSidebar />
        <div className="profile-main">
          <h2>Thông tin cá nhân</h2>
          <div className="form-group">
            <label>Mã tài khoản</label>
            <input value={user.userId} readOnly />
          </div>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              name="birthday"
              type="date"
              value={user.birthday?.substring(0, 10)}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ mặc định</label>
            <input name="address" value={user.address} readOnly />
            <div><a href="/Address" className="link-button">+ Thêm / Sửa địa chỉ</a></div>
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            {phoneError && <p className="error-message">{phoneError}</p>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={user.email} readOnly />
          </div>
          <div className="form-buttons">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
            ) : (
              <button onClick={handleSave}>Lưu</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
