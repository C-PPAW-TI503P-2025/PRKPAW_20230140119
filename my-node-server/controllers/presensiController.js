// controllers/presensiController.js

// 1. Impor modul yang diperlukan
const { Presensi, Sequelize } = require("../models"); // Pastikan Sequelize diimpor jika menggunakan Op
const { Op } = Sequelize; // Impor Operator jika diperlukan di fungsi lain (contoh: reportController)
const { format } = require("date-fns-tz");
const { validationResult } = require('express-validator'); // Impor validationResult

// 2. Tentukan zona waktu
const timeZone = "Asia/Jakarta";

// 3. Implementasi CheckIn
exports.CheckIn = async (req, res) => {
  try {
    // Ambil data user dari request (diasumsikan dari middleware)
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cari apakah sudah ada check-in aktif (belum checkout)
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini dan belum check-out." });
    }

    // Buat record check-in baru
    const newRecord = await Presensi.create({
      userId: userId,
      nama: userName,
      checkIn: waktuSekarang,
    });

    // Format data untuk respons
    const formattedData = {
        id: newRecord.id, // ID dari record yang baru dibuat
        userId: newRecord.userId,
        nama: newRecord.nama,
        checkIn: format(new Date(newRecord.checkIn), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: null
    };

    // Kirim respons sukses
    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    // Tangani error server
    console.error("Error saat CheckIn:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 4. Implementasi CheckOut
exports.CheckOut = async (req, res) => {
  try {
    // Ambil data user dari request
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cari record check-in aktif yang belum checkout
    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    // Set waktu checkout
    recordToUpdate.checkOut = waktuSekarang;

    // Validasi sederhana: checkOut harus setelah checkIn
    if (recordToUpdate.checkOut <= recordToUpdate.checkIn) {
        return res.status(400).json({ message: "Waktu check-out tidak boleh sebelum atau sama dengan waktu check-in." });
    }

    // Simpan perubahan ke database
    await recordToUpdate.save();

    // Format data untuk respons
    const formattedData = {
        id: recordToUpdate.id,
        userId: recordToUpdate.userId,
        nama: recordToUpdate.nama,
        checkIn: format(new Date(recordToUpdate.checkIn), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: format(new Date(recordToUpdate.checkOut), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    };

    // Kirim respons sukses
    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  }
  catch (error) {
    // Tangani error server
    console.error("Error saat CheckOut:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 5. Implementasi Update Presensi (sesuai modul + validasi)
exports.updatePresensi = async (req, res) => {
  // Cek hasil validasi dari express-validator (dijalankan di route)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const presensiId = req.params.id;
    // Ambil data yang sudah divalidasi dan dikonversi (jika ada)
    const { checkIn, checkOut, nama } = req.body;

    // Cek jika tidak ada data yang dikirim
    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).",
      });
    }

    // Cari record presensi yang akan diupdate
    const recordToUpdate = await Presensi.findByPk(presensiId);

    // Jika record tidak ditemukan
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    // Tentukan nilai checkIn final (baru atau lama)
    const finalCheckIn = checkIn !== undefined ? checkIn : recordToUpdate.checkIn;

    // Validasi tambahan: checkOut harus setelah checkIn (termasuk checkIn yang mungkin tidak diubah)
    if (checkOut && finalCheckIn && new Date(checkOut) <= new Date(finalCheckIn)) {
      return res.status(400).json({ message: 'checkOut harus setelah checkIn.' });
    }

    // Update field jika ada di body request
    if (checkIn !== undefined) recordToUpdate.checkIn = checkIn; // Gunakan objek Date dari validator
    if (checkOut !== undefined) recordToUpdate.checkOut = checkOut; // Gunakan objek Date dari validator
    if (nama !== undefined) recordToUpdate.nama = nama.trim(); // Trim nama jika ada

    // Simpan perubahan
    await recordToUpdate.save();

    // Format data yang sudah diupdate untuk respons
    const formattedData = {
        id: recordToUpdate.id,
        userId: recordToUpdate.userId,
        nama: recordToUpdate.nama,
        checkIn: recordToUpdate.checkIn ? format(new Date(recordToUpdate.checkIn), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }) : null,
        checkOut: recordToUpdate.checkOut ? format(new Date(recordToUpdate.checkOut), "yyyy-MM-dd HH:mm:ssXXX", { timeZone }) : null,
        createdAt: recordToUpdate.createdAt,
        updatedAt: recordToUpdate.updatedAt
    };

    // Kirim respons sukses
    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: formattedData,
    });

  } catch (error) {
    // Tangani error server
    console.error("Error saat mengupdate presensi:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 6. Implementasi Delete Presensi (sesuai modul)
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user; // Ambil userId dari user yang login
    const presensiId = req.params.id; // Ambil ID presensi dari parameter URL

    // Cari record yang akan dihapus
    const recordToDelete = await Presensi.findByPk(presensiId);

    // Jika tidak ditemukan
    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    // Pengecekan kepemilikan (sesuaikan jika logic berbeda)
    if (recordToDelete.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    // Hapus record
    await recordToDelete.destroy();

    // Kirim respons sukses tanpa konten
    res.status(204).json({ message: "Catatan presensi berhasil dihapus." });
  } catch (error) {
    // Tangani error server
    console.error("Error saat menghapus presensi:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};