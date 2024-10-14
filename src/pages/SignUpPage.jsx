
// src/pages/SignUpPage.jsx
import React, { useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CitySelect from '../pages/CitySelect'; // CitySelect bileşenini doğru yolda import edin
import '../css/SignUpPage.css'; // CSS dosyasını import edin

function SignUpPage({ onClose, fetchBasket }) { // fetchBasket prop'u eklendi
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cityId, setCityId] = useState(''); // Kullanıcının seçtiği şehir ID'sini saklar
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/shopping/musteriler/kayitol', { 
                name, 
                surname, 
                email, 
                password, 
                cityId, 
                adress: address // "address" yerine "adress" kullanıldı
            });
            // Başarılı olursa, yönlendirme yapılır
            if (response.data) {
                // Kayıt başarılı, modal'ı kapat
                onClose();
                navigate('/login');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                console.log('Hata:', err.response.data);  // Hata mesajlarını kontrol edin
                setErrors(err.response.data); // Backend'den gelen hatalar state'e set edilir
            }
        }
    };

    return (
        <div className="signup-container">
            <h2>Kayıt Ol</h2>
            <form onSubmit={handleSignUp} className="signup-form">
                <div className="form-group">
                    <label>Ad</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={`input-field ${errors.name ? 'input-error' : ''}`}
                    />
                    {errors.name && <p className="error-text">{errors.name}</p>}  {/* Hata mesajını göster */}
                </div>
                <div className="form-group">
                    <label>Soyad</label>
                    <input
                        type="text"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        required
                        className={`input-field ${errors.surname ? 'input-error' : ''}`} // Hata varsa input'a özel sınıf ekle
                    />
                    {errors.surname && <p className="error-text">{errors.surname}</p>}
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={`input-field ${errors.email ? 'input-error' : ''}`}
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
                <div className="form-group">
                    <label>Şifre</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`input-field ${errors.password ? 'input-error' : ''}`}
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                </div>
                <div className="form-group">
                    <label>Şehir:</label>
                    <CitySelect onChange={(value) => setCityId(value)} className="input-field" />
                    {errors.cityId && <p className="error-text">{errors.cityId}</p>} {/* Şehir hata mesajı */}
                </div>
                <div className="form-group">
                    <label>Adres</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className={`input-field ${errors.adress ? 'input-error' : ''}`} // "address" yerine "adress" kontrolü
                    />
                    {errors.adress && <p className="error-text">{errors.adress}</p>}
                </div>
                {errors.error && <p className="error-text">{errors.error}</p>} {/* Genel hata mesajı */}
                <button type="submit" className="signup-button">Kayıt Ol</button>
            </form>
        </div>
    );
}

export default SignUpPage;




