// src/pages/HomeDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MenuAdmin from '../Admin/MenuAdmin';
import AdminHeader from '../AdminLayout/AdminHeader';

const COLORS = ['#FFA500', '#00C49F', '#0088FE']; // Màu cho từng trạng thái

const HomeDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    ordersPending: 0,
    ordersInProgress: 0,
    ordersCompleted: 0,
    totalEmployees: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5166/api/Dashboard/metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Chuẩn bị dữ liệu cho pie chart
  const statusData = [
    { name: 'Chưa giao', value: metrics.ordersPending },
    { name: 'Đang giao', value: metrics.ordersInProgress },
    { name: 'Đã giao', value: metrics.ordersCompleted }
  ];

  return (
    <>
    <AdminHeader />
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar/Menu bên trái */}
      <MenuAdmin activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Nội dung chính */}
      <div className="flex-1 p-6">
        {activeTab === 'dashboard' && (
          <>
            {loading ? (
              <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <>
                {/* Grid các cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {/* SẢN PHẨM */}
                  <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                    <span className="text-sm font-medium text-gray-500">TỔNG SẢN PHẨM</span>
                    <span className="mt-2 text-3xl font-bold text-gray-800">
                      {metrics.totalProducts}
                    </span>
                  </div>

                  {/* ĐƠN HÀNG (tổng) */}
                  <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                    <span className="text-sm font-medium text-gray-500">TỔNG ĐƠN HÀNG</span>
                    <span className="mt-2 text-3xl font-bold text-gray-800">
                      {metrics.totalOrders}
                    </span>
                  </div>

                  {/* NHÂN VIÊN */}
                  <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                    <span className="text-sm font-medium text-gray-500">TỔNG QUẢN TRỊ BÁN HÀNG</span>
                    <span className="mt-2 text-3xl font-bold text-gray-800">
                      {metrics.totalEmployees}
                    </span>
                  </div>

                  {/* ĐƠN HÀNG CHƯA GIAO */}
                  <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                    <span className="text-sm font-medium text-gray-500">CHƯA GIAO</span>
                    <span className="mt-2 text-3xl font-bold text-gray-800">
                      {metrics.ordersPending}
                    </span>
                  </div>

                  {/* ĐANG GIAO */}
                  <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                    <span className="text-sm font-medium text-gray-500">ĐANG GIAO</span>
                    <span className="mt-2 text-3xl font-bold text-gray-800">
                      {metrics.ordersInProgress}
                    </span>
                  </div>

                  {/* ĐÃ GIAO */}
                  <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                    <span className="text-sm font-medium text-gray-500">ĐÃ GIAO</span>
                    <span className="mt-2 text-3xl font-bold text-gray-800">
                      {metrics.ordersCompleted}
                    </span>
                  </div>


                </div>

                {/* Pie Chart: Tỷ lệ trạng thái đơn hàng */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    Tỷ lệ Đơn hàng theo Trạng thái
                  </h4>
                  <div className="w-full h-64">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={statusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {statusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Số lượng']} />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value) => <span className="text-sm">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* (Bạn có thể thêm biểu đồ khác ở đây nếu cần) */}
              </>
            )}
          </>
        )}

        {activeTab === 'orders' && (
          <div className="text-center text-gray-500">
            Trang Đơn hàng (chưa triển khai trong HomeDashboard)
          </div>
        )}
      </div>
    </div>
  </>
  );
};

export default HomeDashboard;
