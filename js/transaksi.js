document.addEventListener('DOMContentLoaded', () => {
  const V = window.Smartbook;
  const table = document.getElementById('history-table');
  const modal = document.getElementById('transaction-modal');
  const detailHost = document.getElementById('transaction-detail');
  document.getElementById('footer-year').textContent = new Date().getFullYear();
  const isDone = (status) => /selesai|diterima/i.test(status || '');

  function render() {
    const orders = V.getOrders();
    document.getElementById('history-count').textContent = orders.length;
    document.getElementById('history-complete').textContent = orders.filter((order) => isDone(order.status)).length;
    document.getElementById('history-progress').textContent = orders.filter((order) => !isDone(order.status)).length;
    const query = document.getElementById('history-search').value.trim().toLowerCase();
    const filter = document.getElementById('history-filter').value;
    const filtered = [...orders].reverse().filter((order) => `${order.nomorDO} ${order.id} ${order.nama} ${order.email}`.toLowerCase().includes(query) && (filter === 'all' || (filter === 'done' ? isDone(order.status) : !isDone(order.status))));
    table.innerHTML = filtered.map((order) => `<tr><td><strong>${V.escapeHTML(order.id || `TRX-${order.nomorDO}`)}</strong><span style="display:block;margin-top:3px;color:var(--muted);font-size:10px">DO: ${V.escapeHTML(order.nomorDO)}</span></td><td>${V.escapeHTML(order.nama || '-')}<span style="display:block;margin-top:3px;color:var(--muted);font-size:10px">${V.escapeHTML(order.email || '-')}</span></td><td>${V.escapeHTML(order.tanggalKirim || '-')}</td><td>${V.escapeHTML(order.metodePembayaran || '-')}</td><td><strong>${V.money(order.total)}</strong></td><td><span class="pill ${V.statusClass(order.status)}">${V.escapeHTML(order.status || 'Diproses')}</span></td><td><div style="display:flex;gap:7px"><button type="button" class="btn btn-outline btn-sm" data-detail="${V.escapeHTML(order.nomorDO)}">Detail</button><a class="btn btn-secondary btn-sm" href="tracking.html?do=${encodeURIComponent(order.nomorDO)}">Lacak</a></div></td></tr>`).join('');
    document.getElementById('history-empty').hidden = filtered.length > 0;
    table.querySelectorAll('[data-detail]').forEach((button) => button.addEventListener('click', () => openDetail(button.dataset.detail)));
  }

  function openDetail(code) {
    const order = V.getOrders().find((item) => String(item.nomorDO) === String(code));
    if (!order) return;
    const items = (order.items || []).map((item) => `<tr><td>${V.escapeHTML(item.nama || item.namaBarang || 'Buku')}</td><td>${Number(item.qty || 1)}</td><td>${V.money((item.harga || 0) * (item.qty || 1))}</td></tr>`).join('');
    detailHost.innerHTML = `<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:17px"><div><span class="muted small">NOMOR DO</span><div style="font-family:Manrope,sans-serif;font-weight:800;font-size:20px;color:var(--brand)">${V.escapeHTML(order.nomorDO)}</div></div><span class="pill ${V.statusClass(order.status)}">${V.escapeHTML(order.status || 'Diproses')}</span></div><div class="tracking-details" style="grid-template-columns:repeat(2,minmax(0,1fr));margin:0 0 16px"><div class="detail-tile"><span>Pemesan</span><strong>${V.escapeHTML(order.nama || '-')}</strong></div><div class="detail-tile"><span>Tanggal</span><strong>${V.escapeHTML(order.tanggalKirim || '-')}</strong></div><div class="detail-tile"><span>Ekspedisi</span><strong>${V.escapeHTML(order.ekspedisi || 'JNE')}</strong></div><div class="detail-tile"><span>Pembayaran</span><strong>${V.escapeHTML(order.metodePembayaran || '-')}</strong></div></div><h3 style="margin:0 0 8px">Barang dipesan</h3><div class="table-wrap"><table><thead><tr><th>Nama buku</th><th>Qty</th><th>Jumlah</th></tr></thead><tbody>${items || '<tr><td colspan="3">Detail item tidak tersedia pada data demo.</td></tr>'}</tbody></table></div><div class="total-row grand" style="margin-top:16px"><span>Total pembayaran</span><strong>${V.money(order.total)}</strong></div><div style="margin-top:13px;color:var(--muted);font-size:11px">Alamat: ${V.escapeHTML(order.alamat || '-')} ${order.kota ? ', ' + V.escapeHTML(order.kota) : ''}</div>`;
    document.getElementById('modal-track-link').href = `tracking.html?do=${encodeURIComponent(code)}`;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  }

  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }));
  modal.addEventListener('click', (event) => { if (event.target === modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); } });
  document.getElementById('history-search').addEventListener('input', render);
  document.getElementById('history-filter').addEventListener('change', render);
  render();
});
