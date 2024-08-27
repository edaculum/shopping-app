import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css'; 

function LoginPage({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/shopping/musteriler/girisyap', { email, password });
            if (response.data) {
                // başarılı girişte:
                localStorage.setItem('isLoggedIn', 'true');
                setIsLoggedIn(true);
                navigate('/anasayfa');
            }
        } catch (err) {
            setError(err.response?.data || 'Bir hata oluştu.');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Giriş Yap</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Şifre</label>
                    <input
                        className="form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="login-button" type="submit">Giriş Yap</button>
            </form>
        </div>
    );
}

export default LoginPage;

