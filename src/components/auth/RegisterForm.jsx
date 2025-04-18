import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../pages/styles/Auth.module.css';

const RegisterForm = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail]     = useState('');
    const [password, setPassword]   = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const { register, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !password || !password2) {
            setError('Proszę wypełnić wszystkie pola !');
            return;
        }
        if (password !== password2) {
            setError('Hasła się nie zgadzają');
            return;
        }
        setError('');
        try {
            await register(username, email, password, password2);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || 'Rejestracja nie powiodła się, spróbuj ponownie!');
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>Rejestracja</h2>
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
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <div className={styles.inputGroup}>
                    <label>Potwierdź hasło</label>
                    <input
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Rejestrowanie...' : 'Zarejestruj'}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
