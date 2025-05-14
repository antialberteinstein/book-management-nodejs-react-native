import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://192.168.1.134:7749/api/v1/book'

// Get auth token from storage
const getAuthToken = async () => {
    try {
        return await AsyncStorage.getItem('@auth_token');
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

// Set up axios headers with auth token
const getAuthHeader = async () => {
    const token = await getAuthToken();
    return {
        headers: {
            'auth-token': token
        }
    };
};

// Get all books
export const getAllBooks = async () => {
    try {
        const headers = await getAuthHeader();
        const response = await axios.get(API, headers);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách sách');
    }
};

// Get book by ID
export const getBookById = async (id) => {
    try {
        const headers = await getAuthHeader();
        const response = await axios.get(`${API}/${id}`, headers);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin sách');
    }
};

// Create new book
export const createBook = async (bookData) => {
    try {
        const headers = await getAuthHeader();
        const response = await axios.post(`${API}/create`, bookData, headers);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi tạo sách mới');
    }
};

// Update book
export const updateBook = async (id, bookData) => {
    try {
        const headers = await getAuthHeader();
        const response = await axios.put(`${API}/${id}`, bookData, headers);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật sách');
    }
};

// Delete book
export const deleteBook = async (id) => {
    try {
        const headers = await getAuthHeader();
        const response = await axios.delete(`${API}/${id}`, headers);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi xóa sách');
    }
};
