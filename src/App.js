
// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import CategoryPage from './pages/CategoryPage';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import PageContainer from './container/PageContainer';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Axios baseURL ayarlayın
axios.defaults.baseURL = 'http://localhost:8080'; // Backend'inizin çalıştığı URL
axios.defaults.withCredentials = true; // Eğer JWT veya cookie kullanıyorsanız

function App() {
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]); // Şehirler için state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [customerId, setCustomerId] = useState(null);  // customerId state'ini ekledik
    const [userName, setUserName] = useState(''); // userName state'i eklendi
    const [userSurname, setUserSurname] = useState(''); // userSurname state'i eklendi
    const [basket, setBasket] = useState(null);  // Sepet için state

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Kategoriler için API çağrısı
                const categoryResponse = await axios.get('/shopping/kategoriler');
                setCategories(categoryResponse.data);
                
                // Şehirler için API çağrısı
                const cityResponse = await axios.get('/shopping/sehirler');
                setCities(cityResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const savedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(savedIsLoggedIn);

        if (savedIsLoggedIn) {
            const savedCustomerId = localStorage.getItem('customerId'); // 'customerId' olarak ayarlandı
            const savedUserName = localStorage.getItem('userName') || ''; // userName alındı
            const savedUserSurname = localStorage.getItem('userSurname') || ''; // userSurname alındı
            setCustomerId(savedCustomerId);
            setUserName(savedUserName);
            setUserSurname(savedUserSurname);
            console.log('Saved customerId:', savedCustomerId); // Debug log

            // Fetch basket when user is logged in
            fetchBasket(savedCustomerId);
        }
    }, []);

    const fetchBasket = async (customerId) => {
        try {
            const response = await axios.get(`/shopping/sepet/${customerId}`);
            console.log('Sepet yanıtı:', response.data);
            setBasket(response.data);
        } catch (error) {
            console.error('Sepet yüklenirken bir hata oluştu:', error);
            setBasket(null);
        }
    };

    const addToCart = async (productId, count = 1) => {
        if (!isLoggedIn) {
            alert('Lütfen giriş yapın.');
            return;
        }

        if (!customerId) {
            alert('Müşteri ID bulunamadı.');
            return;
        }

        try {
            const response = await axios.post('/shopping/sepet/sepeteEkle', null, {
                params: {
                    customerId: customerId,
                    productId: productId,
                    count: count
                }
            });
            console.log("Sepete ürün eklendi:", response.data);
            setBasket(response.data);
            // Bildirim göster
            toast.success('Ürün başarıyla sepete eklenmiştir.');
        } catch (error) {
            console.error("Sepete ürün eklenirken hata oluştu:", error);
            toast.error("Sepete ürün eklenirken hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    const addOrder = async () => {
        if (!isLoggedIn || !customerId || !basket || basket.basketItems.length === 0) {
            alert('Sipariş verebilmek için giriş yapmalı ve sepetinizde ürün bulunmalıdır.');
            return;
        }

        try {
            const response = await axios.post('/shopping/siparis/siparisOlustur', null, {
                params: {
                    customerId: customerId
                }
            });
            toast.success('Siparişiniz başarıyla verildi.');
            setBasket({ ...basket, basketItems: [] });  // Siparişi verdikten sonra sepeti temizle
            console.log('Sipariş oluşturuldu:', response.data);
        } catch (error) {
            console.error('Sipariş verirken hata oluştu:', error);
            toast.error('Sipariş verirken bir hata oluştu.');
        }
    };

    return (
        <Router>
            <Header 
                categories={categories} 
                isLoading={isLoading} 
                error={error} 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn} 
                setCustomerId={setCustomerId}
                setUserName={setUserName} // setUserName prop ekledik
                setUserSurname={setUserSurname} // setUserSurname prop ekledik
                userName={userName} // userName prop ekledik
                userSurname={userSurname} // userSurname prop ekledik
                basket={basket} // Sepet bilgilerini Header'a gönderiyoruz
            />
            <PageContainer>
                <Routes>
                    <Route path="/shopping/anasayfa" element={<HomePage addToCart={addToCart} />} />
                    <Route path="/shopping/kategoriler/:id" element={<CategoryPage categories={categories} addToCart={addToCart} />} />
                    <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setCustomerId={setCustomerId} setUserName={setUserName} setUserSurname={setUserSurname} onClose={() => {}} fetchBasket={fetchBasket} />} />
                    <Route path="/signup" element={<SignUpPage cities={cities} fetchBasket={fetchBasket} />} />
                    <Route path="/cart" element={<CartPage customerId={customerId} setBasket={setBasket} addOrder={addOrder} />} />
                    <Route path="/orders" element={<OrderPage customerId={customerId} />} />
                    <Route path="/" element={<div>Ana Sayfa</div>} />
                </Routes>
            </PageContainer>
            <ToastContainer /> {/* ToastContainer ekleyin */}
        </Router>
    );
}

export default App;



