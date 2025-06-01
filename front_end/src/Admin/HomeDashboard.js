import React from 'react';
import MenuAdmin from './MenuAdmin';
import './HomeDashboard.css';
import AdminHeader from '../AdminLayout/AdminHeader';
const HomeDashboard = () => {
  return (
    <>
    <AdminHeader />
   
    <div className="flex">
      <MenuAdmin />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="dashboard-container">
          <div className="dashboard-grid">
            <div className="dashboard-card">SẢN PHẨM <div>1</div></div>
            <div className="dashboard-card">ĐƠN HÀNG <div>1</div></div>
            <div className="dashboard-card">SẢN PHẨM BÁN CHẠY <div>1</div></div>
            <div className="dashboard-card">ĐƠN HÀNG CHƯA XỬ LÝ <div>1</div></div>
            <div className="dashboard-card">ĐƠN HÀNG ĐANG XỬ LÝ <div>1</div></div>
            <div className="dashboard-card">ĐƠN HÀNG ĐÃ HOÀN THÀNH <div>1</div></div>
            <div className="dashboard-card">DOANH THU <div>1.000.000</div></div>
          </div>
          <div className="dashboard-chart">
            <h4>Doanh thu theo danh mục sản phẩm</h4>
            <img src="/chart-placeholder.png" alt="chart" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
     </>
  );
};

export default HomeDashboard;
