import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HighlightList.css';

const HighlightList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5166/api/product/highlight')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Lỗi sản phẩm nổi bật:', err));
  }, []);

  return (
    <div className="highlight-list">
      <h3>Sản phẩm phổ biến</h3>
      {products.slice(0, 3).map((p) => (
        <div
          className="highlight-item"
          key={p.productId}
          onClick={() => navigate(`/products/${p.productId}`)}
        >
          <div className="image-wrapper">
            <img
              src={p.urlImage1 || 'https://via.placeholder.com/60'}
              alt={p.name}
            />
          </div>
          <div className="info">
            <div className="name">{p.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HighlightList;
