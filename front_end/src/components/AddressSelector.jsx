import React from 'react';
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from 'sub-vn';
import './AddressSelector.css';

const AddressSelector = ({ province, district, ward, street, onChange, disabled }) => {
  const handleChange = (e) => {
    onChange(e);
  };

  return (
    <div className="address-group">
      <div>
        <label>Tỉnh/ Thành phố</label>
        <select name="province" value={province} onChange={handleChange}  disabled={disabled}>
          <option value="">Chọn tỉnh</option>
          {getProvinces().map((p) => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Quận/ Huyện</label>
        <select name="district" value={district} onChange={handleChange} disabled={disabled}>
          <option value="">Chọn huyện</option>
          {province &&
            getDistrictsByProvinceCode(province).map((d) => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
        </select>
      </div>

      <div>
        <label>Xã/ Phường</label>
        <select name="ward" value={ward} onChange={handleChange} disabled={disabled}>
          <option value="">Chọn xã</option>
          {district &&
            getWardsByDistrictCode(district).map((w) => (
              <option key={w.code} value={w.code}>{w.name}</option>
            ))}
        </select>
      </div>

      <div>
        <label>Số nhà/ Đường</label>
        <input
          type="text"
          name="street"
          value={street}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AddressSelector;