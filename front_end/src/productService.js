import axios from 'axios';

const API_URL = 'http://localhost:5228/api/product';

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    return null;
  }
};
