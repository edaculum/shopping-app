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


function App() {
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]); // Şehirler için state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    return (
        <Router>
            <Header categories={categories} isLoading={isLoading} error={error} isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn} />
            <PageContainer>
                <Routes>
                    <Route path="/anasayfa" element={<HomePage />} />
                    <Route path="shopping/kategoriler/:id" element={<CategoryPage categories={categories} />} />
                    <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} /> {/* Login route eklendi */}
                    <Route path="/signup" element={<SignUpPage cities={cities} />} /> {/* Sign-up route eklendi ve cities props olarak eklendi */}
                  
                    {/* Diğer rotalar */}
                </Routes>
            </PageContainer>
        </Router>
    );
}

export default App;

