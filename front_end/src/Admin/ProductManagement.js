import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import MenuAdmin from './MenuAdmin';
import AdminHeader from '../AdminLayout/AdminHeader';
const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [formErrors, setFormErrors] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    title: '',
    message: '',
    productName: '',
    productId: '',
    onConfirm: null
  });
  // API base URL
  const API_BASE_URL = 'http://localhost:5166/api';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    name2: '',
    description: '',
    brandId: '',
    categoryId: '',
    uom: '',
    price1: '',
    dateApply1: '',
    price2: '',
    dateApply2: '',
    urlImage1: '',
    urlImage2: '',
    urlImage3: '',
    userId:'',
    status: true
  });

  // API helper function
  const apiCall = async (url, method = 'GET', data = null) => {
    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  // Notification function
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 5000);
  };

  // Validation function
  const validateProductData = (formData) => {
    const errors = {};
    
    if (!formData.productId?.trim()) {
      errors.productId = 'Mã sản phẩm không được để trống';
    }
    
    if (!formData.name?.trim()) {
      errors.name = 'Tên sản phẩm không được để trống';
    }
    
    if (!formData.categoryId?.trim()) {
      errors.categoryId = 'Danh mục sản phẩm không được để trống';
    }
    
    if (formData.name && formData.name.length > 75) {
      errors.name = 'Tên sản phẩm không được vượt quá 75 ký tự';
    }
    
    if (formData.name2 && formData.name2.length > 75) {
      errors.name2 = 'Tên phụ không được vượt quá 75 ký tự';
    }
    
    if (formData.description && formData.description.length > 1000) {
      errors.description = 'Mô tả không được vượt quá 1000 ký tự';
    }
    
    if (formData.price1 && (isNaN(parseFloat(formData.price1)) || parseFloat(formData.price1) < 0)) {
      errors.price1 = 'Giá 1 phải là số dương hợp lệ';
    }
    
    if (formData.price2 && (isNaN(parseFloat(formData.price2)) || parseFloat(formData.price2) < 0)) {
      errors.price2 = 'Giá 2 phải là số dương hợp lệ';
    }
    
    const urlPattern = /^https?:\/\/.+/;
    if (formData.urlImage1 && !urlPattern.test(formData.urlImage1)) {
      errors.urlImage1 = 'URL hình ảnh 1 không hợp lệ';
    }
    
    if (formData.urlImage2 && !urlPattern.test(formData.urlImage2)) {
      errors.urlImage2 = 'URL hình ảnh 2 không hợp lệ';
    }
    
    if (formData.urlImage3 && !urlPattern.test(formData.urlImage3)) {
      errors.urlImage3 = 'URL hình ảnh 3 không hợp lệ';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

// function fetchProducts
const fetchProducts = async () => {
  setLoading(true);
  setError('');
  try {
    const response = await apiCall(`${API_BASE_URL}/products`);
    
    // Kiểm tra cấu trúc response
    console.log('API Response:', response);
    
    // Lấy array từ response.data thay vì response trực tiếp
    const productsArray = response.data || [];
    setProducts(productsArray);
    
  } catch (err) {
    setError('Không thể tải danh sách sản phẩm: ' + err.message);
    showNotification('Không thể tải danh sách sản phẩm', 'error');
    setProducts([]); // Set empty array on error
  } finally {
    setLoading(false);
  }
};

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const data = await apiCall(`${API_BASE_URL}/categories`);
      console.log('Categories data:', data); // Debug
      
      // Lưu toàn bộ object thay vì chỉ tên
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setBrands([
        { brandId: '1', brandName: 'Lego' },
      ]);
    }
  };

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      const data = await apiCall(`${API_BASE_URL}/brands`);
      console.log('Brands data:', data); // Debug
      
      // Lưu toàn bộ object thay vì chỉ tên
      setBrands(data);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setBrands([
        { brandId: '1', brandName: 'Lego' },
      ]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  // Filter products
const filteredProducts = products.filter(product => {
  return (
    // Search
    (product.productId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    
    // Category - Convert ID to Name
    (categoryFilter === '' || 
     product.categoryName === categories.find(cat => cat.categoryId === categoryFilter)?.categoryName) &&
    
    // Brand - Convert ID to Name
    (brandFilter === '' || 
     product.brandName === brands.find(brand => brand.brandId === brandFilter)?.brandName) &&
    
    // Status
    (statusFilter === '' || product.status.toString() === statusFilter)
  );
});

  // Handle add product
  const handleAddProduct = () => {
    setModalMode('add');
    setFormData({
      productId: '',
      name: '',
      name2: '',
      description: '',
      brandId: '',
      categoryId: '',
      uom: '',
      price1: '',
      dateApply1: '',
      price2: '',
      dateApply2: '',
      urlImage1: '',
      urlImage2: '',
      urlImage3: '',
      status: true
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    const selectedCategory = categories.find(cat => cat.categoryName === product.categoryName);
    const selectedBrand = brands.find(brand => brand.brandName === product.brandName);
    setFormData({
      productId: product.productId,
      name: product.name,
      name2: product.name2 || '',
      description: product.description || '',
      brandId: selectedBrand?.brandId || '',      // Tìm brandId từ brandName
      categoryId: selectedCategory?.categoryId || '', // Tìm categoryId từ categoryName
      uom: product.uom || '',
      price1: product.price1 || '',
      dateApply1: product.dateApply1 ? new Date(product.dateApply1).toISOString().split('T')[0] : '',
      price2: product.price2 || '',
      dateApply2: product.dateApply2 ? new Date(product.dateApply2).toISOString().split('T')[0] : '',
      urlImage1: product.urlImage1 || '',
      urlImage2: product.urlImage2 || '',
      urlImage3: product.urlImage3 || '',
      userId: '5',
      status: product.status
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
  // Tìm tên sản phẩm
  const product = products.find(p => p.productId === productId);
  const productName = product ? product.name : 'sản phẩm này';
  
  // Hiển thị confirm dialog
  setConfirmDialog({
    show: true,
    productName: productName,
    onConfirm: () => performDelete(productId)
  });
};

const performDelete = async (productId) => {
  try {
    setLoading(true);
    setConfirmDialog({ show: false });
    
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      await fetchProducts();
      showNotification('Xóa sản phẩm thành công!', 'success');
    } else {
      showNotification(result.message || 'Không thể xóa sản phẩm', 'error');
    }
    
  } catch (error) {
    showNotification('Có lỗi xảy ra khi xóa sản phẩm', 'error');
  } finally {
    setLoading(false);
  }
};

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setLoading(true);

    const validation = validateProductData(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      showNotification('Vui lòng kiểm tra lại thông tin nhập vào', 'error');
      return;
    }

      const productData = {
        productId: formData.productId,
        name: formData.name,
        name2: formData.name2 || null,
        description: formData.description || null,
        brandId: formData.brandId || null,
        categoryId: formData.categoryId,
        groupTb1: null,
        groupTb2: null,
        groupTb3: null,
        groupTb4: null,
        uom: formData.uom || null,
        price1: formData.price1 ? parseFloat(formData.price1) : null,
        dateApply1: formData.dateApply1 ? new Date(formData.dateApply1).toISOString() : null,
        price2: formData.price2 ? parseFloat(formData.price2) : null,
        dateApply2: formData.dateApply2 ? new Date(formData.dateApply2).toISOString() : null,
        urlImage1: formData.urlImage1 || null,
        urlImage2: formData.urlImage2 || null,
        urlImage3: formData.urlImage3 || null,
        userId: '5',
        status: formData.status
      };

      await apiCall(`${API_BASE_URL}/products/upsert`, 'POST', productData);
      
      setShowModal(false);
      setFormData({});
      setFormErrors({});
      
      await fetchProducts();
      
      const message = modalMode === 'add' 
        ? 'Thêm sản phẩm thành công!' 
        : 'Cập nhật sản phẩm thành công!';
      showNotification(message, 'success');
      
    } catch (error) {
      console.error('Error:', error);
      
      let errorMessage = 'Có lỗi xảy ra';
      
      if (error.message.includes('không có quyền')) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Dữ liệu không hợp lệ';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
    showNotification(errorMessage, 'error');
  } finally {
    setLoading(false);
  }
};

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
  <>
    <AdminHeader />
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
          notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
          'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

       {/* Confirm Dialog */} 
        {confirmDialog.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-sm lg:max-w-md shadow-2xl">
              <h3 className="text-base lg:text-lg font-semibold mb-3 text-gray-900">Xác nhận xóa</h3>
              <p className="text-sm lg:text-base text-gray-600 mb-4 leading-relaxed">
              Bạn có chắc chắn muốn xóa "
              <span className="font-medium text-gray-800">{confirmDialog.productName}</span>
              "?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog({ show: false })}
                className="flex-1 px-3 lg:px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm lg:text-base"
              >
                Hủy
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="flex-1 px-3 lg:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm lg:text-base"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sử dụng MenuAdmin component */}
      <MenuAdmin activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {activeTab === 'products' && (
          <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-6 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Quản lý sản phẩm</h2>
              <p className="text-sm lg:text-base text-gray-600">Quản lý toàn bộ sản phẩm trong cửa hàng</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
                {/* Search */}
                <div className="md:col-span-2 lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Tìm theo mã hoặc tên sản phẩm..."
                      className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 lg:px-4 py-2.5 lg:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                >
                  <option value="">Tất cả loại sản phẩm</option>
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>

                {/* Brand Filter */}
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="px-3 lg:px-4 py-2.5 lg:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                >
                  <option value="">Tất cả thương hiệu</option>
                  {brands.map(cat => (
                    <option key={cat.brandId} value={cat.brandId}>
                      {cat.brandName}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 lg:px-4 py-2.5 lg:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              </div>

              {/* Add Button */}
              <div className="mt-4 flex justify-center md:justify-end">
                <button
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm lg:text-base w-full md:w-auto justify-center"
                  disabled={loading}
                >
                  <Plus className="w-5 h-5" />
                  Thêm sản phẩm
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

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-900">Mã sản phẩm</th>
                      <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-900">Tên sản phẩm</th>
                      <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-900">Danh mục</th>
                      <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-900">Thương hiệu</th>
                      <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-900">Giá bán</th>
                      <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-900">Hình ảnh</th>
                      <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-900">Trạng thái</th>
                      <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-900">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">{product.productId}</td>
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-900">{product.name}</td>
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-900">{product.categoryName}</td>
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-900">{product.brandName}</td>
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-blue-600">
                          {product.price1 ? `${product.price1.toLocaleString()} VNĐ` : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          {product.urlImage1 ? (
                            <img
                              src={product.urlImage1}
                              alt={product.name}
                              className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x64/gray/white?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 lg:px-3 py-1 text-xs font-medium rounded-full ${
                            product.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.status ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 lg:gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-1.5 lg:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Sửa"
                              disabled={loading}
                            >
                              <Edit className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.productId)}
                              className="p-1.5 lg:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                              disabled={loading}
                            >
                              <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 lg:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                {modalMode === 'add' ? 'THÊM SẢN PHẨM' : 'SỬA SẢN PHẨM'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

              <form onSubmit={handleSubmit} className="p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Mã sản phẩm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    Mã sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className={`w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                      formErrors.productId ? 'border-red-300' : 'border-gray-200'
                    }`}
                    required
                    disabled={modalMode === 'edit'}
                  />
                  {formErrors.productId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.productId}</p>
                  )}
                </div>

                {/* Tên sản phẩm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                      formErrors.name ? 'border-red-300' : 'border-gray-200'
                    }`}
                    required
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Tên phụ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    Tên phụ
                  </label>
                  <input
                    type="text"
                    name="name2"
                    value={formData.name2}
                    onChange={handleInputChange}
                    className={`w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${formErrors.name2 ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {formErrors.name2 && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name2}</p>
                  )}
                </div>
                
                {/* Danh mục */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className={`w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${formErrors.categoryId ? 'border-red-300' : 'border-gray-200'}`}
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                    ))}
                  </select>
                  {formErrors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.categoryId}</p>
                  )}
                </div>
                
                {/* Thương hiệu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    Thương hiệu
                  </label>
                  <select
                    name="brandId"
                    value={formData.brandId}
                    onChange={handleInputChange}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map(sup => (
                      <option key={sup.brandId} value={sup.brandId}>{sup.brandName}</option>
                    ))}
                  </select>
                </div>

                {/* Đơn vị tính */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    Đơn vị tính
                  </label>
                  <input
                    type="text"
                    name="uom"
                    value={formData.uom}
                    onChange={handleInputChange}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                    placeholder="VD: Cái, Hộp, Chiếc..."
                  />
                </div>

                {/* Giá 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    Giá bán
                  </label>
                  <input
                    type="number"
                    name="price1"
                    value={formData.price1}
                    onChange={handleInputChange}
                    className={`w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${formErrors.price1 ? 'border-red-300' : 'border-gray-200'}`}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                  {formErrors.price1 && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price1}</p>
                  )}
                </div>

                {/* Ngày apply 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    Ngày áp dụng giá
                  </label>
                  <input
                    type="date"
                    name="dateApply1"
                    value={formData.dateApply1}
                    onChange={handleInputChange}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  />
                </div>

                {/* Giá 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    Giá thay thế
                  </label>
                  <input
                    type="number"
                    name="price2"
                    value={formData.price2}
                    onChange={handleInputChange}
                    className={`w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${formErrors.price2 ? 'border-red-300' : 'border-gray-200'}`}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                  {formErrors.price2 && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price2}</p>
                  )}
                </div>

                {/* Ngày apply 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    Ngày áp dụng giá thay thế
                  </label>
                  <input
                    type="date"
                    name="dateApply2"
                    value={formData.dateApply2}
                    onChange={handleInputChange}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  />
                </div>

                {/* Mô tả */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${formErrors.description ? 'border-red-300' : 'border-gray-200'}`}
                    rows="3"
                    placeholder="Mô tả chi tiết về sản phẩm..."
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                  )}
                </div>

                {/* Hình ảnh 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    URL Hình ảnh 1
                  </label>
                  <input
                    type="url"
                    name="urlImage1"
                    value={formData.urlImage1}
                    onChange={handleInputChange}
                    className={`w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${formErrors.urlImage1 ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="https://example.com/image1.jpg"
                  />
                  {formErrors.urlImage1 && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.urlImage1}</p>
                  )}

                {/* Hiển thị hình ảnh nếu có URL */}
                {formData.urlImage1 && (
                  <div className="mt-3 lg:mt-4">
                    <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                      <img
                        src={formData.urlImage1}
                        alt="Xem trước"
                        className="absolute inset-0 w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none'; // Ẩn ảnh nếu URL lỗi
                        }}
                      />
                    </div>
                  </div>
                )}
                </div>


                {/* Hình ảnh 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    URL Hình ảnh 2
                  </label>
                  <input
                    type="url"
                    name="urlImage2"
                    value={formData.urlImage2}
                    onChange={handleInputChange}
                    className={`w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${formErrors.urlImage2 ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="https://example.com/image2.jpg"
                  />
                  {formErrors.urlImage2 && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.urlImage2}</p>
                  )}
                {/* Hiển thị hình ảnh nếu có URL */}
                {formData.urlImage2 && (
                <div className="mt-3 lg:mt-4">
                    <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                      <img
                        src={formData.urlImage2}
                        alt="Xem trước"
                        className="absolute inset-0 w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none'; // Ẩn ảnh nếu URL lỗi
                        }}
                      />
                    </div>
                  </div>
                )}
                </div>

                {/* Hình ảnh 3 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2">
                    URL Hình ảnh 3
                  </label>
                  <input
                    type="url"
                    name="urlImage3"
                    value={formData.urlImage3}
                    onChange={handleInputChange}
                    className={`w-full px-3 lg:px-4 py-2.5 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${formErrors.urlImage3 ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="https://example.com/image3.jpg"
                  />
                  {formErrors.urlImage3 && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.urlImage3}</p>
                  )}
                {/* Hiển thị hình ảnh nếu có URL */}
                {formData.urlImage3 && (
                  <div className="mt-3 lg:mt-4">
                    <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                      <img
                        src={formData.urlImage3}
                        alt="Xem trước"
                        className="absolute inset-0 w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none'; // Ẩn ảnh nếu URL lỗi
                        }}
                      />
                    </div>
                  </div>
                )}
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="flex items-center gap-2 text-sm lg:text-base font-medium text-gray-700">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                    />
                    Trạng thái hoạt động
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row justify-end gap-3 lg:gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-4 lg:px-6 py-2.5 lg:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm lg:text-base"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:bg-gray-400 text-sm lg:text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang xử lý...
                    </span>
                  ) : (
                    modalMode === 'add' ? 'Thêm sản phẩm' : 'Cập nhật sản phẩm'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
  export default ProductManagement;