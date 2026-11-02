document.addEventListener('DOMContentLoaded', () => {
  const V = window.Smartbook;
  const cart = new Map();
  const bookSelect = document.getElementById('select-book');
  const modal = document.getElementById('order-success-modal');
  let lastCreatedCode = '';
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  function populateBooks() {
    const books = V.getBooks();
    bookSelect.innerHTML = books.length ? books.map((book) => `<option value="${V.escapeHTML(book.kodeBarang)}" ${Number(book.stok) <= 0 ? 'disabled' : ''}>${V.escapeHTML(book.namaBarang)} · ${V.money(book.harga)} (${Number(book.stok)} stok)</option>`).join('') : '<option value="">Belum ada buku di katalog</option>';
    bookSelect.disabled = books.length === 0;
    document.getElementById('add-to-cart').disabled = books.length === 0;
  }

  function calc() {
    const books = V.getBooks();
    let subtotal = 0;
    cart.forEach((item, code) => {
      const book = books.find((b) => b.kodeBarang === code);
      if (book) subtotal += V.parseMoney(book.harga) * item.qty;
    });
    const shipping = document.getElementById('shipping-method').value === 'Ekspres' ? 20000 : 10000;
    document.getElementById('summary-subtotal').textContent = V.money(subtotal);
    document.getElementById('summary-shipping').textContent = V.money(shipping);
    document.getElementById('summary-total').textContent = V.money(subtotal + shipping);
    document.getElementById('cart-count-label').textContent = `${[...cart.values()].reduce((sum, item) => sum + item.qty, 0)} buku dalam keranjang.`;
    return { subtotal, shipping, total: subtotal + shipping };
  }

  function renderCart() {
    const books = V.getBooks();
    const host = document.getElementById('cart-items');
    if (!cart.size) {
      host.innerHTML = '<div class="empty-state"><span class="empty-icon">▣</span>Keranjang masih kosong. Pilih buku dari katalog di atas.</div>';
      calc(); return;
    }
    host.innerHTML = [...cart.entries()].map(([code, item]) => {
      const book = books.find((b) => b.kodeBarang === code);
      if (!book) return '';
      return `<div class="cart-row"><div class="book-mini"><img src="${V.escapeHTML(book.cover || 'img/pengantar_komunikasi.jpg')}" alt="" onerror="this.src='img/pengantar_komunikasi.jpg'"><div><strong>${V.escapeHTML(book.namaBarang)}</strong><span>${V.money(book.harga)} / buku</span></div></div><div class="qty-control"><button type="button" data-qty-change="-1" data-code="${V.escapeHTML(code)}" aria-label="Kurangi jumlah">−</button><strong>${item.qty}</strong><button type="button" data-qty-change="1" data-code="${V.escapeHTML(code)}" aria-label="Tambah jumlah">+</button></div><div class="line-total" style="display:flex;align-items:center;gap:9px"><strong>${V.money(V.parseMoney(book.harga) * item.qty)}</strong><button type="button" class="text-button" style="color:var(--red)" data-remove-item="${V.escapeHTML(code)}" aria-label="Hapus dari keranjang">×</button></div></div>`;
    }).join('');

    host.querySelectorAll('[data-qty-change]').forEach((button) => button.addEventListener('click', () => {
      const code = button.dataset.code;
      const book = books.find((item) => item.kodeBarang === code);
      const next = cart.get(code).qty + Number(button.dataset.qtyChange);
      if (next < 1) cart.delete(code);
      else if (book && next <= Number(book.stok)) cart.get(code).qty = next;
      else { V.toast(`Stok ${book?.namaBarang || 'buku'} tidak mencukupi.`, 'error'); return; }
      renderCart();
    }));
    host.querySelectorAll('[data-remove-item]').forEach((button) => button.addEventListener('click', () => { cart.delete(button.dataset.removeItem); renderCart(); }));
    calc();
  }

  document.getElementById('add-to-cart').addEventListener('click', () => {
    const code = bookSelect.value;
    const book = V.getBooks().find((item) => item.kodeBarang === code);
    const qty = Number(document.getElementById('select-qty').value);
    if (!book || !Number.isInteger(qty) || qty < 1) { V.toast('Pilih buku dan jumlah yang valid.', 'error'); return; }
    const currentQty = cart.get(code)?.qty || 0;
    if (currentQty + qty > Number(book.stok)) { V.toast(`Stok ${book.namaBarang} hanya ${book.stok} unit.`, 'error'); return; }
    cart.set(code, { qty: currentQty + qty });
    renderCart();
    V.toast(`${book.namaBarang} ditambahkan ke keranjang.`);
  });
  document.getElementById('shipping-method').addEventListener('change', calc);

  const current = V.getCurrentUser();
  if (current) {
    document.getElementById('customer-name').value = current.nama || '';
    document.getElementById('customer-email').value = current.email || '';
  }

  document.getElementById('checkout-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!cart.size) { alert('Keranjang masih kosong. Tambahkan setidaknya satu buku.'); return; }
    const form = event.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const allBooks = V.getBooks();
    for (const [code, item] of cart.entries()) {
      const book = allBooks.find((entry) => entry.kodeBarang === code);
      if (!book || Number(book.stok) < item.qty) { alert(`Stok buku ${book?.namaBarang || code} tidak mencukupi.`); return; }
    }

    const totals = calc();
    const now = new Date();
    const nomorDO = `VB${String(now.getTime()).slice(-8)}`;
    const items = [...cart.entries()].map(([code, item]) => {
      const book = allBooks.find((entry) => entry.kodeBarang === code);
      book.stok = Number(book.stok) - item.qty;
      return { kodeBarang: code, nama: book.namaBarang, qty: item.qty, harga: V.parseMoney(book.harga) };
    });
    V.saveBooks(allBooks);
    const status = 'Diproses';
    const order = {
      id: `TRX-${nomorDO}`,
      nomorDO,
      nama: document.getElementById('customer-name').value.trim(),
      email: document.getElementById('customer-email').value.trim(),
      telepon: document.getElementById('customer-phone').value.trim(),
      kota: document.getElementById('customer-city').value.trim(),
      alamat: document.getElementById('customer-address').value.trim(),
      metodePembayaran: document.getElementById('payment-method').value,
      status,
      ekspedisi: 'JNE',
      tanggalKirim: now.toISOString().slice(0, 10),
      paket: document.getElementById('shipping-method').value,
      subtotal: V.money(totals.subtotal),
      ongkir: V.money(totals.shipping),
      total: V.money(totals.total),
      items,
      perjalanan: [{ waktu: now.toISOString().replace('T', ' ').slice(0, 19), keterangan: 'Pesanan dibuat dan menunggu proses pengemasan di Smartbook.' }]
    };
    const orders = V.getOrders();
    orders.push(order);
    V.saveOrders(orders);
    lastCreatedCode = nomorDO;
    document.getElementById('success-do').textContent = nomorDO;
    document.getElementById('success-total').textContent = `Total pembayaran ${V.money(totals.total)} · ${items.length} jenis buku`;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    document.getElementById('track-new-order').href = `tracking.html?do=${encodeURIComponent(nomorDO)}`;
    cart.clear(); renderCart(); populateBooks();
    form.reset();
    if (current) {
      document.getElementById('customer-name').value = current.nama || '';
      document.getElementById('customer-email').value = current.email || '';
    }
  });

  document.getElementById('copy-do').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(lastCreatedCode); V.toast('Nomor DO berhasil disalin.'); }
    catch { alert(`Nomor DO kamu: ${lastCreatedCode}`); }
  });
  modal.addEventListener('click', (event) => { if (event.target === modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); } });
  populateBooks(); renderCart();
});
