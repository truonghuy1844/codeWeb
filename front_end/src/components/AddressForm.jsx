import React, { useState, useEffect } from 'react';
import AddressSelector from './AddressSelector';
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from 'sub-vn';
import './Address.css';

const AddressForm = ({ initialData = {}, onSave, onCancel, isEditing, isEnabled }) => {

  const [form, setForm] = useState({
    province: '',
    district: '',
    ward: '',
    street: '',
    detail: '',
    isDefault: false,
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!form.province || !form.district || !form.ward) {
      alert("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    const provinceName = getProvinces().find(p => p.code === form.province)?.name || '';
    const districtName = getDistrictsByProvinceCode(form.province).find(d => d.code === form.district)?.name || '';
    const wardName = getWardsByDistrictCode(form.district).find(w => w.code === form.ward)?.name || '';

     const payload = {
      city: provinceName,
      district: districtName,
      ward: wardName,
      street: form.street?.trim(),
      detail: form.detail?.trim() || '',
      status: form.isDefault ? true : false, // Đặt địa chỉ mặc định
    };

    onSave(payload);
  };

  useEffect(() => {
  if (!initialData) {
    // Reset form khi thêm mới
    setForm({
      province: '',
      district: '',
      ward: '',
      street: '',
      detail: '',
      isDefault: false
    });
    return;
  }

  // Trường hợp sửa địa chỉ
  const provinceCode = getProvinces().find(p => p.name === initialData.city)?.code || '';
  const districtCode = getDistrictsByProvinceCode(provinceCode).find(d => d.name === initialData.district)?.code || '';
  const wardCode = getWardsByDistrictCode(districtCode).find(w => w.name === initialData.ward)?.code || '';

  setForm({
    province: provinceCode,
    district: districtCode,
    ward: wardCode,
    street: initialData.street || '',
    detail: initialData.detail || '',
    isDefault: initialData.status || false
  });
}, [initialData]);

  return (
      <form onSubmit={handleSubmit} className="address-form">
      <h2>{initialData?.addressId ? 'Sửa địa chỉ' : 'Thêm địa chỉ giao hàng'}</h2>


     <AddressSelector
        province={form.province}
        district={form.district}
        ward={form.ward}
        street={form.street}
        detail={form.detail}
        onChange={handleChange}
        disabled={!isEnabled}
      />

      <div className="form-group">
            <label htmlFor="detail">Chi tiết (ví dụ: tòa nhà, căn hộ, tầng,...)</label>
            <input
              type="text"
              id="detail"
              name="detail"
              value={form.detail || ''}
              onChange={handleChange}
              placeholder="Chi tiết địa chỉ"
              disabled={!isEnabled}  // vẫn vô hiệu hoá khi chưa bật form
            />
          </div>
      
      {isEnabled && (
        <>
          <div className="address-form-buttons">
            <button type="submit">Lưu</button>
            {initialData?.addressId && (
              <button onClick={onCancel} type="button">Huỷ</button>
            )}
          </div>
        </>
      )}
    </form>
  );
};
export default AddressForm;
