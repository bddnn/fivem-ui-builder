// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, getToken, login, register, logout as logoutService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check authentication status on component mount
        const checkAuth = () => {
            const token = getToken();
            const currentUser = getCurrentUser();

            if (token && currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const loginUser = async (username, password) => {
        setLoading(true);
        try {
            const response = await login(username, password);
            setUser(response.user);
            setIsAuthenticated(true);
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const registerUser = async (username, email, password, password2) => {
        setLoading(true);
        try {
            const response = await register(username, email, password, password2);
            setUser(response.user);
            setIsAuthenticated(true);
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await logoutService();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login: loginUser,
            register: registerUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);