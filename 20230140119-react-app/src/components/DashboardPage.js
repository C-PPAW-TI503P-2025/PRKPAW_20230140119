import React from 'react';
import { useNavigate } from 'react-router-dom';

// Anda bisa mengimpor ikon dari react-icons jika terinstal
// import { FiLogOut, FiCheckCircle } from 'react-icons/fi';

// SVG Ikon sebagai fallback jika react-icons tidak ada
const CheckCircleIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-16 w-16 text-green-500" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5 mr-2" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);


function DashboardPage() {
  const navigate = useNavigate();

  // Fungsi logout (sesuai Task 3)
  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token
    navigate('/login'); // Arahkan ke login
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-8">
      
      <div className="w-full max-w-lg bg-white p-8 sm:p-12 rounded-xl shadow-lg text-center transform transition-all hover:scale-105 duration-300">
        
        {/* Ikon Sukses */}
        <div className="flex justify-center mb-4">
          <CheckCircleIcon />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Login Sukses!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Selamat Datang di Halaman Dashboard Anda.
        </p>

        <p className="text-sm text-gray-500 mb-8 bg-gray-50 p-4 rounded-md">
          Ini adalah area aman Anda. Semua data dan fitur khusus
          tersedia di sini.
        </p>

        {/* Tombol Logout dengan Ikon */}
        <button
          onClick={handleLogout}
          className="w-full sm:w-auto inline-flex items-center justify-center py-3 px-8 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <LogoutIcon />
          Logout
        </button>
      </div>

    </div>
  );
}

export default DashboardPage;