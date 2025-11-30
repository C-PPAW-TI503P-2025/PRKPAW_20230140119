// controllers/presensiController.js

const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const { validationResult } = require('express-validator');

const timeZone = "Asia/Jakarta";


exports.CheckIn = async (req, res) => {
  try {
    
    const { id: userId, nama: userName } = req.user;
    
    const { latitude, longitude } = req.body; 

    const waktuSekarang = new Date();

    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini dan belum check-out." });
    }

    // Buat record baru dengan data lokasi
    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
      latitude: latitude,   
      longitude: longitude  
    });

    // Format respon
    const formattedData = {
        id: newRecord.id,
        userId: newRecord.userId,
        checkIn: format(new Date(newRecord.checkIn), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        latitude: newRecord.latitude,
        longitude: newRecord.longitude,
        checkOut: null
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error saat CheckIn:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 2. CheckOut (Tidak butuh lokasi, tapi logic userId harus benar)
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
        return res.status(400).json({ message: "Waktu check-out error." });
    }

    await recordToUpdate.save();

    const formattedData = {
        id: recordToUpdate.id,
        userId: recordToUpdate.userId,
        checkIn: format(new Date(recordToUpdate.checkIn), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: format(new Date(recordToUpdate.checkOut), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang, "HH:mm:ss", { timeZone }
      )} WIB`,
      data: formattedData,
    });
  }
  catch (error) {
    console.error("Error saat CheckOut:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// ... (Fungsi updatePresensi dan deletePresensi bisa dibiarkan sama seperti sebelumnya)
exports.updatePresensi = async (req, res) => {
    // ... (kode updatePresensi Anda yang lama)
    // Saya singkat di sini karena fokus utamanya adalah CheckIn
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const presensiId = req.params.id;
        const { checkIn, checkOut } = req.body;
        const recordToUpdate = await Presensi.findByPk(presensiId);
        if (!recordToUpdate) return res.status(404).json({ message: "Data tidak ditemukan" });

        if (checkIn) recordToUpdate.checkIn = checkIn;
        if (checkOut) recordToUpdate.checkOut = checkOut;
        
        await recordToUpdate.save();
        res.json({ message: "Berhasil update", data: recordToUpdate });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deletePresensi = async (req, res) => {
    
    try {
        const { id: userId } = req.user; 
        const presensiId = req.params.id; 
        const record = await Presensi.findByPk(presensiId);
        if (!record) return res.status(404).json({ message: "Data tidak ditemukan" });
        if (record.userId !== userId) return res.status(403).json({ message: "Akses ditolak" });
        
        await record.destroy();
        res.json({ message : "Data presensi berhasil dihapus"} ); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};