// src/services/authService.js

const API_URL = `${import.meta.env.VITE_API_SERVICE}auth/`;

// Get stored token from localStorage
export const getToken = () => {
    return localStorage.getItem('auth_token');
};

// Store authentication data
export const setAuthData = (token, userData) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
};

// Clear authentication data
export const clearAuthData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
};

// Register new user
export const register = async (username, email, password, password2) => {
    console.log(username,email,password,password2)
    try {
        const response = await fetch(`${API_URL}register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, password2, email }),
        });

        console.log(JSON.stringify(response) + " odpoiwiedz ");
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }

        const data = await response.json();
        setAuthData(data.token, data.user);
        return data;
    } catch (error) {
        throw error;
    }
};

// Login user
export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();
        setAuthData(data.token, data.user);
        return data;
    } catch (error) {
        throw error;
    }
};

// Logout user
export const logout = async () => {
    try {
        const token = getToken();
        if (token) {
            await fetch(`${API_URL}logout/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
        }
        clearAuthData();
    } catch (error) {
        console.error('Logout error:', error);
        clearAuthData();
    }
};