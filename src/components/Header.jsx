import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBasketShopping } from 'react-icons/fa6';
import '../App.css'; 

function Header({ categories = [], isLoading = false, error = null }) {
    return (
        <header className="App-header">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <Link to="/shopping" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                        <h2>MyShop</h2>
                    </Link>

                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li>
                            <Link to="shopping/anasayfa" className="nav-link px-2 text-white">Anasayfa</Link>
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

                    <div className="text-end">
                    <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
                    <Link to="/signup" className="btn btn-outline-light">Sign-up</Link>
                        <FaBasketShopping className='icon ms-2' />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;


