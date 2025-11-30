const { Presensi, User } = require('../models'); // Pastikan import User
const { Op } = require('sequelize');

exports.getDailyReport = async (req, res) => {
  try {
    const { startDate, endDate, nama } = req.query;

    // Setup Filter Tanggal
    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      dateFilter = {
        checkIn: { [Op.between]: [start, end] }
      };
    }

    // Query Database
    const reports = await Presensi.findAll({
      where: dateFilter,
      include: [
        {
          model: User,     // <--- INI KUNCINYA: Join ke tabel User
          as: 'user',      // <--- Harus sama dengan di models/presensi.js
          attributes: ['nama'], // Ambil kolom 'nama' saja
          where: nama ? { nama: { [Op.like]: `%${nama}%` } } : undefined // Filter nama jika ada
        }
      ],
      order: [['checkIn', 'DESC']] // Urutkan dari yang terbaru
    });

    res.json(reports);

  } catch (error) {
    console.error("Error Report:", error);
    res.status(500).json({ message: "Gagal mengambil laporan" });
  }
};