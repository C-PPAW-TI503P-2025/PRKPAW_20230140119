// controllers/presensiController.js

// 1. Impor modul
const sequelize = require("sequelize");
const { Op } = sequelize;
const { Presensi } = require("../models"); // Sequelize dan Op tidak perlu diimpor di sini jika tidak dipakai
const { format } = require("date-fns-tz");
const { validationResult } = require('express-validator');

// 2. Tentukan zona waktu
const timeZone = "Asia/Jakarta";

// 3. Implementasi CheckIn (Refactored)
exports.CheckIn = async (req, res) => {
  try {
    // Ambil data user dari request (diasumsikan dari middleware)
    const { id: userId, nama: userName } = req.user; // Kita masih perlu userName untuk pesan
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

    // Buat record check-in baru (tanpa 'nama')
    const newRecord = await Presensi.create({
      userId: userId,
      // 'nama' dihapus dari sini
      checkIn: waktuSekarang,
    });

    // Format data untuk respons (tanpa 'nama')
    const formattedData = {
        id: newRecord.id,
        userId: newRecord.userId,
        // 'nama' dihapus dari sini
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

// 4. Implementasi CheckOut (Refactored)
exports.CheckOut = async (req, res) => {
  try {
    // Ambil data user dari request
    const { id: userId, nama: userName } = req.user; // Kita masih perlu userName untuk pesan
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

    // Format data untuk respons (tanpa 'nama')
    const formattedData = {
        id: recordToUpdate.id,
        userId: recordToUpdate.userId,
        // 'nama' dihapus dari sini
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

// 5. Implementasi Update Presensi (Refactored)
exports.updatePresensi = async (req, res) => {
  // Cek hasil validasi
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const presensiId = req.params.id;
    // 'nama' dihapus dari body
    const { checkIn, checkOut } = req.body;

    // Cek jika tidak ada data yang dikirim
    // 'nama' dihapus dari cek
    if (checkIn === undefined && checkOut === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn atau checkOut).",
      });
    }

    // Cari record presensi
    const recordToUpdate = await Presensi.findByPk(presensiId);

    // Jika record tidak ditemukan
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    const finalCheckIn = checkIn !== undefined ? checkIn : recordToUpdate.checkIn;

    // Validasi checkOut > checkIn
    if (checkOut && finalCheckIn && new Date(checkOut) <= new Date(finalCheckIn)) {
      return res.status(400).json({ message: 'checkOut harus setelah checkIn.' });
    }

    // Update field
    if (checkIn !== undefined) recordToUpdate.checkIn = checkIn;
    if (checkOut !== undefined) recordToUpdate.checkOut = checkOut;
    // 'nama' dihapus dari update
    // if (nama !== undefined) recordToUpdate.nama = nama.trim(); 

    // Simpan perubahan
    await recordToUpdate.save();

    // Format data untuk respons (tanpa 'nama')
    const formattedData = {
        id: recordToUpdate.id,
        userId: recordToUpdate.userId,
        // 'nama' dihapus dari sini
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

// 6. Implementasi Delete Presensi (Tidak perlu diubah)
// Fungsi delete Anda sudah benar dan tidak bergantung pada kolom 'nama'
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user; 
    const presensiId = req.params.id; 

    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    // Pengecekan kepemilikan sudah benar
    if (recordToDelete.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    await recordToDelete.destroy();

    // Beri respons 204 (No Content) atau 200 dengan JSON
    res.status(200).json({ message : "Data presensi berhasil dihapus"} ); 
    // Catatan: Respons 204 seharusnya tidak memiliki body JSON, jadi 200 lebih baik jika ingin mengirim pesan
  } catch (error) {
    console.error("Error saat menghapus presensi:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};