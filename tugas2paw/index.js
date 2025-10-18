// index.js (Lengkap)

const express = require('express');
const cors = require('cors'); // Middleware untuk mengizinkan request dari domain lain
const app = express();
const port = 3000;

// ================== MIDDLEWARE ==================
// Middleware untuk parsing body request sebagai JSON dari frontend
app.use(express.json());

// Middleware untuk mengizinkan Cross-Origin Resource Sharing (CORS)
// Ini WAJIB agar frontend bisa mengakses API ini
app.use(cors());

// Middleware logger sederhana untuk setiap request yang masuk
const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next(); // Lanjutkan ke proses berikutnya
};
app.use(logger);


// ================== DATABASE SEMENTARA ==================
// Menggunakan array sebagai penyimpanan data sementara
let books = [
    { id: 1, title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer' },
    { id: 2, title: 'Laskar Pelangi', author: 'Andrea Hirata' },
    { id: 3, title: 'Cantik Itu Luka', author: 'Eka Kurniawan' }
];
let currentId = 3; // Menyesuaikan ID terakhir dari data awal


// ================== ROUTES (ENDPOINT API) ==================

// GET: Mendapatkan semua buku
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

// GET: Mendapatkan satu buku berdasarkan ID
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    res.status(200).json(book);
});

// POST: Membuat buku baru
app.post('/books', (req, res) => {
    const { title, author } = req.body;

    // Validasi input sederhana
    if (!title || !author) {
        return res.status(400).json({ message: 'Judul dan penulis harus diisi' });
    }

    const newBook = {
        id: ++currentId,
        title: title,
        author: author
    };
    books.push(newBook);
    res.status(201).json({ message: 'Buku berhasil ditambahkan', data: newBook });
});

// PUT: Memperbarui buku berdasarkan ID
app.put('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    
    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ message: 'Judul dan penulis harus diisi' });
    }

    books[bookIndex] = { ...books[bookIndex], title, author };
    res.status(200).json({ message: 'Buku berhasil diperbarui', data: books[bookIndex] });
});

// DELETE: Menghapus buku berdasarkan ID
app.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const initialLength = books.length;
    books = books.filter(b => b.id !== bookId);

    if (books.length === initialLength) {
        return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    res.status(200).json({ message: 'Buku berhasil dihapus' });
});


// ================== ERROR HANDLING ==================

// Middleware untuk menangani rute yang tidak ditemukan (404 Not Found)
// Ditempatkan di bagian paling akhir sebelum error handler global
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Middleware global error handler
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error ke konsol untuk debugging
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});


// ================== SERVER LISTENER ==================
app.listen(port, () => {
    console.log(`🚀 Server backend berjalan di http://localhost:${port}`);
});