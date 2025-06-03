import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaStar, FaRegStar, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import AccountSidebar from './AccountSidebar';
import AddressForm from './AddressForm';
import { useLocation } from 'react-router-dom';
import './Address.css';

const Address = () => {
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const userInfo = location.state || {};

  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Lấy danh sách địa chỉ
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`http://localhost:5166/api/Address/user/${userId}`);
      setAddresses(res.data);
    } catch (error) {
      alert("Lỗi khi tải địa chỉ.");
      console.error(error);
    }
  };

  // Gọi khi vừa vào hoặc khi userId thay đổi
  useEffect(() => {
    if (userId) fetchAddresses();
  }, [userId]);

  // Tự động chọn địa chỉ mặc định nếu chưa chọn và không đang thêm mới
  useEffect(() => {
    if (addresses.length > 0 && !editingAddress && !isAddingNew) {
      const defaultAddr = addresses.find(a => a.status === true || a.status === 1 || a.status === "1");
      if (defaultAddr) setEditingAddress(defaultAddr);
    }
  }, [addresses, editingAddress, isAddingNew]);

  // Thêm mới địa chỉ
  const handleAddNew = () => {
    setEditingAddress(null);
    setIsEditing(true);
    setIsFormEnabled(true);
    setIsAddingNew(true);
  };

  // Sửa địa chỉ
  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setIsEditing(true);
    setIsFormEnabled(true);
  };

  // Hủy form
  const handleCancel = () => {
    setEditingAddress(null);
    setIsEditing(false);
    setIsFormEnabled(false);
    setIsAddingNew(false);
  };

  // Lưu địa chỉ
  const handleSave = async (data) => {
    try {
      if (editingAddress) {
        await axios.put(`http://localhost:5166/api/Address/${userId}/${editingAddress.addressId}`, data);
      } else {
        await axios.post(`http://localhost:5166/api/Address/user/${userId}`, data);
      }

      setEditingAddress(null);
      setIsEditing(false);
      setIsFormEnabled(false);
      setIsAddingNew(false);
      fetchAddresses();

      if (location.state?.fromAccount) window.history.back();
    } catch (error) {
      alert("Lỗi khi lưu địa chỉ.");
      console.error(error);
    }
  };

  // Xoá địa chỉ
  const handleDelete = async (addr) => {
    const isDefault = addr.status === true || addr.status === 1 || addr.status === "1";
    if (isDefault) return alert("Không thể xoá địa chỉ mặc định!");

    if (!window.confirm("Bạn có chắc muốn xoá địa chỉ này?")) return;

    try {
      await axios.delete(`http://localhost:5166/api/Address/${userId}/${addr.addressId}`);
      fetchAddresses();
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi khi xoá địa chỉ.");
      console.error(err);
    }
  };

  // Đặt làm mặc định
  const handleSetDefault = async (addressId) => {
    try {
      await axios.put(`http://localhost:5166/api/Address/set-default/${userId}/${addressId}`);
      fetchAddresses();
    } catch (error) {
      alert("Lỗi khi đặt địa chỉ mặc định.");
      console.error(error);
    }
  };

  // Chọn địa chỉ để xem
  const handleSelectAddress = (addr) => {
    setEditingAddress(addr);
    setIsEditing(false);
    setIsFormEnabled(false);
  };

  return (
    <div className="address-page">
      <h1 className="order-title-large">Địa chỉ</h1>
      <div className="profile-container">
        <AccountSidebar />
        <div className="profile-main">
          <div className="saved-addresses">
            <h2>Địa chỉ giao hàng</h2>
            {addresses.length === 0 ? (
              <p>Chưa có địa chỉ nào.</p>
            ) : (
              addresses.map((addr) => {
                const isDefault = addr.status === true || addr.status === 1 || addr.status === "1";

                return (
                  <div
                    key={addr.addressId}
                    className="saved-address"
                    onClick={() => handleSelectAddress(addr)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="address-text">
                      <p>{`${addr.detail}, ${addr.street}, ${addr.ward}, ${addr.district}, ${addr.city}`}</p>
                      {isDefault && <div className="default-label">Mặc định</div>}
                    </div>
                    <div className="address-actions">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}>
                        <FaEdit />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(addr); }}>
                        <FaTrash />
                      </button>
                      <button
                        className={`star-button ${isDefault ? 'active' : ''}`}
                        title="Đặt làm mặc định"
                        onClick={(e) => { e.stopPropagation(); if (!isDefault) handleSetDefault(addr.addressId); }}
                      >
                        {isDefault ? <FaStar /> : <FaRegStar />}
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            <div style={{ marginTop: '1rem' }}>
              <button onClick={handleAddNew} className="add-address-button">
                <FaPlus /> Thêm địa chỉ
              </button>
            </div>
          </div>

          <AddressForm
            initialData={editingAddress ? { ...editingAddress } : null}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={isEditing}
            isEnabled={isFormEnabled}
            userInfo={userInfo}
          />
        </div>
      </div>
    </div>
  );
};

export default Address;
