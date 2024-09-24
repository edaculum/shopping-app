import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import CategoryPage from './pages/CategoryPage';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import PageContainer from './container/PageContainer';
import LoginPage from './pages/LoginPage'; // LoginPage eklendi
import SignUpPage from './pages/SignUpPage'; // SignUpPage eklendi
import CartPage from './pages/CartPage'; // Sepet sayfası
import OrderPage from './pages/OrderPage'; // Sipariş sayfası

function App() {
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]); // Şehirler için state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [customerId, setCustomerId] = useState(null);  // customerId state'ini ekledik
    const [cart, setCart] = useState([]);  // Sepet için state

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
            const savedCustomerId = localStorage.getItem('userId'); // Burada userId kullanıyoruz
            setCustomerId(savedCustomerId);
            console.log('Saved customerId:', savedCustomerId); // Debug log
        }
    }, []);

    const addToCart = async (productId, count) => {
        if (!isLoggedIn) {
            alert('Lütfen giriş yapın.');
            return;
        }

        if (!customerId) {
            alert('Müşteri ID bulunamadı.');
            return;
        }

        try {
            await axios.post('/shopping/sepet/sepeteEkle', { customerId, productId, count });
            setCart((prevCart) => [...prevCart, { productId, count }]);
        } catch (error) {
            console.error('Sepete ürün eklenirken hata oluştu:', error);
        }
    };

    const addOrder = async () => {
        if (!isLoggedIn || !customerId || cart.length === 0) {
            alert('Sipariş verebilmek için giriş yapmalı ve sepetinizde ürün bulunmalıdır.');
            return;
        }

        try {
            await axios.post('/shopping/siparis/ekle', { customerId, products: cart });
            alert('Siparişiniz başarıyla verildi.');
            setCart([]);  // Siparişi verdikten sonra sepeti temizle
        } catch (error) {
            console.error('Sipariş verirken hata oluştu:', error);
            alert('Sipariş verirken bir hata oluştu.');
        }
    };

    return (
        <Router>
            <Header categories={categories} isLoading={isLoading} error={error} isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn} />
            <PageContainer>
                <Routes>
                    <Route path="/shopping/anasayfa" element={<HomePage addToCart={addToCart} />} /> {/* Sepete ekleme fonksiyonu gönderiliyor */}
                    <Route path="/shopping/kategoriler/:id" element={<CategoryPage categories={categories} addToCart={addToCart} />} />
                    <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setCustomerId={setCustomerId} />} /> {/* Login route eklendi */}
                    <Route path="/signup" element={<SignUpPage cities={cities} />} /> {/* Sign-up route eklendi ve cities props olarak eklendi */}
                    <Route path="/cart" element={<CartPage customerId={customerId} addOrder={addOrder} />} /> {/* Sepet sayfası */}
                    <Route path="/orders" element={<OrderPage customerId={customerId} />} />
                    <Route path="/" element={<div>Ana Sayfa</div>} />
                </Routes>
            </PageContainer>
        </Router>
    );
}

export default App;


