import React from 'react';
import './AdminLayout.css';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="logo">TOY STORE</div>
                <nav className="menu">
                    <ul>
                        <li className={location.pathname === '/' ? 'active' : ''}>
                            <Link to="/">🏠 Trang chủ</Link>
                        </li>
                        <li className={location.pathname === '/nhan-vien' ? 'active' : ''}>
                            <Link to="/nhan-vien">👩‍💼 Nhân viên</Link>
                        </li>
                        <li className={location.pathname === '/san-pham' ? 'active' : ''}>
                            <Link to="/san-pham">📦 Sản phẩm</Link>
                        </li>
                        <li className={location.pathname === '/don-hang' ? 'active' : ''}>
                            <Link to="/don-hang">🧾 Đơn hàng</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
