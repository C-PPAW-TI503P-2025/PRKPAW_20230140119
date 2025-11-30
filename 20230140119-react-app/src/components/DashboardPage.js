import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Ambil data user dari token untuk menampilkan nama & role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token error:", error);
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <main className="max-w-5xl mx-auto">
        
        {/* Header Sambutan */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Selamat Datang, <span className="text-blue-600">{user ? user.nama : 'User'}</span>!
          </h1>
          <p className="text-gray-500 text-lg">
            Silakan pilih menu di bawah ini untuk melanjutkan aktivitas Anda.
          </p>
        </header>

        {/* Grid Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* KARTU 1: Menu Presensi (Untuk Semua User) */}
          <div 
            onClick={() => navigate('/presensi')}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Presensi Harian</h2>
              <p className="text-gray-500">
                Lakukan Check-In saat datang dan Check-Out sebelum pulang kerja.
              </p>
              <button className="mt-6 text-blue-600 font-semibold group-hover:underline">
                Buka Halaman Presensi &rarr;
              </button>
            </div>
          </div>

          {/* KARTU 2: Menu Laporan (Khusus Admin) */}
          {user && user.role === 'admin' && (
            <div 
              onClick={() => navigate('/laporan-admin')}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Laporan Admin</h2>
                <p className="text-gray-500">
                  Lihat rekapitulasi kehadiran seluruh karyawan dan filter data.
                </p>
                <button className="mt-6 text-green-600 font-semibold group-hover:underline">
                  Buka Laporan &rarr;
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default DashboardPage;