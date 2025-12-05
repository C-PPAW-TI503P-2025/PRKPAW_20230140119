const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/permissionMiddleware'); 
const { body, param } = require('express-validator');

router.use(authenticateToken);

// MODIFIKASI: Tambahkan middleware upload
// 'image' adalah nama field yang dikirim dari Frontend
router.post('/check-in', presensiController.upload.single('image'), presensiController.CheckIn);

router.post('/check-out', presensiController.CheckOut);

router.put(
  '/:id',
  [ 
    param('id').isInt().withMessage('ID Presensi harus berupa angka.'),
    body('checkIn').optional().isISO8601().toDate(),
    body('checkOut').optional().isISO8601().toDate().custom((value, { req }) => {
        const checkInDate = req.body.checkIn ? new Date(req.body.checkIn) : null;
        const checkOutDate = value ? new Date(value) : null;
        if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
          throw new Error('checkOut harus setelah checkIn.');
        }
        return true;
      }),
  ],
  presensiController.updatePresensi 
);

router.delete('/:id', presensiController.deletePresensi); 

module.exports = router;