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
        <nav className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 shadow-xl border-b-4 border-blue-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    
                    {/* Bagian Kiri: Logo & Menu Utama */}
                    <div className="flex items-center">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white opacity-20 rounded-xl blur group-hover:opacity-30 transition-opacity duration-300"></div>
                                <span className="relative bg-white text-blue-600 p-3 rounded-xl font-bold text-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center w-12 h-12">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-2xl text-white tracking-tight drop-shadow-md">
                                    Portal Presensi
                                </span>
                                <span className="text-xs text-blue-100 font-medium">
                                    System Management
                                </span>
                            </div>
                        </Link>

                        {/* Menu Desktop (Hanya muncul jika user login) */}
                        {user && (
                            <div className="hidden md:ml-10 md:flex md:space-x-2">
                                <Link 
                                    to="/dashboard" 
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                        location.pathname === '/dashboard'
                                        ? 'bg-white text-blue-600 shadow-lg'
                                        : 'text-white hover:bg-white hover:bg-opacity-20 hover:shadow-md'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Dashboard
                                </Link>
                                <Link 
                                    to="/presensi" 
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                        location.pathname === '/presensi'
                                        ? 'bg-white text-blue-600 shadow-lg'
                                        : 'text-white hover:bg-white hover:bg-opacity-20 hover:shadow-md'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    Presensi
                                </Link>
                                {user.role === 'admin' && (
                                    <Link 
                                        to="/laporan-admin" 
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                            location.pathname === '/laporan-admin'
                                            ? 'bg-red-500 text-white shadow-lg'
                                            : 'text-white bg-red-600 bg-opacity-70 hover:bg-opacity-100 hover:shadow-md'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
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
                                {/* User Info Card */}
                                <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white border-opacity-30 hidden sm:flex items-center gap-3 shadow-md">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                                            {user.nama.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-white drop-shadow">{user.nama}</div>
                                        <div className="flex items-center gap-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                user.role === 'admin' 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {user.role === 'admin' && (
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                )}
                                                {user.role === 'mahasiswa' && (
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                )}
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Logout Button */}
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            // Tampilan jika Belum Login (di halaman Login/Register)
                            <div className="flex items-center gap-3">
                                <Link 
                                    to="/login" 
                                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                                        location.pathname === '/login' 
                                        ? 'bg-white text-blue-600 transform scale-105' 
                                        : 'bg-white bg-opacity-20 text-white hover:bg-white hover:text-blue-600 border border-white border-opacity-30'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 ${
                                        location.pathname === '/register' 
                                        ? 'bg-white text-blue-600 border-white transform scale-105' 
                                        : 'text-white border-white hover:bg-white hover:text-blue-600'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
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