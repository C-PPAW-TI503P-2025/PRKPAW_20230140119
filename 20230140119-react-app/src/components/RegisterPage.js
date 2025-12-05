import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        nama: nama,
        email: email,
        password: password,
        role: role
      });

      setSuccess('Registrasi berhasil! Anda akan diarahkan ke halaman login.');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-sky-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dekorasi mengambang */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-sky-200/40 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/30 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-300/30 rounded-full animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-20 w-12 h-12 bg-purple-300/30 rounded-full animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Card dengan gradient */}
        <div className="bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 rounded-t-3xl shadow-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          
          <div className="flex justify-center mb-4 relative z-10">
            <div className="bg-white/30 backdrop-blur-sm p-5 rounded-full animate-bounce shadow-2xl">
              <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-5xl font-bold text-white mb-3 relative z-10 drop-shadow-lg">
            Yuk Daftar! 
          </h2>
          <p className="text-blue-50 text-lg font-medium relative z-10">Buat akun baru dalam hitungan detik ⚡</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Dekorasi sudut */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-bl-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-sky-200 to-blue-200 rounded-tr-full opacity-50"></div>
          
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Input Nama */}
            <div>
              <label htmlFor="nama" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg"></span> Nama Lengkap
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="nama"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  placeholder="Masukkan nama kamu"
                  className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all duration-200 hover:border-blue-300"
                />
              </div>
            </div>

            {/* Input Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg"></span> Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nama@example.com"
                  className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all duration-200 hover:border-blue-300"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg"></span> Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all duration-200 hover:border-blue-300"
                />
              </div>
            </div>

            {/* Input Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg"></span> Role
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-12 pr-10 py-4 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all duration-200 hover:border-blue-300 appearance-none cursor-pointer"
                >
                  <option value="mahasiswa"> Mahasiswa</option>
                  <option value="admin"> Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Daftar Sekarang! 
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-4 rounded-2xl animate-shake shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-red-700 font-bold">Ups! Ada kesalahan </p>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-4 rounded-2xl animate-bounce shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-green-700 font-bold">Yeay! Berhasil! </p>
                  <p className="text-green-600 font-medium">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Link ke Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 font-medium">
              Sudah punya akun?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-500 hover:text-blue-600 font-bold hover:underline transition-colors duration-200 inline-flex items-center gap-1"
              >
                Login di sini 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <span className="text-2xl"></span>
          <p className="text-blue-600 font-bold text-sm">
            Data kamu aman dan terenkripsi 100%
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;