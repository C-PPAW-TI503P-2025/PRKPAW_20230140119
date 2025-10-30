// controllers/reportController.js
const { Presensi, Sequelize } = require("../models"); // Impor Presensi dan Sequelize
const { Op } = Sequelize; // Impor Operator Sequelize

exports.getDailyReport = async (req, res) => { // Jadikan async
  console.log("Controller: Mengambil data laporan harian...");

  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query; // Ambil nama dan tanggal dari query params

    let whereClause = {}; // Kondisi filter awal

    // Filter berdasarkan nama (seperti di modul) [cite: 119-123]
    if (nama) {
      whereClause.nama = {
        [Op.like]: `%${nama}%`,
      };
      console.log(`Memfilter laporan berdasarkan nama: ${nama}`);
    }

    // Filter berdasarkan rentang tanggal (Tugas 1) [cite: 138]
    if (tanggalMulai && tanggalSelesai) {
      const mulai = new Date(tanggalMulai);
      const selesai = new Date(tanggalSelesai);
      selesai.setHours(23, 59, 59, 999); // Set ke akhir hari

      if (isNaN(mulai) || isNaN(selesai)) {
        return res.status(400).json({ message: "Format tanggal tidak valid. Gunakan YYYY-MM-DD." });
      }

      // Gabungkan filter tanggal ke whereClause
      // Jika sudah ada filter nama, tambahkan kondisi tanggal
      // Jika belum, buat kondisi tanggal baru
      whereClause.checkIn = {
        ...(whereClause.checkIn || {}), // Pertahankan kondisi lain jika ada
        [Op.between]: [mulai, selesai],
      };
      console.log(`Memfilter laporan dari ${mulai.toISOString()} sampai ${selesai.toISOString()}`);
    } else {
       if (!nama) { // Hanya log jika tidak ada filter sama sekali
         console.log("Menampilkan semua laporan (tidak ada filter).");
       }
    }

    // Ambil data presensi dari database dengan filter gabungan
    const presensiRecords = await Presensi.findAll({
      where: whereClause,
      order: [['checkIn', 'ASC']] // Urutkan berdasarkan tanggal check-in
    });

    res.json({
      message: "Laporan harian berhasil diambil.",
      filter: {
          ...(nama && { nama }), // Tampilkan filter nama jika ada
          ...(tanggalMulai && tanggalSelesai && { tanggalMulai, tanggalSelesai }) // Tampilkan filter tanggal jika ada
      },
      count: presensiRecords.length,
      data: presensiRecords,
    });

  } catch (error) {
    console.error("Error saat mengambil laporan harian:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};