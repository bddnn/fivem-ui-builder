import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../pages/styles/Auth.module.css';

const LoginForm = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const { login, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Uzupełnij wszystkie pola!');
            return;
        }
        setError('');
        try {
            await login(username, password);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || 'Coś poszło nie tak, sprawdź wprowadzone dane!');
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>Logowanie</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>Nazwa użytkownika</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Hasło</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Logowanie...' : 'Zaloguj'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
