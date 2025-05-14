import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/authService';

const AuthContext = createContext(null);

// Storage keys
const USER_KEY = '@auth_user';
const TOKEN_KEY = '@auth_token';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start with loading true
    const [error, setError] = useState(null);

    // Load stored user data on app start
    useEffect(() => {
        loadStoredUser();
    }, []);

    const loadStoredUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem(USER_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error('Error loading stored user:', err);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await loginUser(email, password);
            
            // Store user data
            const userData = response.user;
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
            
            // Store token if available
            if (response.token) {
                await AsyncStorage.setItem(TOKEN_KEY, response.token);
            }
            
            setUser(userData);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Clear stored data
            await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
            setUser(null);
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 