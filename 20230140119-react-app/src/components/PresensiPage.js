import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix ikon marker
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function AttendancePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null); 
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:3001/api/presensi';

  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (err) => {
                setError("Gagal mendapatkan lokasi. Pastikan GPS aktif.");
                console.error(err);
            }
        );
    } else {
        setError("Browser tidak mendukung Geolocation.");
    }
  }, []);

  const handleCheckIn = async () => {
    setMessage("");
    setError("");
    
    if (!coords) {
        setError("Lokasi belum ditemukan. Tunggu sebentar...");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        navigate('/login');
        return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/check-in`,
        {
            latitude: coords.lat,
            longitude: coords.lng
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message || "Check-in berhasil!");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-in gagal");
    }
  };

  const handleCheckOut = async () => {
    setMessage("");
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
        navigate('/login');
        return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/check-out`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message || "Check-out berhasil!");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-out gagal");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Lakukan Presensi
        </h2>

        {/* TAMPILAN KOORDINAT (Latitude & Longitude) */}
        {coords ? (
            <div className="mb-4 text-sm bg-gray-50 p-3 rounded border border-gray-200">
                <p className="font-semibold text-gray-700">Lokasi Terdeteksi:</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="text-left"><span className="font-bold">Lat:</span> {coords.lat.toFixed(6)}</div>
                    <div className="text-left"><span className="font-bold">Lng:</span> {coords.lng.toFixed(6)}</div>
                </div>
            </div>
        ) : (
            <p className="text-sm text-yellow-600 mb-4 animate-pulse">Sedang mencari lokasi...</p>
        )}

        {/* PETA */}
        {coords && (
            <div className="mb-6 border-2 border-gray-200 rounded-lg overflow-hidden h-64 w-full relative z-0">
                <MapContainer center={[coords.lat, coords.lng]} zoom={16} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[coords.lat, coords.lng]}>
                        <Popup>Posisi Anda</Popup>
                    </Marker>
                </MapContainer>
            </div>
        )}

        {message && <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            disabled={!coords} 
            className={`w-full py-3 px-4 text-white font-semibold rounded-md shadow-sm transition ${!coords ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 transition"
          >
            Check-Out
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
            <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 hover:underline">
                &larr; Kembali ke Dashboard
            </button>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;