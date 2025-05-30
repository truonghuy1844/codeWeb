import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, X, AlertCircle, CheckCircle } from 'lucide-react';
import MenuAdmin from "../Admin/Menu";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5166/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

const ROLES = [
  { value: 'isAdmin', label: 'Admin' },
  { value: 'isBuyer', label: 'Buyer' },
  { value: 'isSeller', label: 'Seller' }
];

const UserManagerment = () => {
  const [activeTab, setActiveTab] = useState('staff');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [formErrors, setFormErrors] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    UserName: '',
    onConfirm: null
  });

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([
    { value: 'IT', label: 'IT' },
    { value: 'HR', label: 'HR' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Other', label: 'Khác' }
  ]);

  const [formData, setFormData] = useState({
    userId: 0,
    userName: '',
    password: '',
    isAdmin: false,
    isBuyer: false,
    isSeller: false,
    status: true,
    department: '',
    name: '',
    birthday: '',
    phoneNumber: '',
    address: '',
    email: '',
    role: ''
  });

  // Notification function
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 4000);
  };

  // Fetch users
  const fetchUser = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/User/search', {});
      setUsers(response.data || []);
    } catch (err) {
      setError('Không thể tải danh sách User: ' + err.message);
      showNotification('Không thể tải danh sách User', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Filter users
  const filteredUser = users.filter(u => {
    return (
      (u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (departmentFilter === '' || u.department === departmentFilter) &&
      (statusFilter === '' || String(u.status) === statusFilter)
    );
  });

  // Handle add user
  const handleAddUser = () => {
    setModalMode('add');
    setFormData({
      userId: 0,
      userName: '',
      password: '',
      isAdmin: false,
      isBuyer: false,
      isSeller: false,
      status: true,
      department: '',
      name: '',
      birthday: '',
      phoneNumber: '',
      address: '',
      email: '',
      role: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    let role = '';
    if (user.isAdmin) role = 'isAdmin';
    else if (user.isBuyer) role = 'isBuyer';
    else if (user.isSeller) role = 'isSeller';
    setFormData({
      userId: Number(user.userId),
      userName: user.userName || '',
      password: user.password || '', // luôn hiện mật khẩu khi sửa
      isAdmin: user.isAdmin || false,
      isBuyer: user.isBuyer || false,
      isSeller: user.isSeller || false,
      status: user.status ?? true,
      department: user.department || '',
      name: user.name || '',
      birthday: user.birthday ? user.birthday.split('T')[0] : '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      email: user.email || '',
      role
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Handle delete user
  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.userId === userId);
    setConfirmDialog({
      show: true,
      UserName: user ? user.name : 'User này',
      onConfirm: () => performDelete(userId)
    });
  };

  // Delete user
  const performDelete = async (userId) => {
    try {
      setLoading(true);
      setConfirmDialog({ show: false });
      const res = await api.delete(`/User/delete/${userId}`);
      if (res.data && res.status === 200) {
        await fetchUser();
        showNotification('Xóa User thành công!', 'success');
      } else {
        showNotification(res.data?.message || 'Không thể xóa User', 'error');
      }
    } catch (error) {
      showNotification('Có lỗi xảy ra khi xóa User', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Validate form
  const validateUserData = (data) => {
    const errors = {};
    if (!data.userName?.trim()) errors.userName = 'Tên đăng nhập không được để trống';
    if (modalMode === 'add' && !data.password?.trim()) errors.password = 'Mật khẩu không được để trống';
    if (!data.name?.trim()) errors.name = 'Tên người dùng không được để trống';
    if (!data.department?.trim()) errors.department = 'Phòng ban không được để trống';
    if (!data.role) errors.role = 'Vui lòng chọn quyền truy cập';
    if (data.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) errors.email = 'Email không hợp lệ';
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Handle quyền truy cập dropdown
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData(prev => ({
      ...prev,
      role,
      isAdmin: role === 'isAdmin',
      isBuyer: role === 'isBuyer',
      isSeller: role === 'isSeller'
    }));
    if (formErrors.role) {
      setFormErrors(prev => ({ ...prev, role: '' }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const validation = validateUserData(formData);
      if (!validation.isValid) {
        setFormErrors(validation.errors);
        showNotification('Vui lòng kiểm tra lại thông tin nhập vào', 'error');
        return;
      }
      const payload = {
        ...formData,
        birthday: formData.birthday ? new Date(formData.birthday).toISOString() : null,
        isAdmin: formData.role === 'isAdmin',
        isBuyer: formData.role === 'isBuyer',
        isSeller: formData.role === 'isSeller'
      };
      if (modalMode === 'add') {
        await api.post('/User/upsert', payload);
        showNotification('Thêm User thành công!', 'success');
      } else {
        await api.post('/User/upsert', payload);
        showNotification('Cập nhật User thành công!', 'success');
      }
      setShowModal(false);
      setFormData({});
      await fetchUser();
    } catch (error) {
      showNotification(error?.response?.data?.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
          notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
          'bg-blue-100 text-blue-800 border-blue-200'
        }`}>
          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-semibold mb-3 text-gray-900">Xác nhận xóa</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Bạn có chắc chắn muốn xóa "
              <span className="font-medium text-gray-800">{confirmDialog.UserName}</span>
              "?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog({ show: false })}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
              >
                Hủy
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <MenuAdmin activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 lg:ml-0">
        {activeTab === 'staff' && (
          <div className="p-4">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Quản lý user</h2>
              <p className="text-sm text-gray-600">Quản lý toàn bộ user trong cửa hàng</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Search */}
                <div className="md:col-span-2 lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên đăng nhập hoặc tên người dùng..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Department Filter */}
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Tất cả phòng ban</option>
                  {departments.map(dep => (
                    <option key={dep.value} value={dep.value}>{dep.label}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              </div>

              {/* Add Button */}
              <div className="mt-4 flex justify-center md:justify-end">
                <button
                  onClick={handleAddUser}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm w-full md:w-auto justify-center"
                  disabled={loading}
                >
                  <Plus className="w-5 h-5" />
                  Thêm User
                </button>
              </div>
            </div>

            {/* Loading indicator */}
            {loading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Đang tải...</p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* User Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">Mã nhân viên</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">Tên đăng nhập</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">Tên người dùng</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">Phòng ban</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">Số điện thoại</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">Email</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">Ngày sinh</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">Địa chỉ</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">Quyền</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">Trạng thái</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUser.map((user) => (
                      <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3 text-xs font-medium text-gray-900">{user.userId}</td>
                        <td className="px-3 py-3 text-xs text-gray-900">{user.userName}</td>
                        <td className="px-3 py-3 text-xs text-gray-900">{user.name}</td>
                        <td className="px-3 py-3 text-xs text-gray-900">{user.department}</td>
                        <td className="px-3 py-3 text-xs text-gray-900">{user.phoneNumber}</td>
                        <td className="px-3 py-3 text-xs text-gray-900">{user.email}</td>
                        <td className="px-3 py-3 text-xs text-gray-900">
                          {user.birthday ? new Date(user.birthday).toLocaleDateString('vi-VN') : ''}
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-900">{user.address}</td>
                        <td className="px-3 py-3 text-xs text-gray-900">
                          {user.isAdmin ? 'Admin' : user.isBuyer ? 'Buyer' : user.isSeller ? 'Seller' : ''}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Sửa"
                              disabled={loading}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.userId)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUser.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Không tìm thấy User nào</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === 'add' ? 'THÊM USER' : 'SỬA USER'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Mã nhân viên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mã nhân viên
                  </label>
                  <input
                    type="text"
                    name="userId"
                    value={modalMode === 'edit' ? formData.userId : ''}
                    disabled
                    placeholder={modalMode === 'add' ? 'Mã sẽ được tạo tự động' : ''}
                    className="w-full px-3 py-2.5 border rounded-lg bg-gray-100 text-sm"
                  />
                </div>
                {/* Tên đăng nhập */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${formErrors.userName ? 'border-red-300' : 'border-gray-200'}`}
                    required
                    disabled={modalMode === 'edit'}
                  />
                  {formErrors.userName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.userName}</p>
                  )}
                </div>
                {/* Mật khẩu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${formErrors.password ? 'border-red-300' : 'border-gray-200'}`}
                    required
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>
                {/* Tên người dùng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tên người dùng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${formErrors.name ? 'border-red-300' : 'border-gray-200'}`}
                    required
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                {/* Phòng ban */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phòng ban <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${formErrors.department ? 'border-red-300' : 'border-gray-200'}`}
                    required
                  >
                    <option value="">Chọn phòng ban</option>
                    {departments.map(dep => (
                      <option key={dep.value} value={dep.value}>{dep.label}</option>
                    ))}
                  </select>
                  {formErrors.department && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
                  )}
                </div>
                {/* Ngày sinh */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${formErrors.email ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                {/* Địa chỉ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                {/* Quyền truy cập */}
                <div className="lg:col-span-2 flex gap-4 items-center mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Quyền truy cập <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleRoleChange}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${formErrors.role ? 'border-red-300' : 'border-gray-200'}`}
                    required
                  >
                    <option value="">Chọn quyền</option>
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  {formErrors.role && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
                  )}
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 ml-4">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                    />
                    Trạng thái
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:bg-gray-400 text-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang xử lý...
                    </span>
                  ) : (
                    modalMode === 'add' ? 'Thêm User' : 'Cập nhật user'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagerment;