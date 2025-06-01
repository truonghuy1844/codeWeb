import React, { useState, useEffect } from 'react';
import './ProductFilter.css';
import axios from 'axios';

const ProductFilter = ({ onCategoryChange, onPriceChange, onResetAll }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [range, setRange] = useState({ min: 0, max: 5000000 });

  useEffect(() => {
    axios.get('http://localhost:5166/api/category')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Lỗi khi tải danh mục:', err));
  }, []);

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    onCategoryChange(catName);
  };

  const handleRangeChange = (type, value) => {
    setRange(prev => ({ ...prev, [type]: parseInt(value) }));
  };

  const applyPriceFilter = () => {
    onPriceChange('min', range.min);
    onPriceChange('max', range.max);
  };

  const resetAll = () => {
    setSelectedCategory('');
    setRange({ min: 0, max: 5000000 });

    onResetAll(); // ✅ gọi hàm reset bên trên
  };

  return (
    <div className="filter-container">
      <div className="filter-section">
        <label>Danh mục sản phẩm</label>
        <ul className="category-list">
          <li className={selectedCategory === '' ? 'active' : ''} onClick={() => handleCategoryClick('')}>
            Tất cả
          </li>
          {categories.map((cat) => (
            <li
              key={cat.categoryId}
              className={selectedCategory === cat.categoryName ? 'active' : ''}
              onClick={() => handleCategoryClick(cat.categoryName)}
            >
              {cat.categoryName}
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <label>Lọc theo giá:</label>
        <div className="range-labels">
          <span>{range.min.toLocaleString('vi-VN')} ₫</span>
          <span>{range.max.toLocaleString('vi-VN')} ₫</span>
        </div>

        <input
          type="range"
          min="0"
          max="5000000"
          step="10000"
          value={range.min}
          onChange={(e) => handleRangeChange('min', e.target.value)}
        />
        <input
          type="range"
          min="0"
          max="5000000"
          step="10000"
          value={range.max}
          onChange={(e) => handleRangeChange('max', e.target.value)}
        />

        <div className="button-group">
          <button className="apply-btn" onClick={applyPriceFilter}>Áp dụng</button>
          <button className="reset-btn" onClick={resetAll}>Đặt lại</button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
