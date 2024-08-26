import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Hata mesajını tutacak state
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/shopping/musteriler/girisyap', { email, password }); // Backend'deki login endpoint'i kullanılıyor
            if (response.data) {
                navigate('/anasayfa'); // Giriş başarılı olursa ana sayfaya yönlendir
            }
        }catch (err) {
            // Hata varsa, mesajı setError ile state'e aktar
            setError(err.response.data); // Backend'den dönen hata mesajı
        }
    };

    return (
        <div>
            <h2>Giriş Yap</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Şifre</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Giriş Yap</button>
            </form>
        </div>
    );
}

export default LoginPage;
