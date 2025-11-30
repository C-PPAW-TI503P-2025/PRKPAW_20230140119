import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Cek status login saat komponen dimuat & saat lokasi berubah
    useEffect(() => {
        const checkUser = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    // Cek apakah token expired
                    if (decoded.exp * 1000 < Date.now()) {
                        localStorage.removeItem('token');
                        setUser(null);
                    } else {
                        setUser(decoded);
                    }
                } catch (error) {
                    console.error("Token invalid", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();
    }, [location]); // Re-run saat pindah halaman

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    
                    {/* Bagian Kiri: Logo & Menu Utama */}
                    <div className="flex items-center">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <span className="bg-blue-600 text-white p-1.5 rounded-lg font-bold text-lg">
                                P
                            </span>
                            <span className="font-bold text-xl text-gray-800 tracking-tight">
                                Portal Presensi
                            </span>
                        </Link>

                        {/* Menu Desktop (Hanya muncul jika user login) */}
                        {user && (
                            <div className="hidden md:ml-8 md:flex md:space-x-4">
                                <Link 
                                    to="/dashboard" 
                                    className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    to="/presensi" 
                                    className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Presensi
                                </Link>
                                {user.role === 'admin' && (
                                    <Link 
                                        to="/laporan-admin" 
                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium transition"
                                    >
                                        Laporan Admin
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bagian Kanan: User Info & Tombol */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-bold text-gray-800">{user.nama}</div>
                                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            // Tampilan jika Belum Login (di halaman Login/Register)
                            <div className="flex items-center gap-3">
                                <Link 
                                    to="/login" 
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                                        location.pathname === '/login' 
                                        ? 'bg-blue-50 text-blue-700' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition border ${
                                        location.pathname === '/register' 
                                        ? 'bg-blue-600 text-white border-transparent' 
                                        : 'text-blue-600 border-blue-600 hover:bg-blue-50'
                                    }`}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;