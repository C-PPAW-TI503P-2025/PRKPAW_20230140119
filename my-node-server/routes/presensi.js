// routes/presensi.js
const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');
const { body, param, validationResult } = require('express-validator'); // Impor validator

// Middleware untuk semua rute di bawah ini
router.use(addUserData);

router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

// Route PUT sesuai modul  dengan tambahan validasi 
router.put(
  '/:id',
  [ // Array middleware validasi
    param('id').isInt().withMessage('ID Presensi harus berupa angka.'),
    body('checkIn') // Nama field di body request sesuai contoh controller 
      .optional()
      .isISO8601()
      .toDate()
      .withMessage('Format checkIn tidak valid (ISO8601: YYYY-MM-DDTHH:mm:ss.sssZ).'),
    body('checkOut') // Nama field di body request sesuai contoh controller 
      .optional()
      .isISO8601()
      .toDate()
      .withMessage('Format checkOut tidak valid (ISO8601: YYYY-MM-DDTHH:mm:ss.sssZ).')
      .custom((value, { req }) => {
        // Validasi kustom: checkOut harus setelah checkIn jika keduanya ada
        const checkInDate = req.body.checkIn ? new Date(req.body.checkIn) : null;
        const checkOutDate = value ? new Date(value) : null;
        // Hanya validasi jika kedua tanggal ada dan valid
        if (checkInDate && checkOutDate && !isNaN(checkInDate) && !isNaN(checkOutDate) && checkOutDate <= checkInDate) {
          throw new Error('checkOut harus setelah checkIn.');
        }
        return true;
      }),
    body('nama') // Validasi opsional untuk 'nama' jika diperlukan
       .optional()
       .isString().withMessage('Nama harus berupa string.')
       .trim() // Hapus spasi di awal/akhir
       .notEmpty().withMessage('Nama tidak boleh kosong jika diisi.')
  ],
  presensiController.updatePresensi // Handler dari modul 
);

// Route DELETE sesuai modul [cite: 73]
router.delete('/:id', presensiController.deletePresensi); // Pastikan handler deletePresensi ada di controller

module.exports = router;