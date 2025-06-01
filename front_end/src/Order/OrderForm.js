// src/Order/OrderForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderForm.css';

const OrderForm = ({ initialOrder = null, onSave, onCancel }) => {
    // ====== 1. Khai báo state ban đầu ======
    const blank = {
        customerId: '',
        customerName: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        address: '',
        orderId: '',
        orderDate: '',
        employeeId: '',
        status: '',
        description: '',
        items: []
    };

    const [order, setOrder] = useState(blank);
    const [loadingCustomer, setLoadingCustomer] = useState(false);

    // Nếu initialOrder (sửa) được truyền vào thì fill state
    useEffect(() => {
        if (initialOrder) {
            setOrder(initialOrder);
        }
    }, [initialOrder]);

    // ====== 2. Hàm gọi API lấy thông tin khách hàng ======
    const fetchCustomer = async (customerId) => {
        if (!customerId.trim()) return;
        try {
            setLoadingCustomer(true);
            const res = await axios.get(`http://localhost:5166/api/User/${customerId}`);
            // Giả sử backend trả JSON: { name, email, phone, birthday, address, gender }
            const data = res.data;
            setOrder(prev => ({
                ...prev,
                customerName: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                dob: data.birthday || '',
                address: data.address || '',
                gender: data.gender || ''
            }));
        } catch (error) {
            console.error('Lỗi khi fetch customer:', error);
            // Nếu 404 hoặc lỗi, xóa các field đã tự điền (nếu có)
            setOrder(prev => ({
                ...prev,
                customerName: '',
                email: '',
                phone: '',
                dob: '',
                address: '',
                gender: ''
            }));
        } finally {
            setLoadingCustomer(false);
        }
    };

    // Khi nhấn Enter trên ô "Mã khách hàng" (Buyer)
    const handleCustomerKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchCustomer(order.customerId);
        }
    };

    // Khi blur khỏi ô "Mã khách hàng"
    const handleCustomerBlur = () => {
        fetchCustomer(order.customerId);
    };

    // ====== 3. Hàm gọi API lấy thông tin sản phẩm (order_d) ======
    // Endpoint giả sử: GET /api/Product/fororder/{id} trả về: { success, data: { name, uom, price } }
    const fetchProduct = async (productId, index) => {
        if (!productId.trim()) return;

        try {
            const res = await axios.get(`http://localhost:5166/api/Product/fororder/${productId}`);
            const payload = res.data;
            if (!payload.success) {
                throw new Error(payload.message || 'Lỗi lấy product.');
            }
            const data = payload.data;
            setOrder(prev => {
                const itemsCopy = [...prev.items];
                // Nếu chưa tồn tại item ở vị trí index, khởi tạo object
                if (!itemsCopy[index]) {
                    itemsCopy[index] = {
                        productId: '',
                        productName: '',
                        unit: '',
                        qty: '',
                        price: '',
                        amount: '',
                        cost: '',
                        taxPct: '',
                        taxAmt: ''
                    };
                }
                itemsCopy[index].productName = data.name || '';
                itemsCopy[index].unit = data.uom || '';
                itemsCopy[index].price = data.price != null ? data.price.toString() : '';

                // Tính amount = qty * price
                const qtyNum = parseFloat(itemsCopy[index].qty) || 0;
                const priceNum = parseFloat(itemsCopy[index].price) || 0;
                itemsCopy[index].amount = (qtyNum * priceNum).toString();

                return { ...prev, items: itemsCopy };
            });
        } catch (error) {
            console.error(`Lỗi fetch product ${productId}:`, error);
            setOrder(prev => {
                const itemsCopy = [...prev.items];
                if (itemsCopy[index]) {
                    itemsCopy[index].productName = '';
                    itemsCopy[index].unit = '';
                    itemsCopy[index].price = '';
                    itemsCopy[index].amount = '';
                }
                return { ...prev, items: itemsCopy };
            });
        }
    };

    // ====== 4. Xử lý khi thay đổi bất kỳ trường nào trên form ======
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder(prev => ({ ...prev, [name]: value }));
    };

    // Khi thay đổi trong vùng "items"
    const handleItemChange = (i, field, value) => {
        setOrder(prev => {
            const itemsCopy = [...prev.items];
            itemsCopy[i] = { ...itemsCopy[i], [field]: value };

            // Nếu thay đổi qty hoặc price thì tự tính lại amount
            if (field === 'qty' || field === 'price') {
                const qtyNum = parseFloat(itemsCopy[i].qty) || 0;
                const priceNum = parseFloat(itemsCopy[i].price) || 0;
                itemsCopy[i].amount = (qtyNum * priceNum).toString();
            }
            return { ...prev, items: itemsCopy };
        });

        // Nếu vừa điền xong productId thì gọi fetchProduct
        if (field === 'productId') {
            setTimeout(() => {
                const pid = value.trim();
                if (pid) {
                    fetchProduct(pid, i);
                } else {
                    setOrder(prev => {
                        const itemsCopy = [...prev.items];
                        if (itemsCopy[i]) {
                            itemsCopy[i].productName = '';
                            itemsCopy[i].unit = '';
                            itemsCopy[i].price = '';
                            itemsCopy[i].amount = '';
                        }
                        return { ...prev, items: itemsCopy };
                    });
                }
            }, 0);
        }
    };

    // Thêm 1 dòng items mới
    const addItem = () => {
        setOrder(prev => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    productId: '',
                    productName: '',
                    unit: '',
                    qty: '',
                    price: '',
                    amount: '',
                    cost: '',
                    taxPct: '',
                    taxAmt: ''
                }
            ]
        }));
    };

    // Xóa 1 dòng items
    const removeItem = (idx) => {
        setOrder(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== idx)
        }));
    };

    // Reset lại toàn bộ form
    const resetForm = () => {
        setOrder(blank);
    };

    // Khi nhấn Submit (Lưu)
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate cơ bản
        if (!order.customerId.trim()) {
            alert('Vui lòng nhập Mã khách hàng (Buyer).');
            return;
        }
        if (!order.employeeId.trim()) {
            alert('Vui lòng nhập Nhân viên (Seller).');
            return;
        }
        if (!order.items.length || order.items.some(i => !i.productId.trim())) {
            alert('Vui lòng nhập ít nhất một Mã sản phẩm hợp lệ.');
            return;
        }

        // Gọi callback onSave đưa dữ liệu về parent (OrderList.jsx)
        onSave(order);
    };

    // Tính tổng amount của tất cả items
    const totalAmount = order.items.reduce(
        (sum, item) => sum + (parseFloat(item.amount) || 0),
        0
    );

    return (
        <div className="order-form-container">
            <h2>{initialOrder ? 'SỬA ĐƠN HÀNG' : 'THÊM ĐƠN HÀNG'}</h2>
            <form onSubmit={handleSubmit}>
                {/* ── 4.1. Thông tin Khách hàng & Đơn hàng ──────────────────────── */}
                <div className="form-sections">
                    {/* ── 4.1.1. Thông tin Khách hàng ─────────────────────────────── */}
                    <div className="section customer-info">
                        <h3>THÔNG TIN KHÁCH HÀNG</h3>
                        <label>
                            Mã khách hàng (Buyer)
                            <input
                                name="customerId"
                                value={order.customerId}
                                onChange={handleChange}
                                onKeyDown={handleCustomerKeyDown}
                                onBlur={handleCustomerBlur}
                            />
                        </label>
                        {loadingCustomer && <div className="loading-customer">Đang tải...</div>}

                        <label>
                            Họ và tên
                            <input
                                name="customerName"
                                value={order.customerName}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Email liên hệ
                            <input
                                name="email"
                                value={order.email}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            SDT liên hệ
                            <input
                                name="phone"
                                value={order.phone}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Ngày sinh
                            <input
                                type="date"
                                name="dob"
                                value={order.dob}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Địa chỉ
                            <input
                                name="address"
                                value={order.address}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Giới tính
                            <select
                                name="gender"
                                value={order.gender}
                                onChange={handleChange}
                            >
                                <option value="">--Chọn giới tính--</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </label>
                    </div>

                    {/* ── 4.1.2. Thông tin Đơn hàng ───────────────────────────────── */}
                    <div className="section order-info">
                        <h3>THÔNG TIN ĐƠN HÀNG</h3>
                        <label>
                            Mã đơn hàng (OrderId)
                            <input
                                name="orderId"
                                value={order.orderId}
                                onChange={handleChange}
                                placeholder="Để trống thì backend sẽ tự sinh"
                            />
                        </label>

                        <label>
                            Ngày đơn hàng
                            <input
                                type="date"
                                name="orderDate"
                                value={order.orderDate}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Nhân viên (Seller)
                            <input
                                name="employeeId"
                                value={order.employeeId}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Trạng thái
                            <select
                                name="status"
                                value={order.status}
                                onChange={handleChange}
                            >
                                <option value="">--Chọn--</option>
                                <option value="Chưa giao">Chưa giao</option>
                                <option value="Đang giao">Đang giao</option>
                                <option value="Đã giao">Đã giao</option>
                            </select>
                        </label>

                        <label>
                            Ghi chú (Description)
                            <textarea
                                name="description"
                                value={order.description}
                                onChange={handleChange}
                                rows={2}
                            />
                        </label>
                    </div>
                </div>

                {/* ── 4.2. Chi tiết Hàng hóa (Items) ───────────────────────────── */}
                <div className="items-section">
                    <h3>CHI TIẾT HÀNG HÓA</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>ĐVT</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                                <th>Chi phí</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <input
                                            value={item.productId}
                                            onChange={e =>
                                                handleItemChange(idx, 'productId', e.target.value)
                                            }
                                            onBlur={() => {
                                                const pid = (order.items[idx]?.productId || '').trim();
                                                if (pid) {
                                                    fetchProduct(pid, idx);
                                                }
                                            }}
                                        />
                                    </td>
                                    <td><input value={item.productName} readOnly /></td>
                                    <td><input value={item.unit} readOnly /></td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.qty}
                                            onChange={e =>
                                                handleItemChange(idx, 'qty', e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={e =>
                                                handleItemChange(idx, 'price', e.target.value)
                                            }
                                        />
                                    </td>
                                    <td><input value={item.amount} readOnly /></td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.cost}
                                            onChange={e =>
                                                handleItemChange(idx, 'cost', e.target.value)
                                            }
                                            placeholder="Cost"
                                        />
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn-remove"
                                            onClick={() => removeItem(idx)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    Tổng tiền:
                                </td>
                                <td>
                                    <input value={totalAmount.toLocaleString()} readOnly />
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <button
                        type="button"
                        className="btn-add-item"
                        onClick={addItem}
                    >
                        + Thêm dòng
                    </button>
                </div>

                {/* ── 4.3. Nút Hành động ────────────────────────────────────────── */}
                <div className="form-actions">
                    <button type="button" onClick={resetForm}>
                        Làm mới
                    </button>
                    <button type="button" onClick={onCancel}>
                        Hủy
                    </button>
                    <button type="submit">Lưu</button>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;
