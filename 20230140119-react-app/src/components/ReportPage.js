import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ReportPage() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // State untuk filter
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Base URL
    const API_BASE_URL = 'http://localhost:3001'; 

    const fetchReports = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== 'admin') {
                setError("Akses ditolak. Halaman ini khusus Admin.");
                return;
            }
        } catch (err) {
            navigate("/login");
            return;
        }

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

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Endpoint API tidak ditemukan.");
                }
                throw new Error('Gagal mengambil data laporan');
            }

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

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchReports();
    };

    const handleReset = () => {
        setSearchTerm("");
        setStartDate("");
        setEndDate("");
        setTimeout(() => {
             window.location.reload(); 
        }, 100);
    };

    return (
        <div className="max-w-7xl mx-auto p-8"> {/* Lebarkan container agar muat */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Laporan Presensi Harian (Admin)
            </h1>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Karyawan</label>
                        <input
                            type="text"
                            placeholder="Cari nama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition duration-200">
                            Filter
                        </button>
                        <button type="button" onClick={handleReset} className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 transition duration-200">
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {error && (
                <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4 border border-red-200">
                    {error}
                </p>
            )}

            {!error && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                                    {/* TAMBAHAN HEADER KOLOM LOKASI */}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Memuat data...</td></tr>
                                ) : reports.length > 0 ? (
                                    reports.map((presensi, index) => (
                                        <tr key={presensi.id || index} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {presensi.user ? presensi.user.nama : "User Terhapus"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {presensi.checkIn ? new Date(presensi.checkIn).toLocaleDateString("id-ID", {
                                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                }) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                                {presensi.checkIn ? new Date(presensi.checkIn).toLocaleTimeString("id-ID", {
                                                    hour: '2-digit', minute: '2-digit'
                                                }) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                                                {presensi.checkOut
                                                    ? new Date(presensi.checkOut).toLocaleTimeString("id-ID", {
                                                        hour: '2-digit', minute: '2-digit'
                                                    })
                                                    : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Belum Check-out</span>}
                                            </td>
                                            {/* TAMBAHAN DATA LOKASI */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {presensi.latitude || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {presensi.longitude || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-lg">Tidak ada data presensi ditemukan.</p>
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
    );
}

export default ReportPage;