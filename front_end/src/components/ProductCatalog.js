import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductCatalog.css';
import ProductFilter from './ProductFilter';
import HighlightList from './HighlightList';
import { toast } from 'react-toastify';

const ProductCatalog = ({ onAddToCartPopup }) => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState({ min: 0, max: Infinity });
  const [viewMode, setViewMode] = useState('grid3');
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const keyword = query.get("keyword");

  const getItemsPerPage = () => viewMode === 'grid2' ? 6 : 9;

  const resetAllFilters = () => {
    setCategory('');
    setPrice({ min: 0, max: Infinity });
    setSort('');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let productList = [];

        if (keyword) {
          const res = await axios.get('http://localhost:5166/api/product/search', {
            params: { keyword }
          });
          productList = res.data;
        } else {
          const params = {
            categoryName: category || undefined,
          };
          const res = await axios.get('http://localhost:5166/api/product/filter', { params });
          productList = res.data.data;
        }

        productList = productList.map(p => ({
          ...p,
          effectivePrice: (p.price2 && p.price2 < p.price1) ? p.price2 : p.price1
        }));

        productList = productList.filter(p =>
          p.effectivePrice >= price.min && p.effectivePrice <= price.max
        );

        if (sort === 'price_asc') {
          productList.sort((a, b) => a.effectivePrice - b.effectivePrice);
        } else if (sort === 'price_desc') {
          productList.sort((a, b) => b.effectivePrice - a.effectivePrice);
        } else if (sort === 'name_asc') {
          productList.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'name_desc') {
          productList.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sort === 'discount') {
          productList = productList
            .filter(p => p.price2 && p.price2 < p.price1)
            .sort((a, b) => {
              const discountA = (a.price1 - a.price2) / a.price1;
              const discountB = (b.price1 - b.price2) / b.price1;
              return discountB - discountA;
            });
        }

        setProducts(productList);
        setCurrentPage(1);
      } catch (err) {
        console.error('❌ Lỗi khi gọi API:', err);
        toast.error('Không thể tải danh sách sản phẩm');
      }
    };

    fetchProducts();
  }, [category, price, sort, keyword]);

  const paginatedData = products.slice(
    (currentPage - 1) * getItemsPerPage(),
    currentPage * getItemsPerPage()
  );

  const totalPages = Math.ceil(products.length / getItemsPerPage());

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
      price: product.effectivePrice,
      urlImage: product.urlImage1,
    };

    axios
      .post('http://localhost:5166/api/cart/add', cartItem)
      .then((res) => {
        toast.success(res.data.message || 'Đã thêm vào giỏ hàng');
        if (onAddToCartPopup) onAddToCartPopup();
      })
      .catch((err) => {
        console.error('Lỗi thêm giỏ hàng:', err);
        toast.error('Thêm vào giỏ hàng thất bại!');
      });
  };

  const calculateDiscount = (original, current) => {
    if (!original || !current || current >= original) return null;
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="product-page">
      <div className="sidebar1">
        <ProductFilter
          onCategoryChange={setCategory}
          onPriceChange={(type, value) =>
            setPrice(prev => ({ ...prev, [type]: value }))
          }
          onResetAll={resetAllFilters}
        />
        <HighlightList />
      </div>

      <div className="content-area">
        <div className="top-controls">
          <div className="sort-options">
            <label>Sắp xếp theo:</label>
            <select onChange={(e) => setSort(e.target.value)} value={sort}>
              <option value="">Mặc định</option>
              <option value="name_asc">Tên sản phẩm A - Z</option>
              <option value="name_desc">Tên sản phẩm Z - A</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="discount">Hàng khuyến mãi</option>
            </select>
          </div>

          <div className="view-mode-toggle">
            <label>Kiểu xem</label>
            <button
              onClick={() => setViewMode('grid3')}
              title="Lưới 3"
              className={viewMode === 'grid3' ? 'active' : ''}
            >▦</button>
            <button
              onClick={() => setViewMode('grid2')}
              title="Lưới 2"
              className={viewMode === 'grid2' ? 'active' : ''}
            >◪</button>
          </div>
        </div>

        <div className={`product-list ${viewMode}`}>
          {paginatedData.map((p) => (
            <div className="product-card" key={p.productId}>
              {p.price2 && p.price2 < p.price1 && (
                <div className="badge">-{calculateDiscount(p.price1, p.price2)}%</div>
              )}
              <div className="image-wrap" onClick={() => navigate(`/products/${p.productId}`)}>
                <img src={p.urlImage1 || 'https://via.placeholder.com/150'} alt={p.name} />
              </div>
              <div className="info">
                <h3 onClick={() => navigate(`/products/${p.productId}`)} style={{ cursor: 'pointer' }}>
                  {p.name}
                </h3>
                <div className="price-wrapper">
                  <span className="product-price">
                    {p.effectivePrice.toLocaleString('vi-VN')} ₫
                  </span>
                  {p.price2 && p.price2 < p.price1 && (
                    <span className="product-original">
                      {p.price1.toLocaleString('vi-VN')} ₫
                    </span>
                  )}
                </div>
                <button onClick={() => handleAddToCart(p)}>Thêm vào giỏ hàng</button>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>◀</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >{i + 1}</button>
          ))}
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>▶</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
