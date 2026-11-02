document.addEventListener('DOMContentLoaded', () => {
  const V = window.Smartbook;
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam';
  document.getElementById('greeting-label').textContent = greeting;
  const user = V.getCurrentUser();
  document.getElementById('greeting-title').textContent = `${greeting}, ${user?.nama?.split(' ')[0] || 'Sahabat baca'}!`;
  document.getElementById('footer-year').textContent = now.getFullYear();

  const books = V.getBooks();
  const orders = V.getOrders();
  document.getElementById('stat-books').textContent = books.length;
  document.getElementById('stat-stock').textContent = books.reduce((sum, book) => sum + (Number(book.stok) || 0), 0).toLocaleString('id-ID');
  document.getElementById('stat-orders').textContent = orders.length;
  document.getElementById('stat-shipping').textContent = orders.filter((order) => /perjalanan|dikirim|diproses/i.test(order.status || '')).length;

  const recent = [...orders].reverse().slice(0, 4);
  const host = document.getElementById('recent-orders');
  if (!recent.length) {
    host.innerHTML = '<div class="empty-state"><span class="empty-icon">▣</span>Belum ada transaksi.</div>';
    return;
  }
  host.innerHTML = recent.map((order) => `
    <a class="activity-item" href="transaksi.html">
      <div class="icon-box ${V.statusClass(order.status) === 'success' ? 'green' : 'orange'}" style="width:36px;height:36px;font-size:15px">▣</div>
      <div class="activity-detail"><strong>${V.escapeHTML(order.nama || 'Pemesan')}</strong><p>${V.escapeHTML(order.nomorDO || order.id)} · ${V.money(order.total)}</p></div>
      <span class="pill ${V.statusClass(order.status)}">${V.escapeHTML(order.status || 'Diproses')}</span>
    </a>`).join('');
});
