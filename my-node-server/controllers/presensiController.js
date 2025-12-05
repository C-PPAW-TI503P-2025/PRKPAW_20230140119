// controllers/presensiController.js
const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// --- KONFIGURASI MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Simpan di folder uploads
    },
    filename: (req, file, cb) => {
        // Format nama file: userId-timestamp.ext
        // Pastikan req.user ada (middleware auth harus jalan duluan)
        const userId = req.user ? req.user.id : 'guest';
        cb(null, `${userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });
// --------------------------

const timeZone = "Asia/Jakarta";

// 3. Implementasi CheckIn (Update: Menerima Foto)
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();
    
    // Ambil data latitude & longitude
    const { latitude, longitude } = req.body; 

    // Ambil path foto dari req.file (hasil upload multer)
    const buktiFoto = req.file ? req.file.path : null;

    if (!buktiFoto) {
        return res.status(400).json({ message: "Bukti foto selfie wajib diupload!" });
    }

    // Cek double check-in
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah melakukan check-in hari ini dan belum check-out." });
    }

    // Simpan ke database
    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
      latitude: latitude,
      longitude: longitude,
      buktiFoto: buktiFoto // Simpan path gambar
    });

    const formattedData = {
        id: newRecord.id,
        userId: newRecord.userId,
        checkIn: format(new Date(newRecord.checkIn), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        latitude: newRecord.latitude,
        longitude: newRecord.longitude,
        buktiFoto: newRecord.buktiFoto,
        checkOut: null
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil!`,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error saat CheckIn:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 4. Implementasi CheckOut (Tidak ada perubahan)
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;

    if (recordToUpdate.checkOut <= recordToUpdate.checkIn) {
        return res.status(400).json({ message: "Waktu check-out tidak boleh sebelum waktu check-in." });
    }

    await recordToUpdate.save();

    const formattedData = {
        id: recordToUpdate.id,
        userId: recordToUpdate.userId,
        checkIn: format(new Date(recordToUpdate.checkIn), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: format(new Date(recordToUpdate.checkOut), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out berhasil!`,
      data: formattedData,
    });
  }
  catch (error) {
    console.error("Error saat CheckOut:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 5. Implementasi Update Presensi (Tidak ada perubahan)
exports.updatePresensi = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    if (checkIn === undefined && checkOut === undefined) {
      return res.status(400).json({
        message: "Request body tidak berisi data valid (checkIn atau checkOut).",
      });
    }

    const recordToUpdate = await Presensi.findByPk(presensiId);

    if (!recordToUpdate) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    const finalCheckIn = checkIn !== undefined ? checkIn : recordToUpdate.checkIn;

    if (checkOut && finalCheckIn && new Date(checkOut) <= new Date(finalCheckIn)) {
      return res.status(400).json({ message: 'checkOut harus setelah checkIn.' });
    }

    if (checkIn !== undefined) recordToUpdate.checkIn = checkIn;
    if (checkOut !== undefined) recordToUpdate.checkOut = checkOut;

    await recordToUpdate.save();

    const formattedData = {
        id: recordToUpdate.id,
        userId: recordToUpdate.userId,
        checkIn: recordToUpdate.checkIn ? format(new Date(recordToUpdate.checkIn), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }) : null,
        checkOut: recordToUpdate.checkOut ? format(new Date(recordToUpdate.checkOut), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }) : null,
        createdAt: recordToUpdate.createdAt,
        updatedAt: recordToUpdate.updatedAt
    };

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: formattedData,
    });

  } catch (error) {
    console.error("Error saat update:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 6. Implementasi Delete Presensi (Tidak ada perubahan)
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user; 
    const presensiId = req.params.id; 

    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    if (recordToDelete.userId !== userId) {
      return res.status(403).json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    await recordToDelete.destroy();
    res.status(200).json({ message : "Data presensi berhasil dihapus"} ); 
  } catch (error) {
    console.error("Error saat delete:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};