import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';


const API = 'http://192.168.1.134:7749/api/v1/user'

// Get auth token from storage
const getAuthToken = () => {
    return AsyncStorage.getItem('auth-token');
};

// Set up axios headers with auth token
const getAuthHeader = () => {
    const token = getAuthToken();
    return {
        headers: {
            'auth-token': token
        }
    };
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API}/login`, { email, password });
        // Store the token
        if (response.data.token) {
            AsyncStorage.setItem('auth-token', response.data.token);
        }
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi đăng nhập');
    }
};

export const registerUser = async (name, email, password) => {
    try {
        const response = await axios.post(`${API}/register`, { name, email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi đăng ký');
    }
};

export const checkAuth = async () => {
    try {
        const response = await axios.get(API, getAuthHeader());
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi xác thực');
    }
};

export const logoutUser = () => {
    AsyncStorage.removeItem('auth-token');
};