import React, { useState, useEffect } from 'react';
import './OrderForm.css';

const OrderForm = ({ initialOrder = null, onSave, onCancel }) => {
    const blank = {
        customerId: '', customerName: '', email: '', phone: '',
        gender: '', dob: '', address: '',
        orderId: '', orderDate: '', employeeId: '', status: '',
        items: []
    };

    const [order, setOrder] = useState(blank);

    useEffect(() => {
        if (initialOrder) setOrder(initialOrder);
    }, [initialOrder]);

    const handleChange = e => {
        const { name, value } = e.target;
        setOrder(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (i, field, value) => {
        const items = [...order.items];
        items[i] = { ...items[i], [field]: value };

        const qty = parseFloat(items[i].qty) || 0;
        const price = parseFloat(items[i].price) || 0;
        items[i].amount = qty * price;

        setOrder(prev => ({ ...prev, items }));
    };

    const addItem = () => {
        setOrder(prev => ({
            ...prev,
            items: [...prev.items, {
                productId: '', productName: '', unit: '',
                qty: '', price: '', amount: '', taxPct: '', taxAmt: ''
            }]
        }));
    };

    const removeItem = i => {
        setOrder(prev => ({
            ...prev,
            items: prev.items.filter((_, idx) => idx !== i)
        }));
    };

    const resetForm = () => setOrder(blank);

    const handleSubmit = e => {
        e.preventDefault();

        if (!order.orderId.trim()) {
            alert('Vui lòng nhập mã đơn hàng.');
            return;
        }

        if (!order.customerId.trim()) {
            alert('Vui lòng nhập mã khách hàng.');
            return;
        }

        if (order.items.length === 0 || order.items.some(item => !item.productId.trim())) {
            alert('Vui lòng nhập ít nhất một mã sản phẩm.');
            return;
        }

        onSave(order);
    };

    const totalAmount = order.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    return (
        <div className="order-form-container">
            <h2>{initialOrder ? 'SỬA ĐƠN HÀNG' : 'THÊM ĐƠN HÀNG'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-sections">
                    <div className="section customer-info">
                        <h3>THÔNG TIN KHÁCH HÀNG</h3>
                        <label>Mã khách hàng
                            <input name="customerId" value={order.customerId} onChange={handleChange} />
                        </label>
                        <label>Họ và tên
                            <input name="customerName" value={order.customerName} onChange={handleChange} />
                        </label>
                        <label>Email liên hệ
                            <input name="email" value={order.email} onChange={handleChange} />
                        </label>
                        <label>SDT liên hệ
                            <input name="phone" value={order.phone} onChange={handleChange} />
                        </label>
                        <label>Ngày sinh
                            <input type="date" name="dob" value={order.dob} onChange={handleChange} />
                        </label>
                        <label>Địa chỉ
                            <input name="address" value={order.address} onChange={handleChange} />
                        </label>
                    </div>

                    <div className="section order-info">
                        <h3>THÔNG TIN ĐƠN HÀNG</h3>
                        <label>Mã đơn hàng
                            <input name="orderId" value={order.orderId} onChange={handleChange} />
                        </label>
                        <label>Ngày đơn hàng
                            <input type="date" name="orderDate" value={order.orderDate} onChange={handleChange} />
                        </label>
                        <label>Nhân viên
                            <input name="employeeId" value={order.employeeId} onChange={handleChange} />
                        </label>
                        <label>Trạng thái
                            <select name="status" value={order.status} onChange={handleChange}>
                                <option value="">--Chọn--</option>
                                <option value="Chưa giao">Chưa giao</option>
                                <option value="Đang giao">Đang giao</option>
                                <option value="Đã giao">Đã giao</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="items-section">
                    <h3>THÔNG TIN ĐƠN HÀNG</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th><th>Tên sản phẩm</th><th>ĐVT</th><th>Số lượng</th>
                                <th>Đơn giá</th><th>Thành tiền</th><th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, i) => (
                                <tr key={i}>
                                    <td><input value={item.productId} onChange={e => handleItemChange(i, 'productId', e.target.value)} /></td>
                                    <td><input value={item.productName} onChange={e => handleItemChange(i, 'productName', e.target.value)} /></td>
                                    <td><input value={item.unit} onChange={e => handleItemChange(i, 'unit', e.target.value)} /></td>
                                    <td><input type="number" value={item.qty} onChange={e => handleItemChange(i, 'qty', e.target.value)} /></td>
                                    <td><input type="number" value={item.price} onChange={e => handleItemChange(i, 'price', e.target.value)} /></td>
                                    <td><input value={item.amount} readOnly /></td>
                                    <td><button type="button" className="btn-remove" onClick={() => removeItem(i)}>Xóa</button></td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng tiền:</td>
                                <td><input value={totalAmount.toLocaleString()} readOnly /></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="button" className="btn-add-item" onClick={addItem}>+ Thêm dòng</button>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={resetForm}>Làm mới</button>
                    <button type="button" onClick={onCancel}>Hủy</button>
                    <button type="submit">Lưu</button>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;
