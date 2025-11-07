// Dibutuhkan untuk verifikasi token
const jwt = require('jsonwebtoken');
// Dibutuhkan untuk mengambil data user terbaru dari database
const { User } = require('../models'); 

const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';
/**
 * Middleware untuk Autentikasi (Pengganti addUserData)
 * Memverifikasi JWT dan melampirkan data user ke req.user
 */
exports.authenticateToken = async (req, res, next) => {
  // 1. Ambil token dari header 'Authorization'
  const authHeader = req.headers['authorization'];
  // Format headernya adalah "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  // 2. Jika tidak ada token, kirim error 401 (Unauthorized)
  if (token == null) {
    console.log('Middleware: Gagal! Token tidak ditemukan.');
    return res.status(401).json({ message: 'Akses ditolak: Token diperlukan' });
  }

  try {
    // 3. Verifikasi token menggunakan secret key
    // Pastikan Anda memiliki JWT_SECRET di file .env Anda!
    const payload = jwt.verify(token, JWT_SECRET);

    // 4. Cari user di database berdasarkan ID dari payload token
    // Ini adalah langkah penting untuk memastikan user masih ada
    // dan datanya (terutama 'role') adalah yang terbaru.
    const user = await User.findByPk(payload.id);

    if (!user) {
      console.log('Middleware: Gagal! User dari token tidak ada di DB.');
      return res.status(404).json({ message: 'Autentikasi gagal: User tidak ditemukan.' });
    }

    // 5. Lampirkan data user ke 'req' agar bisa dipakai oleh middleware/controller selanjutnya
    req.user = user.dataValues; // user.dataValues berisi data user (id, nama, email, role)
    
    console.log(`Middleware: Autentikasi berhasil untuk user: ${req.user.nama}`);
    next(); // Lanjut ke middleware berikutnya (misalnya: isAdmin)

  } catch (err) {
    // 6. Tangani jika token tidak valid atau kedaluwarsa
    console.error('Middleware: Error verifikasi token!', err.name);
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token kedaluwarsa, silakan login kembali' });
    }
    return res.status(403).json({ message: 'Token tidak valid' });
  }
};

/**
 * Middleware untuk Otorisasi (Pengecekan Admin)
 * (Ini tetap sama, karena bergantung pada req.user)
 */
exports.isAdmin = (req, res, next) => {
  // Fungsi ini sekarang akan menerima req.user dari authenticateToken
  if (req.user && req.user.role === 'admin') {
    console.log('Middleware: Izin admin diberikan.');
    next(); 
  } else {
    console.log('Middleware: Gagal! Pengguna bukan admin.');
    return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin'});
  }
};