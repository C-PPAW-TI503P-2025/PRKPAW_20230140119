import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      const token = response.data.token;
      localStorage.setItem('token', token); 

      navigate('/dashboard');

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-sky-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dekorasi mengambang yang lucu */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-sky-200/40 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300/30 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 bg-pink-300/30 rounded-full animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-10 w-10 h-10 bg-purple-300/30 rounded-full animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main card dengan efek 3D */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
          
          {/* Dekorasi sudut */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-bl-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-sky-200 to-blue-200 rounded-tr-full opacity-50"></div>
          
          {/* Icon dengan animasi */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-300 via-cyan-300 to-sky-300 p-6 rounded-full shadow-2xl relative animate-bounce">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              <svg className="w-12 h-12 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent mb-3">
              Hai! kiieeaa ❤
            </h2>
            <p className="text-base text-gray-500 font-medium"></p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg"></span> Email
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="contoh@email.com"
                  className="w-full px-5 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:border-blue-300 shadow-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg"></span> Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:border-blue-300 shadow-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-600 font-semibold transition-colors duration-200 flex items-center gap-1">
                Lupa password? 
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 hover:from-blue-500 hover:via-cyan-500 hover:to-sky-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Masuk Sekarang 
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl animate-shake">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-red-700 font-semibold text-sm">Oops! </p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-semibold">atau</span>
            </div>
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-base text-gray-600 font-medium">
              Belum punya akun? 
              <a href="#" className="ml-2 text-blue-500 hover:text-blue-600 font-bold transition-colors duration-200 inline-flex items-center gap-1">
                Daftar yuk! 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg">
            <span className="text-2xl"></span>
            <p className="text-sm text-blue-600 font-semibold">
              Keamanan data terjamin 100%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;