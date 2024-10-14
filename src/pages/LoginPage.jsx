
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import '../css/LoginPage.css'; 

function LoginPage({ setIsLoggedIn, setCustomerId, setUserName,setUserSurname, onClose,fetchBasket }) { // setUserName eklendi// setCustomerId eklendi
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/shopping/musteriler/girisyap', { email, password });
            if (response.data && response.data.id && response.data.name && response.data.surname) { // 'id', 'name' ve 'surname' kontrol ediliyor
                const customerId = response.data.id;
                const name = response.data.name;
                const surname = response.data.surname;
                console.log('Received customerId:', customerId); // Debug log
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('customerId', customerId); // 'customerId' olarak ayarlandı
                localStorage.setItem('userName', name); // userName olarak ayarlandı
                localStorage.setItem('userSurname', surname); // userSurname olarak ayarlandı
                setIsLoggedIn(true);
                setCustomerId(customerId); // customerId'yi state'e set et
                setUserName(name); // userName'i state'e set et
                setUserSurname(surname); // userSurname'i state'e set et

                // Sepet verilerini güncelle
                fetchBasket(customerId); // fetchBasket fonksiyonunu çağırırken customerId parametresi ekleyin

                toast.success(`Başarıyla giriş yaptınız ${name} ${surname}`); // Başarı bildirimi
                onClose(); // Modal'ı kapat
               
                navigate('/shopping/anasayfa');
            } else {
                throw new Error('Müşteri ID veya isim soyisim bulunamadı.')
            }
        } catch (err) {
            console.error('Login error:', err);
            // Backend'den gelen hata mesajı bir obje ise, şu şekilde alabilirsiniz:
            // Eğer sadece string döndürüyorsa, bunu da kontrol etmelisiniz.
            const errorMessage = typeof err.response?.data === 'string' ? err.response.data : (err.response?.data?.message || err.message || 'Bir hata oluştu.');
            setError(errorMessage);
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
                        className={`form-input ${error ? 'input-error' : ''}`}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Şifre</label>
                    <input
                        className={`form-input ${error ? 'input-error' : ''}`}
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




