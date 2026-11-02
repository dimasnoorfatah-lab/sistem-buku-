document.addEventListener('DOMContentLoaded', () => {
  const V = window.Smartbook;
  const grid = document.getElementById('catalog-grid');
  const tableBody = document.getElementById('stock-table-body');
  const search = document.getElementById('catalog-search');
  const modal = document.getElementById('add-book-modal');
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  const openModal = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); };
  const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
  document.getElementById('open-add-book').addEventListener('click', openModal);
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });

  function render() {
    const books = V.getBooks();
    const query = search.value.trim().toLowerCase();
    const filtered = books.filter((book) => `${book.kodeBarang} ${book.namaBarang} ${book.jenisBarang}`.toLowerCase().includes(query));
    document.getElementById('catalog-count').textContent = books.length;
    document.getElementById('catalog-empty').hidden = filtered.length > 0;
    grid.innerHTML = filtered.map((book) => `
      <article class="card catalog-card">
        <div class="catalog-cover"><img src="${V.escapeHTML(book.cover || 'img/pengantar_komunikasi.jpg')}" alt="Sampul ${V.escapeHTML(book.namaBarang)}" onerror="this.onerror=null;this.src='img/pengantar_komunikasi.jpg'"></div>
        <div class="catalog-info"><span class="book-code">${V.escapeHTML(book.kodeBarang)}</span><h3>${V.escapeHTML(book.namaBarang)}</h3><span class="muted small">${V.escapeHTML(book.jenisBarang)} · Edisi ${V.escapeHTML(book.edisi || '1')}</span><div class="catalog-meta"><span class="catalog-price">${V.money(book.harga)}</span><span class="catalog-stock">Stok: <strong>${Number(book.stok).toLocaleString('id-ID')}</strong></span></div></div>
      </article>`).join('');
    tableBody.innerHTML = filtered.map((book) => `<tr><td><strong>${V.escapeHTML(book.kodeBarang)}</strong></td><td>${V.escapeHTML(book.namaBarang)}</td><td>${V.escapeHTML(book.jenisBarang)}</td><td>${V.escapeHTML(book.edisi || '1')}</td><td><span class="pill ${Number(book.stok) < 20 ? 'warning' : 'success'}">${Number(book.stok).toLocaleString('id-ID')} unit</span></td><td><strong>${V.money(book.harga)}</strong></td><td><button class="btn btn-outline btn-sm" type="button" data-restock="${V.escapeHTML(book.kodeBarang)}">+ Stok</button></td></tr>`).join('');
    tableBody.querySelectorAll('[data-restock]').forEach((button) => button.addEventListener('click', () => {
      const code = button.dataset.restock;
      const amount = Number(prompt('Tambah berapa unit stok?', '10'));
      if (!Number.isInteger(amount) || amount < 1) { if (amount !== 0 && !Number.isNaN(amount)) V.toast('Jumlah stok harus angka minimal 1.', 'error'); return; }
      const allBooks = V.getBooks();
      const target = allBooks.find((item) => item.kodeBarang === code);
      if (target) { target.stok = Number(target.stok) + amount; V.saveBooks(allBooks); render(); V.toast(`Stok ${target.namaBarang} bertambah ${amount} unit.`); }
    }));
  }

  search.addEventListener('input', render);
  document.getElementById('add-book-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const code = document.getElementById('book-code').value.trim().toUpperCase();
    const name = document.getElementById('book-name').value.trim();
    const books = V.getBooks();
    if (books.some((book) => book.kodeBarang.toUpperCase() === code)) { alert('Kode buku sudah digunakan. Gunakan kode yang berbeda.'); return; }
    const newBook = {
      kodeBarang: code,
      namaBarang: name,
      jenisBarang: document.getElementById('book-type').value,
      edisi: document.getElementById('book-edition').value,
      stok: Number(document.getElementById('book-stock').value),
      harga: Number(document.getElementById('book-price').value),
      cover: 'img/pengantar_komunikasi.jpg'
    };
    books.push(newBook);
    V.saveBooks(books);
    search.value = '';
    render(); closeModal(); event.target.reset();
    V.toast('Buku baru berhasil ditambahkan ke katalog.');
  });
  render();
});
