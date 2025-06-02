// src/Order/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderForm.css';              // Dùng CSS cũ của form
import Modal from '../Modal/Modal';    // Modal chung
import SuccessModal from '../Modal/SuccessModal';
import ConfirmModal from '../Modal/ConfirmModal';
import MenuAdmin from './MenuAdmin';  // Thanh menu bên trái
import AdminHeader from '../AdminLayout/AdminHeader';

/**
 * ─────────────────────────────────────────────────────────────────────
 * Đây là component OrderForm (được nhúng bên trong file này luôn)
 * ─────────────────────────────────────────────────────────────────────
 */
const OrderForm = ({ initialOrder = null, isEdit = false, onSubmit, onCancel }) => {
    // Giá trị mặc định (blank) cho form
    const blank = {
        orderId: '',
        orderDate: '',
        customerId: '',
        customerName: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        address: '',
        employeeId: '',
        status: '',
        description: '',
        items: []
    };

    const [order, setOrder] = useState(blank);
    const [buyerValid, setBuyerValid] = useState(true);
    const [loadingCustomer, setLoadingCustomer] = useState(false);
    const [sellerValid, setSellerValid] = useState(true);
    const [loadingSeller, setLoadingSeller] = useState(false);

    // Khi initialOrder thay đổi (ví dụ parent pass vào), set lại state
    useEffect(() => {
        if (initialOrder) {
            setOrder(initialOrder);
        } else {
            setOrder(blank);
        }
    }, [initialOrder]);

    // 0) Fetch thông tin nhân viên
    const checkSeller = async (sellerId) => {
        if (!sellerId.trim()) {
            setSellerValid(false);
            return false;
        }

        try {
            setLoadingSeller(true);
            // Gọi API GET /api/User/{id}
            const res = await fetch(`http://localhost:5166/api/User/${sellerId}`);
            if (!res.ok) {
                // Nếu không tìm thấy (404) hoặc lỗi, là không hợp lệ
                setSellerValid(false);
                return false;
            }
            const data = await res.json();
            // data.seller trả về false
            if (data.seller !== true) {
                setSellerValid(false);
                return false;
            }
            setSellerValid(true);
            return true;
            // Nếu seller === 1 → hợp lệ

        } catch (err) {
            console.error('Lỗi kiểm tra seller:', err);
            setSellerValid(false);
            return false;
        } finally {
            setLoadingSeller(false);
        }
    };
    // 1) Fetch thông tin khách (User) từ backend
    const fetchCustomer = async (customerId) => {
        if (!customerId.trim()) {
            setBuyerValid(false);
            return false;
        }
        try {
            setLoadingCustomer(true);
            const res = await fetch(`http://localhost:5166/api/User/${customerId}`);
            if (!res.ok) {
                setBuyerValid(false);
                return false;
            }
            const data = await res.json();

            setOrder(prev => ({
                ...prev,
                customerName: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                dob: data.birthday || '',
                address: data.address || '',
                gender: data.gender || ''
            }));
            if (data.buyer !== true) {
                setBuyerValid(false);
                return false;
            }
            setBuyerValid(true);
            return true;
        } catch (err) {
            console.error('Lỗi khi fetch customer:', err);
            setBuyerValid(false);
            return false;
            const msgcustomer = err.response?.data?.message || err.message;
            alert('Lỗi server: ' + msgcustomer);
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

    const handleCustomerKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchCustomer(order.customerId);
        }
    };
    const handleCustomerBlur = () => {
        fetchCustomer(order.customerId);
    };

    // 2) Fetch thông tin sản phẩm (order_d)
    const fetchProduct = async (productId, idx) => {
        if (!productId.trim()) return;
        try {
            const res = await fetch(`http://localhost:5166/api/Products/${productId}`);
            const payload = await res.json();
            if (!payload.success) throw new Error(payload.message || 'Lỗi fetch product');
            const data = payload.data;
            const finalPrice = data.price2 != null ? data.price2 : data.price1;
            setOrder(prev => {
                const itemsCopy = [...prev.items];
                if (!itemsCopy[idx]) {
                    itemsCopy[idx] = {
                        productId: '',
                        productName: '',
                        unit: '',
                        qty: '',
                        price: '',
                        amount: '',
                        cost: '',
                        tax: ''
                    };
                }
                itemsCopy[idx].productName = data.name || '';
                itemsCopy[idx].unit = data.uom || '';
                itemsCopy[idx].price = finalPrice != null ? finalPrice.toString() : '';
                // Tính amount
                const q = parseFloat(itemsCopy[idx].qty) || 0;
                const p = parseFloat(itemsCopy[idx].price) || 0;
                itemsCopy[idx].amount = (q * p).toString();
                return { ...prev, items: itemsCopy };
            });
        } catch (err) {
            console.error(`Lỗi fetch product ${productId}:`, err);
            setOrder(prev => {
                const itemsCopy = [...prev.items];
                if (itemsCopy[idx]) {
                    itemsCopy[idx].productName = '';
                    itemsCopy[idx].unit = '';
                    itemsCopy[idx].price = '';
                    itemsCopy[idx].amount = '';
                }
                return { ...prev, items: itemsCopy };
            });
        }
    };

    // 3) Xử lý khi thay đổi các ô chung
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder(prev => ({ ...prev, [name]: value }));
    };

    // 4) Xử lý khi thay đổi trong vùng items
    const handleItemChange = (i, field, value) => {
        setOrder(prev => {
            const itemsCopy = [...prev.items];
            itemsCopy[i] = { ...itemsCopy[i], [field]: value };
            if (field === 'qty' || field === 'price') {
                const q = parseFloat(itemsCopy[i].qty) || 0;
                const p = parseFloat(itemsCopy[i].price) || 0;
                itemsCopy[i].amount = (q * p).toString();
            }
            return { ...prev, items: itemsCopy };
        });

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

    // 5) Thêm / Xóa dòng items
    const addItem = () => {
        setOrder(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { productId: '', productName: '', unit: '', qty: '', price: '', amount: '', cost: '', tax: '' }
            ]
        }));
    };
    const removeItem = (idx) => {
        setOrder(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== idx)
        }));
    };

    // 6) Reset form (chỉ dùng khi tạo mới)
    const resetForm = () => {
        setOrder(blank);
    };

    // 7) Submit form → gọi onSubmit xuống parent
    const handleSubmit = (e) => {
        e.preventDefault();

        //
        if (order.customerId.trim() === order.employeeId.trim()) {
            alert('Mã khách hàng và mã nhân viên không được trùng nhau.');
            return;
        }
        //valid mã nhân viên
        if (!sellerValid) {
            alert('Vui lòng nhập đúng Mã nhân viên (Seller).');
            return;
        }

        //valid mã khách hàng
        if (!buyerValid) {
            alert('Vui lòng nhập đúng Mã khách hàng (Buyer).');
            return;
        }

        // Validate cơ bản
        if (!order.customerId.trim()) {
            alert('Vui lòng nhập Mã khách hàng');
            return;
        }
        if (!order.employeeId.trim()) {
            alert('Vui lòng nhập Mã nhân viên');
            return;
        }
        if (!order.items.length || order.items.some(it => !it.productId.trim())) {
            alert('Vui lòng nhập tối thiểu một sản phẩm hợp lệ');
            return;
        }
        onSubmit(order);
    };

    // 8) Tính tổng tiền
    const totalAmount = order.items.reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0);

    return (
        <div className="order-form-container">
            <h2>{isEdit ? 'SỬA ĐƠN HÀNG' : 'THÊM ĐƠN HÀNG'}</h2>
            <form onSubmit={handleSubmit}>
                {/* ── Thông tin Khách hàng & Đơn hàng ───────────────────── */}
                <div className="form-sections">
                    <div className="section customer-info">
                        <h3>THÔNG TIN KHÁCH HÀNG</h3>
                        <label>
                            Mã khách hàng (Buyer)
                            <input
                                type='number' min={1}
                                name="customerId"
                                value={order.customerId}
                                onChange={handleChange}
                                onKeyDown={handleCustomerKeyDown}
                                onBlur={handleCustomerBlur}
                            />
                        </label>
                        {loadingCustomer && <div className="loading-customer">Đang tải...</div>}
                        {!buyerValid && (
                            <div className="text-red-500 text-sm mt-1">
                                Mã khách hàng không hợp lệ hoặc không phải Buyer.
                            </div>
                        )}

                        <label>
                            Họ và tên
                            <input name="customerName" value={order.customerName} readOnly />
                        </label>

                        <label>
                            Email liên hệ
                            <input name="email" value={order.email} readOnly />
                        </label>

                        <label>
                            SDT liên hệ
                            <input name="phone" value={order.phone} readOnly />
                        </label>

                        <label>
                            Ngày sinh
                            <input type="date" name="dob" value={order.dob} readOnly />
                        </label>

                        <label>
                            Địa chỉ
                            <input name="address" value={order.address} readOnly />
                        </label>
                    </div>

                    <div className="section order-info">
                        <h3>THÔNG TIN ĐƠN HÀNG</h3>
                        <label>
                            Mã đơn hàng (OrderId)
                            <input
                                name="orderId"
                                value={order.orderId}
                                // onChange={handleChange}
                                readOnly
                                placeholder={isEdit ? '' : 'Backend sẽ tự sinh'}
                                disabled={isEdit}
                            />
                        </label>

                        {/* <label>
                            Ngày lập đơn hàng
                            <input type="date" name="orderDate" value={order.orderDate} onChange={handleChange} />
                        </label> */}

                        <label>
                            Nhân viên (Seller)
                            <input type='number' name="employeeId" min={1} value={order.employeeId} onChange={e => {
                                setSellerValid(true);
                                handleChange(e)
                            }}
                                onBlur={() => {
                                    checkSeller(order.employeeId)
                                }}
                            />
                            {!sellerValid && (
                                <div className="text-red-500 text-sm mt-1">
                                    Mã nhân viên không hợp lệ hoặc không phải Seller.
                                </div>
                            )}

                        </label>

                        <label>
                            Trạng thái
                            <select name="status" value={order.status} onChange={handleChange}>
                                <option value="">--Chọn--</option>
                                <option value="0">Chưa giao</option>
                                <option value="1">Đang giao</option>
                                <option value="2">Đã giao</option>
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

                {/* ── Chi tiết Hàng hóa ─────────────────────────────────── */}
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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <input
                                            value={item.productId}
                                            onChange={e => handleItemChange(idx, 'productId', e.target.value)}
                                            onBlur={() => {
                                                const pid = (order.items[idx]?.productId || '').trim();
                                                if (pid) fetchProduct(pid, idx);
                                            }}
                                        />
                                    </td>
                                    <td><input value={item.productName} readOnly /></td>
                                    <td><input value={item.unit} readOnly /></td>
                                    <td>
                                        <input
                                            type="number" min="1"
                                            value={item.qty}
                                            onChange={e => handleItemChange(idx, 'qty', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.price} readOnly
                                        />
                                    </td>
                                    <td><input value={item.amount} readOnly /></td>
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
                                    <input value={totalAmount.toLocaleString('vi-VN')} readOnly />
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>

                    <button type="button" className="btn-add-item" onClick={addItem}>
                        + Thêm dòng
                    </button>
                </div>

                {/* ── Nút hành động ─────────────────────────────────────── */}
                <div className="form-actions">
                    {!isEdit && (
                        <button type="button" onClick={resetForm}>
                            Làm mới
                        </button>
                    )}
                    <button type="button" onClick={onCancel}>
                        Hủy
                    </button>
                    <button type="submit">{isEdit ? 'Cập nhật' : 'Tạo mới'}</button>
                </div>
            </form>
        </div>
    );
};


