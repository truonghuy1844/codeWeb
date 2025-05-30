import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';
import { toast } from 'react-toastify';

const ProductDetail = ({ onAddToCartPopup }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5228/api/product/${id}`)
      .then(res => {
        setProduct(res.data);
        setMainImage(res.data.urlImage1);
      })
      .catch(err => console.error("API Error:", err));
  }, [id]);

  const getFinalPrice = () => {
    return product?.price2 && product.price2 < product.price1
      ? product.price2
      : product.price1;
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.warning("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }

    const item = {
      userId: user.userId,
      productId: product.productId,
      productName: product.name,
      quantity,
      price: getFinalPrice(),
      urlImage: mainImage
    };

    const stored = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existing = stored.find(p => p.productId === item.productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      stored.push(item);
    }
    localStorage.setItem('cartItems', JSON.stringify(stored));

    try {
      await axios.post('http://localhost:5228/api/Cart/add', item);
    } catch (err) {
      console.error('API lưu giỏ hàng thất bại:', err);
    }

    toast.success('Đã thêm vào giỏ hàng');
    onAddToCartPopup?.();
  };

  const handleBuyNow = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }

    const selectedProduct = {
      productId: product.productId,
      productName: product.name,
      quantity,
      price: getFinalPrice(),
      urlImage: mainImage
    };

    sessionStorage.setItem('buynowProduct', JSON.stringify(selectedProduct));
    navigate('/checkout?mode=buynow');
  };

  if (!product) return <p>Đang tải sản phẩm...</p>;

  return (
    <div className="product-detail">
      <div className="left">
        <img src={mainImage} alt={product.name} className="main-image" />
        <div className="thumbnails">
          {[product.urlImage1, product.urlImage2, product.urlImage3].map(
            (img, idx) =>
              img && (
                <img
                  key={idx}
                  src={img}
                  className={`thumb-image ${mainImage === img ? 'active' : ''}`}
                  onClick={() => setMainImage(img)}
                  alt="thumb"
                />
              )
          )}
        </div>
      </div>

      <div className="right">
        <h2 className="product-title">{product.name}</h2>
        <p className="brand">THƯƠNG HIỆU: {product.brandName}</p>

        <div className="price">
          {product.price2 && product.price2 < product.price1 ? (
            <>
              <span className="product-price">
                {product.price2.toLocaleString('vi-VN')} ₫
              </span>
              <span className="product-original">
                {product.price1.toLocaleString('vi-VN')} ₫
              </span>
            </>
          ) : (
            <span className="product-price">
              {product.price1.toLocaleString('vi-VN')} ₫
            </span>
          )}
        </div>

        <p className="description">{product.description}</p>

        <div className="quantity">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}>+</button>
        </div>

        <div className="actions">
          <button className="add-cart" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
          <button className="buy-now" onClick={handleBuyNow}>Mua ngay</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
