// script.js

const apiUrl = 'http://localhost:3000/books';

const bookList = document.getElementById('book-list');
const addBookForm = document.getElementById('add-book-form');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const loader = document.getElementById('loader');

// Fungsi untuk menampilkan/menyembunyikan loader
const showLoader = (show) => {
    loader.classList.toggle('hidden', !show);
};

// Fungsi untuk mengambil dan menampilkan semua buku
async function fetchBooks() {
    showLoader(true);
    bookList.innerHTML = ''; // Kosongkan list saat loading
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const books = await response.json();

        if (books.length === 0) {
            bookList.innerHTML = '<p>Rak bukumu masih kosong. Ayo tambahkan buku baru!</p>';
            return;
        }

        // Tampilkan setiap buku ke dalam list
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.classList.add('book-card');
            bookCard.innerHTML = `
                <div>
                    <h3>${book.title}</h3>
                    <p>by ${book.author}</p>
                </div>
                <button class="delete-btn" data-id="${book.id}" title="Hapus buku">✖</button>
            `;
            bookList.appendChild(bookCard);
        });
    } catch (error) {
        console.error('Gagal mengambil data buku:', error);
        bookList.innerHTML = '<p style="color: red;">Gagal memuat data buku. Pastikan server backend berjalan.</p>';
    } finally {
        showLoader(false);
    }
}

// Event listener untuk form tambah buku
addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();

    if (!title || !author) {
        alert('Judul dan Penulis tidak boleh kosong!');
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author }),
        });

        if (response.ok) {
            titleInput.value = '';
            authorInput.value = '';
            fetchBooks();
        } else {
            alert('Gagal menambahkan buku.');
        }
    } catch (error) {
        console.error('Error saat menambahkan buku:', error);
    }
});

// Event listener untuk tombol hapus
bookList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const bookId = e.target.dataset.id;
        
        if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
            try {
                const response = await fetch(`${apiUrl}/${bookId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchBooks();
                } else {
                    alert('Gagal menghapus buku.');
                }
            } catch (error) {
                console.error('Error saat menghapus buku:', error);
            }
        }
    }
});

// Panggil fungsi fetchBooks saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', fetchBooks);