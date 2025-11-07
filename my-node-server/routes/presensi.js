// routes/presensi.js (SUDAH DIPERBAIKI)

const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
// 1. UBAH INI: Impor 'authenticateToken' (bukan 'addUserData' lagi)
const { authenticateToken } = require('../middleware/permissionMiddleware'); 
const { body, param } = require('express-validator'); // Hapus validationResult jika tidak dipakai di sini

// 2. UBAH INI: Gunakan middleware yang baru
router.use(authenticateToken);

// Rute ini sekarang otomatis dilindungi oleh authenticateToken
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

// Route PUT (validasi 'nama' sudah dihapus)
router.put(
  '/:id',
  [ 
    param('id').isInt().withMessage('ID Presensi harus berupa angka.'),
    body('checkIn')
      .optional()
      .isISO8601()
      .toDate()
      .withMessage('Format checkIn tidak valid (ISO8601: YYYY-MM-DDTHH:mm:ss.sssZ).'),
    body('checkOut')
      .optional()
      .isISO8601()
      .toDate()
      .withMessage('Format checkOut tidak valid (ISO8601: YYYY-MM-DDTHH:mm:ss.sssZ).')
      .custom((value, { req }) => {
        // Ambil checkIn dari body jika ada, jika tidak, kita tidak bisa memvalidasi
        const checkInDate = req.body.checkIn ? new Date(req.body.checkIn) : null;
        const checkOutDate = value ? new Date(value) : null;
        
          // Hanya validasi jika checkIn (dari body) dan checkOut (saat ini) ada
        if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
          throw new Error('checkOut harus setelah checkIn.');
        }
        return true;
      }),
    // 3. HAPUS INI: Validasi 'nama' sudah tidak diperlukan
    /*
     body('nama') 
       .optional()
       .isString().withMessage('Nama harus berupa string.')
       .trim() 
       .notEmpty().withMessage('Nama tidak boleh kosong jika diisi.')
    */
  ],
  presensiController.updatePresensi 
);

// Rute ini juga otomatis dilindungi
router.delete('/:id', presensiController.deletePresensi); 

module.exports = router;