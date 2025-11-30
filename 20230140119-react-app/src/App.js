import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components Baru
import Navbar from './components/Navbar';
import ReportPage from './components/ReportPage';
import AttendancePage from './components/PresensiPage';

// Import Halaman (Sesuai path di kode terakhir Anda)
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

// Komponen Layout untuk mengatur logika tampilan Navbar
const MainLayout = () => {
  // const location = useLocation(); // Tidak lagi diperlukan untuk pengecekan
  
  // KITA HAPUS LOGIKA PENYEMBUNYIAN NAVBAR
  // Agar Navbar muncul di semua halaman (Login, Register, Dashboard, dll)
  const shouldShowNavbar = true;

  return (
    <>
      {/* Render Navbar Global di SEMUA halaman */}
      {shouldShowNavbar && <Navbar />}
      
      <div className="App">
        <Routes>
           {/* --- Public Routes --- */}
           <Route path="/" element={<LoginPage />} />
           <Route path="/login" element={<LoginPage />} />
           <Route path="/register" element={<RegisterPage />} />
           
           {/* --- Protected Routes --- */}
           <Route path="/dashboard" element={<DashboardPage />} />
           <Route path="/presensi" element={<AttendancePage />} /> 
           
           {/* --- Admin Route --- */}
           <Route path="/laporan-admin" element={<ReportPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;