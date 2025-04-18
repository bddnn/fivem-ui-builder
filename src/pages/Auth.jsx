import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import styles from './styles/Auth.module.css';

const Auth = () => {
    const [mode, setMode] = useState('login');
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();

    if (isAuthenticated && !loading) {
        return <Navigate to="/" />;
    }

    const handleAuthSuccess = () => {
        navigate('/');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.authContainer}>
            <div className={styles.authHeader}>
                <h1>softHeads - CMS</h1>
                <div className={styles.authModeButtons}>
                    <button
                        className={`${styles.authModeButton} ${mode === 'login' ? styles.active : ''}`}
                        onClick={() => setMode('login')}
                    >
                        Logowanie
                    </button>
                    <button
                        className={`${styles.authModeButton} ${mode === 'register' ? styles.active : ''}`}
                        onClick={() => setMode('register')}
                    >
                        Rejestracja
                    </button>
                </div>
            </div>
            <div className={styles.authContent}>
                {mode === 'login' ? (
                    <LoginForm onSuccess={handleAuthSuccess} />
                ) : (
                    <RegisterForm onSuccess={handleAuthSuccess} />
                )}
            </div>
        </div>
    );
};

export default Auth;
