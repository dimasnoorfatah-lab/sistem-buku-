document.addEventListener('DOMContentLoaded', () => {
  const V = window.Smartbook;
  const host = document.getElementById('report-table');
  document.getElementById('footer-year').textContent = new Date().getFullYear();
  const isDone = (status) => /selesai|diterima/i.test(status || '');
  const itemCount = (order) => (order.items || []).reduce((sum, item) => sum + Number(item.qty || 1), 0);

  function render() {
    const orders = V.getOrders();
    const totalRevenue = orders.reduce((sum, order) => sum + V.parseMoney(order.total), 0);
    const done = orders.filter((order) => isDone(order.status)).length;
    document.getElementById('report-order-count').textContent = orders.length;
    document.getElementById('report-revenue').textContent = V.money(totalRevenue);
    document.getElementById('report-active').textContent = orders.length - done;
    document.getElementById('report-done').textContent = done;
    const query = document.getElementById('report-search').value.trim().toLowerCase();
    const filter = document.getElementById('status-filter').value;
    const filtered = [...orders].reverse().filter((order) => {
      const text = `${order.nomorDO} ${order.nama} ${order.status}`.toLowerCase();
      return text.includes(query) && (filter === 'all' || (filter === 'done' ? isDone(order.status) : !isDone(order.status)));
    });
    host.innerHTML = filtered.map((order) => `<tr><td><strong>${V.escapeHTML(order.nomorDO)}</strong></td><td>${V.escapeHTML(order.nama || '-')}</td><td>${V.escapeHTML(order.tanggalKirim || '-')}</td><td>${itemCount(order)} buku</td><td><strong>${V.money(order.total)}</strong></td><td><span class="pill ${V.statusClass(order.status)}">${V.escapeHTML(order.status || 'Diproses')}</span></td><td><a class="btn btn-outline btn-sm" href="tracking.html?do=${encodeURIComponent(order.nomorDO)}">Lihat ↗</a></td></tr>`).join('');
    document.getElementById('report-empty').hidden = filtered.length > 0;
  }
  document.getElementById('report-search').addEventListener('input', render);
  document.getElementById('status-filter').addEventListener('change', render);
  document.getElementById('print-report').addEventListener('click', () => window.print());
  render();
});
