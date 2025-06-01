import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaStar, FaRegStar, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import AccountSidebar from './AccountSidebar';
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from 'sub-vn';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Address.css';

const Address = () => {
  const userId = localStorage.getItem("userId");
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormEnabled, setIsFormEnabled] = useState(false);

  const baseURL = 'http://localhost:5166/api/Address';

  const fetchAddresses = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${baseURL}/user/${userId}`);
      setAddresses(res.data);
    } catch (err) {
      toast.error('Lỗi khi tải địa chỉ.');
      console.error('Lỗi khi tải địa chỉ:', err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setIsEditing(true);
    setIsFormEnabled(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsEditing(true);
    setIsFormEnabled(true);
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setIsEditing(false);
    setIsFormEnabled(false);
  };

  const handleSave = async (data) => {
    try {
      if (editingAddress) {
        await axios.put(`${baseURL}/${userId}/${editingAddress.addressId}`, data);
        toast.success("Cập nhật địa chỉ thành công.");
      } else {
        await axios.post(`${baseURL}/user/${userId}`, data);
        toast.success("Thêm địa chỉ thành công.");
      }
      setEditingAddress(null);
      fetchAddresses();
    } catch (error) {
      toast.error("Lỗi khi lưu địa chỉ.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá địa chỉ này?")) return;
    try {
      await axios.delete(`${baseURL}/${userId}/${id}`);
      toast.success("Đã xoá địa chỉ.");
      fetchAddresses();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi khi xoá địa chỉ.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axios.put(`${baseURL}/set-default/${userId}/${id}`);
      toast.success("Đặt mặc định thành công.");
      fetchAddresses();
    } catch (err) {
      toast.error("Lỗi khi đặt địa chỉ mặc định.");
    }
  };

  const AddressForm = ({ initialData = {} }) => {
    const [form, setForm] = useState({
      province: '',
      district: '',
      ward: '',
      street: '',
      detail: '',
      isDefault: false,
      ...initialData,
    });

    useEffect(() => {
      if (!initialData) return;

      const provinceCode = getProvinces().find(p => p.name === initialData.city)?.code || '';
      const districtCode = getDistrictsByProvinceCode(provinceCode).find(d => d.name === initialData.district)?.code || '';
      const wardCode = getWardsByDistrictCode(districtCode).find(w => w.name === initialData.ward)?.code || '';

      setForm({
        province: provinceCode,
        district: districtCode,
        ward: wardCode,
        street: initialData.street || '',
        detail: initialData.detail || '',
        isDefault: initialData.status || false,
      });
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!form.province || !form.district || !form.ward) {
        toast.warning("Vui lòng chọn đầy đủ thông tin");
        return;
      }

      const provinceName = getProvinces().find(p => p.code === form.province)?.name || '';
      const districtName = getDistrictsByProvinceCode(form.province).find(d => d.code === form.district)?.name || '';
      const wardName = getWardsByDistrictCode(form.district).find(w => w.code === form.ward)?.name || '';

      const payload = {
        city: provinceName,
        district: districtName,
        ward: wardName,
        street: form.street.trim(),
        detail: form.detail.trim(),
        status: form.isDefault,
      };

      handleSave(payload);
    };

    return (
      <form onSubmit={handleSubmit} className="address-form">
        <h2>{initialData?.addressId ? 'Sửa địa chỉ' : 'Thêm địa chỉ giao hàng'}</h2>
        <div className="address-group">
          <label>Tỉnh/Thành phố</label>
          <select name="province" value={form.province} onChange={handleChange} disabled={!isFormEnabled}>
            <option value="">Chọn tỉnh</option>
            {getProvinces().map(p => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>

          <label>Quận/Huyện</label>
          <select name="district" value={form.district} onChange={handleChange} disabled={!isFormEnabled}>
            <option value="">Chọn huyện</option>
            {getDistrictsByProvinceCode(form.province).map(d => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>

          <label>Xã/Phường</label>
          <select name="ward" value={form.ward} onChange={handleChange} disabled={!isFormEnabled}>
            <option value="">Chọn xã</option>
            {getWardsByDistrictCode(form.district).map(w => (
              <option key={w.code} value={w.code}>{w.name}</option>
            ))}
          </select>

          <label>Đường/Thôn</label>
          <input name="street" value={form.street} onChange={handleChange} disabled={!isFormEnabled} />

          <label>Chi tiết</label>
          <input name="detail" value={form.detail} onChange={handleChange} disabled={!isFormEnabled} />
        </div>

        {isFormEnabled && (
          <div className="address-form-buttons">
            <button type="submit">Lưu</button>
            {initialData?.addressId && <button onClick={handleCancel} type="button">Huỷ</button>}
          </div>
        )}
      </form>
    );
  };

  return (
    <div className="address-page">
      <h1 className="order-title-large">Địa chỉ</h1>
      <div className="profile-container">
        <AccountSidebar />
        <div className="address-main">
          <div className="saved-addresses">
            <h2>Địa chỉ giao hàng</h2>
            {addresses.length === 0 ? (
              <p>Chưa có địa chỉ nào.</p>
            ) : (
              addresses.map((addr) => {
                const isDefault = addr.status === true;
                return (
                  <div
                    key={addr.addressId}
                    className="saved-address"
                    onClick={() => setEditingAddress(addr)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <p>{`${addr.detail}, ${addr.street}, ${addr.ward}, ${addr.district}, ${addr.city}`}</p>
                      {isDefault && <span className="default-label">[Mặc định]</span>}
                    </div>
                    <div className="address-actions">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}><FaEdit /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(addr.addressId); }}><FaTrash /></button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSetDefault(addr.addressId); }}
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
          <AddressForm initialData={editingAddress} />
        </div>
      </div>
    </div>
  );
};

export default Address;