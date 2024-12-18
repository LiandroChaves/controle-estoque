import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Produtos from './components/Produtos';
import ProtectedRoute from '../utils/protectedRoute';

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
                        <Route path="/produtos" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Produtos /></ProtectedRoute>} />
                    </>
                )}
            </Routes>
        </Router>
    );
}
