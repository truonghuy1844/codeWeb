import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const { keyword } = queryString.parse(location.search);

  useEffect(() => {
    const fetchData = async () => {
      const url = keyword
        ? `http://localhost:5166/api/product/search?keyword=${encodeURIComponent(keyword)}`
        : `http://localhost:5166/api/product`;

      console.log("🔍 Đang gọi API:", url);

      try {
        const res = await axios.get(url);
        console.log("✅ Dữ liệu trả về:", res.data);
        setProducts(res.data.data || res.data);
      } catch (err) {
        console.error("❌ Lỗi khi gọi API:", err);
      }
    };

    fetchData();
  }, [keyword]);

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <p>Không có sản phẩm nào.</p>
      ) : (
        products.map((p) => (
          <div className="product-card" key={p.productId}>
            <img src={p.urlImage1 || 'https://via.placeholder.com/150'} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.price1?.toLocaleString('vi-VN')} ₫</p>
            <button onClick={() => alert("Thêm vào giỏ: " + p.name)}>🛒 Mua hàng</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
