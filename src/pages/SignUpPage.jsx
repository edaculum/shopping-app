import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CitySelect from '../pages/CitySelect';

function SignUpPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cityId, setCityId] = useState(''); // Kullanıcının seçtiği şehir ID'sini saklar
    const [adress, setAdress] = useState('');
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
                adress 
            });
            if (response.data) {
                navigate('/login');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                // Eğer backend'den bir hata mesajı geldiyse, bunu errors state'ine atıyoruz
                setErrors(err.response.data);
            }
        }
    };

    return (
        <div>
            <h2>Kayıt Ol</h2>
            <form onSubmit={handleSignUp}>
                <div>
                    <label>Ad</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                </div>
                <div>
                    <label>Soyad</label>
                    <input
                        type="text"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        required
                    />
                    {errors.surname && <p style={{ color: 'red' }}>{errors.surname}</p>}
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                </div>
                <div>
                    <label>Şifre</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                </div>
                <div>
                <label>Şehir:</label>
                    <CitySelect onChange={(value) => setCityId(value)} />
                </div>
                <div>
                    <label>Adres</label>
                    <input
                        type="text"
                        value={adress}
                        onChange={(e) => setAdress(e.target.value)}
                        required
                    />
                    {errors.adress && <p style={{ color: 'red' }}>{errors.adress}</p>}
                </div>
                {errors.error && <p style={{ color: 'red' }}>{errors.error}</p>} {/* Genel hata mesajı */}
                <button type="submit">Kayıt Ol</button>
            </form>
        </div>
    );
}

export default SignUpPage;