/**
 * ─────────────────────────────────────────────────────────────────────
 * Đây là component chính OrderManagement (kết hợp OrderList + Form)
 * ─────────────────────────────────────────────────────────────────────
 */
const OrderManagement = () => {
    const [activeTab, setActiveTab] = useState('orders');

    // State lưu danh sách orders và filtered
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Nếu false → Thêm mới; nếu true → Sửa
    const [isEditMode, setIsEditMode] = useState(false);

    // Dữ liệu đơn hàng được chọn để sửa
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Hiển thị modal thành công
    const [showSuccess, setShowSuccess] = useState(false);

    // Xác nhận xóa
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

    // Lỗi khi load bảng
    const [loadError, setLoadError] = useState(null);

    // Khi component mount → fetch tất cả orders
    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5166/api/AdminOrder/get-all');
            const data = res.data || [];
            setOrders(data);
            setFilteredOrders(data);
        } catch (err) {
            console.error('Lỗi khi fetch danh sách đơn hàng:', err);
            setLoadError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
        }
    };

    // Search (nếu muốn)
    const handleSearch = (keyword) => {
        if (!keyword) {
            setFilteredOrders(orders);
        } else {
            const lower = keyword.toLowerCase();
            const f = orders.filter(o =>
                (o.orderId || '').toLowerCase().includes(lower) ||
                (o.dateCreated || '').toString().toLowerCase().includes(lower) ||
                (o.status || '').toString().toLowerCase().includes(lower)
            );
            setFilteredOrders(f);
        }
    };

    // Khi bấm “Thêm”:
    const handleAddClick = () => {
        setIsEditMode(false);
        setSelectedOrder(null);
        setIsModalOpen(true);
    };

    // Khi bấm “Sửa”:
    const handleEditClick = async (idx) => {
        const ord = filteredOrders[idx];
        if (!ord) return;

        try {
            const res = await axios.get(`http://localhost:5166/api/AdminOrder/${ord.orderId}`);
            const detail = res.data;

            // Map dữ liệu về đúng format OrderForm value={order.orderDate}
            const mapped = {
                orderId: detail.orderId || '',
                orderDate: detail.dateCreated || '',
                customerId: detail.buyer?.toString() || '',
                customerName: detail.customerName || '', // nếu API trả thêm
                email: detail.email || '',
                phone: detail.phone || '',
                gender: detail.gender || '',
                dob: detail.dob || '',
                address: detail.address || '',
                employeeId: detail.seller?.toString() || '',
                status: detail.status?.toString() || '',
                description: detail.description || '',
                items: (detail.items || []).map(it => ({
                    productId: it.productId || '',
                    productName: it.productName || '',
                    unit: it.unit || '',
                    qty: it.quantity?.toString() || '',
                    price: it.price?.toString() || '',
                    amount: ((it.quantity || 0) * (it.price || 0)).toString(),
                    cost: it.cost?.toString() || '',
                    tax: it.taxPct?.toString() || ''
                }))
            };

            setSelectedOrder(mapped);
            setIsEditMode(true);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Lỗi khi tải chi tiết đơn hàng:', err);
            setLoadError('Không thể tải chi tiết đơn hàng. Vui lòng thử lại.');
        }
    };

    // Khi bấm “Xóa” (nếu muốn)
    const handleDeleteClick = (idx) => {
        setConfirmDeleteIndex(idx);
    };
    const confirmDelete = async () => {
        if (confirmDeleteIndex === null) return;
        const ord = filteredOrders[confirmDeleteIndex];
        if (!ord) {
            setConfirmDeleteIndex(null);
            return;
        }
        try {
            await axios.delete(`http://localhost:5166/api/AdminOrder/delete/${ord.orderId}`);
            await fetchAllOrders();
            setShowSuccess(true);
        } catch (err) {
            console.error('Lỗi khi xóa đơn hàng:', err);
            alert('Xóa không thành công.');
        } finally {
            setConfirmDeleteIndex(null);
        }
    };

    // Khi form OrderForm gọi xuống (Submit)
    // Nếu isEditMode === true → PUT, ngược lại POST
    const handleSave = async (orderData) => {
        const payload = {
            OrderId: orderData.orderId || '',
            Buyer: parseInt(orderData.customerId, 10) || 0,
            Seller: parseInt(orderData.employeeId, 10) || 0,
            Description: orderData.description || '',
            Status: parseInt(orderData.status, 10) || 0,
            OrderDate: orderData.orderDate || '',
            Items: orderData.items.map(item => ({
                ProductId: item.productId,
                Quantity: parseInt(item.qty, 10) || 0,
                Price: parseFloat(item.price) || 0,
                Cost: parseFloat(item.cost) || 0,
                Tax: null   // nếu không dùng trường Tax, để null
            }))
        };

        try {
            if (isEditMode) {
                // PUT
                await axios.put(
                    `http://localhost:5166/api/AdminOrder/update/${orderData.orderId}`,
                    payload
                );
            } else {
                // POST
                await axios.post(
                    'http://localhost:5166/api/AdminOrder/create',
                    payload
                );
            }
            await fetchAllOrders();
            setShowSuccess(true);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Lỗi khi lưu/cập nhật đơn hàng:', err);
            const msg = err.response?.data?.message || err.message;
            alert('Lỗi server: ' + msg);
        }
    };

    return (
        <>
            <AdminHeader />
            <div className="flex min-h-screen bg-gray-100">
                {/* Menu bên trái */}
                <MenuAdmin activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="flex-1 p-6 overflow-auto">
                    {activeTab === 'orders' ? (
                        <div className="order-container bg-white rounded-lg shadow p-6">
                            {/* Search bar */}
                            <div className="flex mb-4">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    onChange={e => handleSearch(e.target.value)}
                                    className="flex-1 px-4 py-2 border rounded-l"
                                />
                                <button
                                    onClick={() => handleSearch('')}
                                    className="px-4 py-2 bg-gray-200 border border-l-0 rounded-r hover:bg-gray-300"
                                >
                                    🔄
                                </button>
                            </div>

                            {/* Nút Thêm mới */}
                            <div className="flex justify-end mb-4">
                                <button
                                    className="flex items-center gap-2 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition"
                                    onClick={handleAddClick}
                                >
                                    ➕ Thêm
                                </button>
                            </div>

                            {/* Bảng danh sách orders */}
                            <div className="order-table overflow-x-auto">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 text-left">Mã đơn hàng</th>
                                            <th className="px-4 py-2 text-left">Ngày lập đơn hàng</th>
                                            <th className="px-4 py-2 text-left">Trạng thái</th>
                                            <th className="px-4 py-2 text-left">Chỉnh sửa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                                                    Không có dữ liệu
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredOrders.map((ord, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-4 py-3 text-sm text-gray-800 border-b">
                                                        {ord.orderId}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-800 border-b">
                                                        {ord.dateCreated}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-800 border-b">
                                                        {ord.status}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-800 border-b">
                                                        <div className="flex gap-2">
                                                            <button
                                                                className="text-yellow-600 hover:text-yellow-800"
                                                                onClick={() => handleEditClick(idx)}
                                                            >
                                                                ✏️ Sửa
                                                            </button>
                                                            {/* <button
                                                                className="text-red-600 hover:text-red-800"
                                                                onClick={() => handleDeleteClick(idx)}
                                                            >
                                                                🗑️ Xóa
                                                            </button> */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {loadError && (
                                <div className="mt-4 text-red-600">{loadError}</div>
                            )}

                            {/* Modal Thêm/Sửa */}
                            {isModalOpen && (
                                <Modal onClose={() => setIsModalOpen(false)}>
                                    <OrderForm
                                        initialOrder={selectedOrder}
                                        isEdit={isEditMode}
                                        onSubmit={handleSave}
                                        onCancel={() => setIsModalOpen(false)}
                                    />
                                </Modal>
                            )}

                            {/* Modal thành công */}
                            {showSuccess && (
                                <SuccessModal
                                    message={
                                        isEditMode
                                            ? 'Cập nhật đơn hàng thành công!'
                                            : 'Tạo đơn hàng thành công!'
                                    }
                                    onClose={() => setShowSuccess(false)}
                                />
                            )}

                            {/* Modal xác nhận xóa */}
                            {confirmDeleteIndex !== null && (
                                <ConfirmModal
                                    message="Bạn có chắc chắn muốn xóa đơn hàng này?"
                                    onConfirm={confirmDelete}
                                    onCancel={() => setConfirmDeleteIndex(null)}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            <p>Vui lòng chọn “Đơn hàng” trên menu để quản lý đơn hàng.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrderManagement;
