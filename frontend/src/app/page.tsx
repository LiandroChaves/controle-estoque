"use client"

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Produtos from './components/Produtos';
import ProtectedRoute from '../utils/protectedRoute';
import PaginaVendas from './components/Vendas';
import Compras from './components/Compras';

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('authToken'); 
            setIsAuthenticated(!!token);
        };
        
        checkAuth();
    }, []);

    return (
        <Router>
            <Routes>
                {!isAuthenticated ? (
                    <Route path="/" element={<Login />} />
                ) : (
                    <>
                        <Route path="/compras" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Produtos /></ProtectedRoute>} />
                        <Route path="/produtos" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Produtos /></ProtectedRoute>} />
                        <Route path="/vendas" element={<ProtectedRoute isAuthenticated={isAuthenticated}><PaginaVendas /></ProtectedRoute>} />
                    </>
                )}
            </Routes>
        </Router>
    );
}
