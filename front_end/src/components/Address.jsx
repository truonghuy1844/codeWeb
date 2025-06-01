import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaStar, FaRegStar, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import AccountSidebar from './AccountSidebar';
import AddressForm from './AddressForm';
import './Address.css';

const Address = () => {
  const userId = localStorage.getItem("userId");
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = async () => {
    console.log("userId in Address.jsx:", userId);
    const res = await axios.get(`/api/Address/user/${userId}`);
    setAddresses(res.data);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isFormEnabled, setIsFormEnabled] = useState(false);

  const handleEdit = (addr) => {
  setEditingAddress(addr);
  setIsEditing(true);
  setIsFormEnabled(true); // bật form
};

const handleAddNew = () => {
  setEditingAddress(null);  // reset form
  setIsEditing(true);
  setIsFormEnabled(true); // bật form để nhập
};

const handleCancel = () => {
  setEditingAddress(null);
  setIsEditing(false);
  setIsFormEnabled(false);
};

// Khi click vào địa chỉ (chỉ xem)
const handleSelectAddress = (addr) => {
  setEditingAddress(addr);
  setIsEditing(false);
  setIsFormEnabled(false);
};

  // TỰ ĐỘNG HIỂN THỊ ĐỊA CHỈ MẶC ĐỊNH VÀO FORM
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.status);
      if (defaultAddr) {
        setEditingAddress(defaultAddr); // Nạp sẵn vào form
      }
    }
  }, [addresses]);

  useEffect(() => { if (userId) fetchAddresses(); }, [userId]);

  const handleSave = async (data) => {
  try {
    if (editingAddress) {
      await axios.put(`/api/Address/${userId}/${editingAddress.addressId}`, data);
    } else {
      await axios.post(`/api/Address/user/${userId}`, data);
    }
    setEditingAddress(null);
    fetchAddresses();
  } catch (error) {
    alert("Lỗi khi lưu địa chỉ.");
    console.error(error);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá địa chỉ này?")) return;
    try {
    await axios.delete(`/api/Address/${userId}/${id}`);
    fetchAddresses();
  } catch (err) {
    alert(err?.response?.data?.message || "Lỗi khi xoá địa chỉ.");
  }
  };

  const handleSetDefault = async (id) => {
    await axios.put(`/api/Address/set-default/${userId}/${id}`);
    fetchAddresses();
  };

  return (
  <div className="address-page">
    <Header />
    <h1 className="order-title-large">Địa chỉ</h1>
    <div className="address-wrapper">
      <div className="sidebar">
        <AccountSidebar />
      </div>

      <div className="address-main">

        <div className="saved-addresses">
          <h2>Địa chỉ giao hàng</h2>
          {addresses.length === 0 ? (
            <p>Chưa có địa chỉ nào.</p>
          ) : (
            addresses.map((addr) => {
            const isDefault = addr.status === 1 || addr.status === "1";

              return (
                <div
                  key={addr.addressId}
                  className="saved-address"
                  onClick={() => handleSelectAddress(addr)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <p>{`${addr.detail}, ${addr.street}, ${addr.ward}, ${addr.district}, ${addr.city}`}</p>
                    {isDefault && <span className="default-label">[Mặc định]</span>}
                  </div>
                  <div className="address-actions">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}>
                      <FaEdit />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(addr.addressId); }}>
                      <FaTrash />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(addr.addressId);
                      }}
                      className={`star-button ${isDefault ? 'active' : ''}`}
                      title={isDefault ? "Địa chỉ mặc định" : "Đặt làm mặc định"}
                    >
                      {isDefault ? <FaStar /> : <FaRegStar />}
                    </button>
                  </div>
                </div>
              );
            })
          )}

          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleAddNew} className="add-address-button"><FaPlus /> Thêm địa chỉ</button>
          </div>
        </div>

        <AddressForm
          initialData={editingAddress}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={isEditing}
          isEnabled={isFormEnabled}
        />
      </div>
    </div>

    <Footer />
  </div>
);

};

export default Address;
