import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Webcam from 'react-webcam';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:3001/api/presensi';

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

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
        setError("Lokasi belum ditemukan.");
        return;
    }
    
    if (!image) {
        setError("Wajib ambil foto selfie dulu!");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        navigate('/login');
        return;
    }

    try {
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      formData.append('image', blob, 'selfie.jpg');

      const response = await axios.post(
        `${API_BASE_URL}/check-in`,
        formData,
        { 
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data" 
            } 
        }
      );
      setMessage(response.data.message || "Check-in berhasil!");
      setImage(null);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-in gagal");
      console.error(err);
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-sky-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dekorasi mengambang */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300/30 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 bg-pink-300/30 rounded-full animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-10 w-10 h-10 bg-purple-300/30 rounded-full animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center relative z-10 transform hover:scale-105 transition-transform duration-300">
        {/* Dekorasi sudut */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-sky-200 to-blue-200 rounded-tr-full opacity-50"></div>

        {/* Header */}
        <div className="mb-6 relative z-10">
          <div className="inline-block mb-3 animate-bounce">
            <div className="bg-gradient-to-br from-blue-300 via-cyan-300 to-sky-300 p-4 rounded-full shadow-2xl relative">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent mb-3">
            Presensi Hari Ini 
          </h2>
          <p className="text-base text-gray-500 font-medium">Ambil foto selfie dan lokasi kamu! </p>
        </div>

        {/* AREA KAMERA */}
        <div className="mb-6 border-4 border-blue-200 rounded-3xl overflow-hidden bg-gray-900 min-h-[280px] shadow-2xl relative group">
            {image ? (
                <>
                  <img src={image} alt="Selfie" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Foto OK!
                  </div>
                </>
            ) : (
                <div className="relative">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full"
                    videoConstraints={{ facingMode: "user" }}
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    LIVE
                  </div>
                </div>
            )}
        </div>

        {/* TOMBOL KAMERA */}
        <div className="mb-6 relative z-10">
            {!image ? (
                <button 
                  onClick={capture} 
                  className="bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 hover:from-blue-500 hover:via-cyan-500 hover:to-sky-500 text-white px-6 py-4 rounded-2xl w-full font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    cisssss
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
            ) : (
                <button 
                  onClick={() => setImage(null)} 
                  className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-4 rounded-2xl w-full font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1 hover:scale-105"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Foto Ulang 
                </button>
            )}
        </div>

        {/* INFO LOKASI */}
        {coords ? (
            <div className="mb-6 bg-gradient-to-r from-blue-50 via-cyan-50 to-sky-50 p-5 rounded-2xl border-2 border-blue-200 shadow-lg relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-2 rounded-full shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <p className="font-bold text-gray-700 text-sm mb-3 flex items-center justify-center gap-2">
                  <span className="text-lg"></span> rumahmu dimana.... eaaa
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100">
                      <span className="text-xs text-gray-500 font-semibold block mb-1">Latitude</span>
                      <p className="text-blue-600 font-bold text-sm">{coords.lat.toFixed(6)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100">
                      <span className="text-xs text-gray-500 font-semibold block mb-1">Longitude</span>
                      <p className="text-cyan-600 font-bold text-sm">{coords.lng.toFixed(6)}</p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 shadow-lg relative z-10">
              <p className="text-sm text-yellow-700 font-bold flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg"></span> Mencari lokasi kamu...
              </p>
            </div>
        )}

        {/* PETA LEAFLET */}
        {coords && (
            <div className="mb-6 border-4 border-blue-200 rounded-3xl overflow-hidden h-64 w-full relative z-0 shadow-2xl">
                <MapContainer center={[coords.lat, coords.lng]} zoom={16} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[coords.lat, coords.lng]}>
                        <Popup>
                          <div className="text-center font-bold text-blue-600">
                             Posisi Kamu<br/>
                            <span className="text-xs text-gray-500">Keren kan? </span>
                          </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        )}

        {/* Messages */}
        {message && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-700 px-5 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-3 animate-bounce relative z-10">
            <div className="bg-green-400 p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-bold">Yeay! Berhasil! </p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-3 animate-shake relative z-10">
            <div className="bg-red-400 p-2 rounded-full animate-pulse">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-bold">Oops! Ada error </p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-6 relative z-10">
          <button
            onClick={handleCheckIn}
            disabled={!coords || !image} 
            className={`flex-1 py-4 px-4 font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 ${!coords || !image ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 text-white hover:scale-105'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Check-In 🟢
          </button>

          <button
            onClick={handleCheckOut}
            className="flex-1 py-4 px-4 bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 hover:from-red-500 hover:via-pink-500 hover:to-rose-500 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Check-Out 🔴
          </button>
        </div>
        
        {/* Back Button */}
        <div className="text-sm relative z-10">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="text-blue-500 hover:text-blue-600 font-bold transition-colors duration-200 flex items-center justify-center mx-auto bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Dashboard 
            </button>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;