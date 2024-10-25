import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

const ProfilePage = ({ isLoggedIn }) => {
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        surname: '',
        email: '',
        address: '',
        city: { id: '', name: '' }
    });

    const [editMode, setEditMode] = useState(false);
    const [updatedInfo, setUpdatedInfo] = useState({
        address: '',
        cityId: ''
    });

    const [cities, setCities] = useState([]); // Şehirler listesi
    const navigate = useNavigate();

    // Müşteri bilgilerini getir
    useEffect(() => {
        const storedEmail = localStorage.getItem('customerEmail');
        if (!isLoggedIn) {
            toast.warn('Lütfen giriş yapın.');
            navigate('/login');
        } else if (storedEmail) {
            setCustomerEmail(storedEmail);
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/shopping/musteriler/me?email=${storedEmail}`);
                    if (response.data) {
                        setCustomerInfo(response.data);
                        setUpdatedInfo({
                            address: response.data.address,
                            cityId: response.data.city?.id || ''
                        });
                    } else {
                        throw new Error('Veri yok');
                    }
                } catch (error) {
                    toast.error('Bilgiler alınırken bir hata oluştu: ' + error.message);
                    console.error(error);
                }
            };

            fetchUserData();
        } else {
            toast.warn('Lütfen giriş yapın.');
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    // Şehir listesini getir
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:8080/shopping/sehirler'); // Şehirleri getiren API
                if (response.data.length > 0) {
                    setCities(response.data);
                } else {
                    throw new Error('Şehirler yüklenemedi.');
                }
            } catch (error) {
                console.error('Şehirler alınırken hata oluştu:', error);
                toast.error('Şehirler yüklenemedi.');
            }
        };
        fetchCities();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedInfo((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8080/shopping/musteriler/me?email=${customerEmail}`, {
                name: customerInfo.name,
                surname: customerInfo.surname,
                email: customerInfo.email,
                address: updatedInfo.address,
                cityId: updatedInfo.cityId
            });
            setCustomerInfo(response.data);
            toast.success('Bilgiler başarıyla güncellendi.');
            setEditMode(false);
        } catch (error) {
            toast.error('Bilgiler güncellenirken bir hata oluştu: ' + error.message);
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Profil Bilgilerim</h2>
            {isLoggedIn && (
                <div className="profile-info">
                    {!editMode ? (
                        <>
                            <p><strong>Ad:</strong> {customerInfo.name}</p>
                            <p><strong>Soyad:</strong> {customerInfo.surname}</p>
                            <p><strong>Email:</strong> {customerInfo.email}</p>
                            <p><strong>Adres:</strong> {customerInfo.address}</p>
                            <p><strong>Şehir:</strong> {customerInfo.city?.name || 'Bilinmiyor'}</p>
                            <button className="btn btn-primary" onClick={() => setEditMode(true)}>Bilgileri Güncelle</button>
                        </>
                    ) : (
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="form-group">
                                <label htmlFor="address">Adres:</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="form-control"
                                    value={updatedInfo.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cityId">Şehir:</label>
                                <select
                                    id="cityId"
                                    name="cityId"
                                    className="form-control"
                                    value={updatedInfo.cityId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Şehir Seçin</option>
                                    {cities.length > 0 ? (
                                        cities.map((city) => (
                                            <option key={city.id} value={city.id}>
                                                {city.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">Şehirler Yükleniyor...</option>
                                    )}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-success">Kaydet</button>
                            <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditMode(false)}>İptal</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
