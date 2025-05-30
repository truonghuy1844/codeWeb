import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddressSelector from './AddressSelector';
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from 'sub-vn';
import './RegisterForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    phone: '',
    email: '',
    province: '',
    district: '',
    ward: '',
    street: '',
    detail: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const isOnlyDigits = /^\d*$/.test(value);
      if (!isOnlyDigits) {
        setPhoneError('Số điện thoại không hợp lệ.');
      } else if (value.length > 10) {
        setPhoneError('Số điện thoại không được vượt quá 10 chữ số.');
      } else {
        setPhoneError('');
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    const provinceName = getProvinces().find(p => p.code === formData.province)?.name || '';
    const districtName = getDistrictsByProvinceCode(formData.province).find(d => d.code === formData.district)?.name || '';
    const wardName = getWardsByDistrictCode(formData.district).find(w => w.code === formData.ward)?.name || '';

    const fullAddress = `${formData.street}, ${wardName}, ${districtName}, ${provinceName}`;

    const payload = {
      name: formData.name,
      birthday: formData.dob,
      phoneNumber: formData.phone,
      email: formData.email,
      password: formData.password,
      city: provinceName,
      district: districtName,
      ward: wardName,
      street: formData.street,
      detail: formData.detail,
      address: fullAddress
    };

    try {
      const response = await axios.post('http://localhost:5228/api/User/register', payload);
      alert('Đăng ký thành công!');
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      const backendData = error.response?.data;

      if (backendData?.errors) {
        setErrors(backendData.errors);
        const allErrors = Object.values(backendData.errors).flat().join('\n');
        alert(allErrors);
      } else if (backendData?.message) {
        setErrors({ general: backendData.message });
        alert(backendData.message);
      } else {
        const fallback = "Đăng ký thất bại!";
        setErrors({ general: fallback });
        alert(fallback);
      }
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Đăng ký</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div>
          <label>Tên</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} autoComplete="off" />
          {errors.name && <p className="error-text">{errors.name[0]}</p>}
        </div>

        <div>
          <label>Ngày sinh</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} autoComplete="off" />
        </div>

        <div>
          <label>Số điện thoại</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} autoComplete="off" />
          {phoneError && <p style={{ color: 'red', fontSize: '13px' }}>{phoneError}</p>}
        </div>

        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="off" />
        </div>

        <AddressSelector
          province={formData.province}
          district={formData.district}
          ward={formData.ward}
          street={formData.street}
          onChange={handleChange}
        />

        <div>
          <label>Chi tiết địa chỉ (Toà nhà, căn hộ, tầng...)</label>
          <input type="text" name="detail" value={formData.detail} onChange={handleChange} autoComplete="off" />
        </div>

        <div className="password-group">
          <div>
            <label>Mật khẩu</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div>
            <label>Nhập lại mật khẩu</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn">Đăng ký</button>
      </form>
    </div>
  );
};

export default RegisterForm;
