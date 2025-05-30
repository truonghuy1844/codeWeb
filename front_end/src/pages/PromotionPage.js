import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../data/PromotionBanners.css';
import axios from 'axios';

const PromotionPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    axios.get('http://localhost:5228/api/promotion/list')
      .then(res => setPromotions(res.data))
      .catch(err => console.error('Lỗi API:', err));
  }, []);

  const totalPages = Math.ceil(promotions.length / itemsPerPage);

  const getPageData = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return promotions.slice(start, start + itemsPerPage);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button
            key={i}
            className={`page-btn ${i === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      } else if (pages[pages.length - 1] !== '...') {
        pages.push(<span key={i}>...</span>);
      }
    }

    return (
      <div className="pagination">
        <button
          className="nav-btn"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀
        </button>
        {pages}
        <button
          className="nav-btn"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          ▶
        </button>
      </div>
    );
  };

  const pageData = getPageData();
  const isSingleCard = pageData.length === 1;

  return (
    <div className="promotion-page">
      <h2 className="title">🎉 Khuyến mãi đang diễn ra</h2>

      <div
        className="promotion-list"
        style={isSingleCard ? { justifyContent: 'center' } : {}}
      >
        {pageData.map((item, idx) => (
          <div
            className="promotion-card"
            key={idx}
            style={isSingleCard ? { maxWidth: '360px' } : {}}
          >
            <Link to={`/promotions/${item.id}`} className="card-link">
              <img
                className="promotion-img"
                src={item.banner || 'https://via.placeholder.com/320x180?text=No+Image'}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/320x180?text=No+Image';
                }}
                alt={item.title}
              />
              <div className="promotion-info">
                <div className="date">📅 {item.date}</div>
                <h3>{item.title}</h3>
                <p>
                  {item.description.length > 70 ? (
                    <>
                      {item.description.slice(0, 70)}...
                      <span style={{ color: '#c41c1c', fontWeight: 'bold' }}>
                        <Link to={`/promotions/${item.id}`}> Xem thêm</Link>
                      </span>
                    </>
                  ) : (
                    item.description
                  )}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
};

export default PromotionPage;
