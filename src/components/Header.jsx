
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaShoppingBasket, FaUser } from 'react-icons/fa'; // Doğru ikonları import ettik
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import LoginPage from '../pages/LoginPage'; // LoginPage bileşenini import ettik
import SignUpPage from '../pages/SignUpPage'; // SignUpPage bileşenini import ettik
import '../App.css'; 

function Header({categories = [], isLoading = false, error = null, isLoggedIn = false, setIsLoggedIn, setCustomerId, setUserName,setUserSurname, userName,userSurname,  basket }) { // setCustomerId eklendi, setUserSurname ve userSurname eklendi
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    useEffect(() => {
        // Sayfa yüklendiğinde, localStorage'dan giriş durumunu oku
        const savedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(savedIsLoggedIn);
    }, [setIsLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn'); // Kullanıcı çıkış yaptığında localStorage'dan durumu kaldır
        localStorage.removeItem('customerId'); // customerId'yi de kaldır
        localStorage.removeItem('userName'); // userName'i de kaldır
        localStorage.removeItem('userSurname'); // userSurname'i de kaldır
        setIsLoggedIn(false); // Çıkış yapıldığında kullanıcıyı çıkış yapmış olarak işaretle
        setCustomerId(null); // customerId'yi sıfırla
        setUserName(''); // userName'i sıfırla
        setUserSurname(''); // userSurname'i sıfırla
        toast.info("Başarıyla çıkış yaptınız.");
    };

    // Toplam sepet sayısını hesaplama
    const cartCount = basket && basket.basketItems
        ? basket.basketItems.reduce((total, item) => total + item.count, 0)
        : 0;

    return (
        <header className="App-header">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                    <Link to="/shopping" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                        <h2>MyShop</h2>
                    </Link>

                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li>
                            <Link to="/shopping/anasayfa" className="nav-link px-2 text-white">Anasayfa</Link>
                        </li>
                        <li className="dropdown">
                            <button className="nav-link dropdown-toggle btn text-white border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: '#091a3b' }}>
                                Kategoriler
                            </button>
                            <ul className="dropdown-menu">
                                {isLoading ? (
                                    <li><span className="dropdown-item">Loading...</span></li>
                                ) : error ? (
                                    <li><span className="dropdown-item">Error loading categories</span></li>
                                ) : categories.length > 0 ? (
                                    categories.map(category => (
                                        <li key={category.id}>
                                            <Link to={`shopping/kategoriler/${category.id}`} className="dropdown-item">{category.name}</Link>
                                        </li>
                                    ))
                                ) : (
                                    <li><span className="dropdown-item">Kategoriler Yüklenemedi</span></li>
                                )}
                            </ul>
                        </li>
                    </ul>

                    <div className="text-end ms-auto d-flex align-items-center">
                        {isLoggedIn ? (
                            <li className="dropdown me-2">
                                <button className="nav-link dropdown-toggle btn text-white border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: '#091a3b' }}>
                                    <FaUser /> Hesabım
                                </button>
                                <ul className="dropdown-menu">
                                    <li><Link to="/profile" className="dropdown-item">Kullanıcı Bilgilerim</Link></li>
                                    <li><Link to="/orders" className="dropdown-item">Siparişlerim</Link></li>
                                    <li><Link to="/order-history" className="dropdown-item">Geçmiş Siparişlerim</Link></li>
                                    <li><button onClick={handleLogout} className="dropdown-item">Çıkış Yap</button></li>
                                </ul>
                            </li>
                        ) : (
                            <div>
                                <Button variant="outline-light" className="me-2" onClick={() => setIsLoginModalOpen(true)}>Login</Button>
                                <Button variant="outline-light" onClick={() => setIsSignUpModalOpen(true)}>Sign-up</Button>
                            </div>
                        )}
                        <Link to="/cart">
                           <FaShoppingBasket className='icon ms-2' /> Sepet ({cartCount})
                        </Link>
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            <Modal show={isLoginModalOpen} onHide={() => setIsLoginModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginPage setIsLoggedIn={setIsLoggedIn} setCustomerId={setCustomerId} setUserName={setUserName} setUserSurname={setUserSurname} onClose={() => setIsLoginModalOpen(false)} />
                </Modal.Body>
            </Modal>

            {/* Sign Up Modal */}
            <Modal show={isSignUpModalOpen} onHide={() => setIsSignUpModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SignUpPage onClose={() => setIsSignUpModalOpen(false)} />
                </Modal.Body>
            </Modal>
        </header>
    );

}

export default Header;