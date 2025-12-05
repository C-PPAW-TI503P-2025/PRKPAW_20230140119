import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-sky-200 p-8 relative overflow-hidden">
      {/* Dekorasi mengambang yang lucu */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Lingkaran besar */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-sky-200/40 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Dekorasi kecil bergerak */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/40 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-pink-300/40 rounded-full animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-purple-300/40 rounded-full animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></div>
      </div>

      <main className="max-w-5xl mx-auto relative z-10">
        
        {/* Header dengan animasi */}
        <header className="mb-12 text-center transform hover:scale-105 transition-transform duration-300">
          <div className="inline-block mb-4 animate-bounce">
            <div className="bg-gradient-to-br from-blue-300 via-cyan-300 to-sky-300 p-5 rounded-full shadow-2xl relative">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              <svg className="w-16 h-16 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            Hai, {user ? user.nama : 'User'}! 
          </h1>
          <p className="text-lg text-blue-600 font-medium animate-pulse">
             Selamat datang di portal presensi kiieeaa
          </p>
        </header>

        {/* Grid Menu dengan efek hover menarik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* KARTU 1: Menu Presensi */}
          <div 
            onClick={() => navigate('/presensi')}
            className="bg-white rounded-3xl shadow-2xl hover:shadow-blue-300/50 p-10 cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:rotate-1 group relative overflow-hidden"
          >
            {/* Efek sparkle background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Dekorasi sudut */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-300/20 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-300/20 rounded-tr-full"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="bg-gradient-to-br from-blue-200 via-cyan-200 to-sky-200 p-7 rounded-full mb-6 group-hover:from-blue-400 group-hover:via-cyan-400 group-hover:to-sky-400 transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-blue-300/50 transform group-hover:rotate-12 group-hover:scale-110">
                <svg className="h-14 w-14 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                Presensi Harian 
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                Check-in saat datang & Check-out saat pulang. Jangan lupa ya! 
              </p>
              
              <div className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 font-semibold rounded-full group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg">
                Mulai Presensi
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          {/* KARTU 2: Menu Laporan (Khusus Admin) */}
          {user && user.role === 'admin' && (
            <div 
              onClick={() => navigate('/laporan-admin')}
              className="bg-white rounded-3xl shadow-2xl hover:shadow-cyan-300/50 p-10 cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:-rotate-1 group relative overflow-hidden"
            >
              {/* Efek sparkle background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Dekorasi sudut */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-purple-300/20 rounded-br-full"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-green-300/20 rounded-tl-full"></div>
              
              {/* Badge Admin */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                 ADMIN
              </div>
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="bg-gradient-to-br from-cyan-200 via-blue-200 to-purple-200 p-7 rounded-full mb-6 group-hover:from-cyan-400 group-hover:via-blue-400 group-hover:to-purple-400 transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-cyan-300/50 transform group-hover:-rotate-12 group-hover:scale-110">
                  <svg className="h-14 w-14 text-cyan-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-cyan-600 transition-colors duration-300">
                  Laporan Admin 
                </h2>
                <p className="text-gray-500 text-base leading-relaxed mb-6">
                  Lihat semua data kehadiran siswa dengan mudah! 
                </p>
                
                <div className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-semibold rounded-full group-hover:from-cyan-500 group-hover:to-blue-500 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg">
                  Lihat Laporan
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom info dengan animasi */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
              user && user.role === 'admin' 
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white' 
                : 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white'
            } shadow-md`}>
              {user && user.role === 'admin' ? '' : ''}
              {user && user.role === 'admin' ? 'Administrator Mode' : 'siswa Mode'}
            </span>
          </div>
        </div>

        {/* Footer fun fact */}
        <div className="mt-8 text-center">
          <p className="text-blue-500 text-sm font-medium animate-bounce">
            💙 Semangat untuk hari ini! 💙
          </p>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;