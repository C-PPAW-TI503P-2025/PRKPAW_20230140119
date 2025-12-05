import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ReportPage() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const API_BASE_URL = 'http://localhost:3001'; 

    const fetchReports = async () => {
        const token = localStorage.getItem("token");

        if (!token) { navigate("/login"); return; }

        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== 'admin') {
                setError("Akses ditolak. Halaman ini khusus Admin.");
                return;
            }
        } catch (err) { navigate("/login"); return; }

        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('nama', searchTerm);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await fetch(`${API_BASE_URL}/api/reports/daily?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) throw new Error('Gagal mengambil data laporan');
            const data = await response.json();
            
            if (Array.isArray(data)) {
                setReports(data);
            } else {
                setReports(data.data || []); 
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Terjadi kesalahan saat memuat data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearchSubmit = (e) => { e.preventDefault(); fetchReports(); };
    const handleReset = () => { setSearchTerm(""); setStartDate(""); setEndDate(""); setTimeout(() => { window.location.reload(); }, 100); };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-sky-200 py-8 px-4 relative overflow-hidden"> 
            {/* Dekorasi mengambang */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-sky-200/30 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 rounded-3xl shadow-2xl p-10 mb-10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-white/30 backdrop-blur-sm p-4 rounded-full animate-bounce shadow-2xl">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-3 text-center drop-shadow-lg flex items-center justify-center gap-3">
                            Laporan Presensi Harian 
                        </h1>
                        <p className="text-blue-50 text-lg text-center font-semibold">
                            Dashboard Admin - Monitoring Kehadiran Karyawan 
                        </p>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-3xl shadow-2xl mb-10 overflow-hidden border-4 border-blue-200 transform hover:scale-105 transition-transform duration-300">
                    <div className="bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 px-8 py-5">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter Pencarian 
                        </h2>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
                        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-5 items-end">
                            <div className="flex-grow w-full">
                                <label className="block text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                                    <span className="text-lg"></span> Nama Karyawan
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Cari nama karyawan..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    className="w-full px-5 py-4 border-2 border-blue-200 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300 font-medium" 
                                />
                            </div>
                            <div className="w-full md:w-auto">
                                <label className="block text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                                    <span className="text-lg"></span> Dari Tanggal
                                </label>
                                <input 
                                    type="date" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)} 
                                    className="w-full px-5 py-4 border-2 border-blue-200 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300 font-medium" 
                                />
                            </div>
                            <div className="w-full md:w-auto">
                                <label className="block text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                                    <span className="text-lg"></span> Sampai Tanggal
                                </label>
                                <input 
                                    type="date" 
                                    value={endDate} 
                                    onChange={(e) => setEndDate(e.target.value)} 
                                    className="w-full px-5 py-4 border-2 border-blue-200 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300 font-medium" 
                                />
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <button 
                                    type="submit" 
                                    className="flex-1 md:flex-none py-4 px-7 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 hover:from-blue-600 hover:via-cyan-600 hover:to-sky-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Filter 
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleReset} 
                                    className="flex-1 md:flex-none py-4 px-7 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset 
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {error && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-6 rounded-2xl mb-10 shadow-2xl animate-shake">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-400 p-3 rounded-full animate-pulse">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-red-700 font-bold text-lg">Oops! Ada error </p>
                                <p className="text-red-600 font-semibold">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!error && (
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-blue-100">
                                <thead className="bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400">
                                    <tr>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">👤 Nama</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">📅 Tanggal</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">🟢 Check-In</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">🔴 Check-Out</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">📍 Lokasi</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">📸 Bukti Foto</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-blue-50">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <div className="relative">
                                                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500"></div>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-2xl"></span>
                                                        </div>
                                                    </div>
                                                    <p className="text-blue-600 font-bold text-lg">Memuat data keren... 🚀</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : reports.length > 0 ? (
                                        reports.map((presensi, index) => (
                                            <tr key={presensi.id || index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:via-cyan-50 hover:to-sky-50 transition-all duration-300 transform hover:scale-102">
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-400 via-cyan-400 to-sky-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse">
                                                            {presensi.user ? presensi.user.nama.charAt(0).toUpperCase() : "?"}
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-900">{presensi.user ? presensi.user.nama : "User Terhapus"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-700">
                                                    {presensi.checkIn ? new Date(presensi.checkIn).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-bold rounded-full shadow-md">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {presensi.checkIn ? new Date(presensi.checkIn).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    {presensi.checkOut ? (
                                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 text-sm font-bold rounded-full shadow-md">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {new Date(presensi.checkOut).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-sm font-bold rounded-full shadow-md animate-pulse">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Belum
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-semibold">
                                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
                                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="text-xs">{presensi.latitude}, {presensi.longitude}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    {presensi.buktiFoto ? (
                                                        <img 
                                                            src={`${API_BASE_URL}/${presensi.buktiFoto}`} 
                                                            alt="Bukti" 
                                                            className="h-14 w-14 rounded-2xl object-cover cursor-pointer border-4 border-blue-300 hover:border-blue-500 hover:shadow-2xl transform hover:scale-125 transition-all duration-300 shadow-lg"
                                                            onClick={() => setSelectedImage(`${API_BASE_URL}/${presensi.buktiFoto}`)}
                                                        />
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            No Photo
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <div className="text-6xl"></div>
                                                    <p className="text-gray-500 font-bold text-xl">Tidak ada data ditemukan</p>
                                                    <p className="text-gray-400 text-sm font-medium">Coba ubah filter pencarian </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Popup */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-md animate-fadeIn p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden animate-scaleIn border-4 border-blue-300">
                        <div className="bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 px-8 py-5 flex items-center justify-between">
                            <h3 className="text-white font-bold text-xl flex items-center gap-3">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Bukti Foto Presensi 
                            </h3>
                            <button 
                                className="text-white hover:text-red-300 transition-colors duration-200 p-3 hover:bg-white hover:bg-opacity-20 rounded-xl transform hover:scale-110"
                                onClick={() => setSelectedImage(null)}
                            >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
                            <img 
                                src={selectedImage} 
                                alt="Bukti Full" 
                                className="max-h-[70vh] w-auto mx-auto rounded-2xl shadow-2xl border-4 border-blue-200"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReportPage;