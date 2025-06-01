import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5166/api/User/login', formData);
    const user = response.data;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userId", user.userId);
    window.dispatchEvent(new Event("userLogin"));
    
    if (user.isAdmin === 1 || user.isAdmin === true) {
      navigate('/admin');
    } else {
      navigate('/');
    }
    window.location.reload();
  } catch (error) {
    const message = error?.response?.data?.message || 'Đăng nhập thất bại!';
    alert(message);
  }
};


  return (
    <div className="login-container">
      <h2 className="login-title">Đăng nhập</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>

        <div className="password-input-wrapper">
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
            <span 
              className="password-toggle-icon" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>

        <button type="submit" className="login-button">Đăng nhập</button>
      </form>

      <div className="register-link-wrapper">
        Chưa có tài khoản? <Link to="/register" className="register-link">Đăng ký</Link>
      </div>
    </div>
  );
};

export default LoginForm;
