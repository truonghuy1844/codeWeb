import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductCatalog.css'; // Tái sử dụng giao diện
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductHomePage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5228/api/product/filter');
        setProducts(res.data.data || []);
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err);
      }
    };

    fetchProducts();
  }, []);

  const calculateDiscount = (original, current) => {
    if (!original || !current || current >= original) return null;
    return Math.round(((original - current) / original) * 100);
  };

  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      toast.warn("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }

    const cartItem = {
      userId: user.userId,
      productId: product.productId,
      productName: product.name,
      quantity: 1,
      price: product.price2 && product.price2 < product.price1 ? product.price2 : product.price1,
      urlImage: product.urlImage1
    };

    axios.post('http://localhost:5228/api/cart/add', cartItem)
      .then(() => toast.success('Đã thêm vào giỏ hàng'))
      .catch(() => toast.error('Thêm vào giỏ hàng thất bại'));
  };

  const paginatedData = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="product-page" style={{ padding: '0' }}>
      <div className="content-area">
        <div className="product-list grid3">
          {paginatedData.map((p) => {
            const discounted = p.price2 && p.price2 < p.price1;
            const finalPrice = discounted ? p.price2 : p.price1;
            const discount = calculateDiscount(p.price1, p.price2);

            return (
              <div className="product-card" key={p.productId}>
                {discounted && <div className="badge">-{discount}%</div>}

                <div
                  className="image-wrap"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/products/${p.productId}`)}
                >
                  <img
                    src={p.urlImage1 || 'https://via.placeholder.com/150'}
                    alt={p.name}
                  />
                </div>

                <div className="info">
                  <h3
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/products/${p.productId}`)}
                  >
                    {p.name}
                  </h3>

                  <div className="price-wrapper">
                    <span className="product-price">
                      {finalPrice.toLocaleString('vi-VN')} ₫
                    </span>
                    {discounted && (
                      <span className="product-original">
                        {p.price1.toLocaleString('vi-VN')} ₫
                      </span>
                    )}
                  </div>

                  <button onClick={() => handleAddToCart(p)}>Thêm vào giỏ hàng</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ◀
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHomePage;
