import React, { useState } from 'react';
import './OrderList.css';
import OrderForm from './OrderForm';
import Modal from '../Modal/Modal';
import SuccessModal from '../Modal/SuccessModal';
import ConfirmModal from '../Modal/ConfirmModal';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

    const [searchId, setSearchId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const handleAdd = () => {
        setSelectedOrder(null);
        setEditingIndex(null);
        setIsEditing(true);
    };

    const handleEdit = (index) => {
        setSelectedOrder(filteredOrders[index]);
        setEditingIndex(index);
        setIsEditing(true);
    };

    const handleDelete = (index) => {
        setConfirmDeleteIndex(index);
    };

    const confirmDelete = () => {
        if (confirmDeleteIndex !== null) {
            const updated = filteredOrders.filter((_, i) => i !== confirmDeleteIndex);
            setOrders(updated);
            setFilteredOrders(updated);
            setConfirmDeleteIndex(null);
        }
    };

    const handleSave = (order) => {
        let updated;
        if (editingIndex !== null) {
            updated = [...filteredOrders];
            updated[editingIndex] = order;
        } else {
            updated = [...orders, order];
        }
        setOrders(updated);
        setFilteredOrders(updated);
        setIsEditing(false);
        setShowSuccess(true);
    };

    const handleSearch = () => {
        const filtered = orders.filter(order => {
            const matchId = !searchId || order.orderId.toLowerCase().includes(searchId.toLowerCase());
            const matchDate = (!startDate || order.orderDate >= startDate) &&
                              (!endDate || order.orderDate <= endDate);
            const matchStatus = !statusFilter || order.status === statusFilter;
            return matchId && matchDate && matchStatus;
        });
        setFilteredOrders(filtered);
    };

    return (
        <div className="order-container">
            <div className="search-bar">
                <label style={{ display: 'flex', flexDirection: 'column' }}>Mã đơn hàng
                    <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="Nhập mã đơn hàng" />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column' }}>Từ ngày
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="small-date" />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column' }}>Đến ngày
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="small-date" />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column' }}>Trạng thái
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="search-select">
                        <option value="">-- Tất cả --</option>
                        <option value="Chưa giao">Chưa giao</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Đã giao">Đã giao</option>
                    </select>
                </label>
                <button className="btn-search" onClick={handleSearch}>Tìm</button>
            </div>

            <div className="actions">
                <button className="btn-add" onClick={handleAdd}>➕ Thêm</button>
            </div>

            <div className="order-table">
                <table>
                    <thead>
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Ngày lập</th>
                            <th>Trạng thái</th>
                            <th>Chỉnh sửa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length === 0 ? (
                            <tr><td colSpan="5">Không có dữ liệu</td></tr>
                        ) : (
                            filteredOrders.map((order, idx) => (
                                <tr key={idx}>
                                    <td>{order.orderId}</td>
                                    <td>{order.orderDate}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => handleEdit(idx)}>✏️ Sửa</button>
                                        <button className="btn-delete" onClick={() => handleDelete(idx)}>🗑️ Xóa</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isEditing && (
                <Modal onClose={() => setIsEditing(false)}>
                    <OrderForm
                        initialOrder={selectedOrder}
                        onSave={handleSave}
                        onCancel={() => setIsEditing(false)}
                    />
                </Modal>
            )}

            {showSuccess && (
                <SuccessModal
                    message="Lưu đơn hàng thành công!"
                    onClose={() => setShowSuccess(false)}
                />
            )}

            {confirmDeleteIndex !== null && (
                <ConfirmModal
                    message="Bạn có chắc chắn muốn xóa đơn hàng này?"
                    onConfirm={confirmDelete}
                    onCancel={() => setConfirmDeleteIndex(null)}
                />
            )}
        </div>
    );
};

export default OrderList;
