document.addEventListener('DOMContentLoaded', () => {
  const V = window.Smartbook;
  const result = document.getElementById('tracking-result');
  const empty = document.getElementById('tracking-empty');
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  const statusIndex = (status) => {
    const value = String(status || '').toLowerCase();
    if (value.includes('selesai') || value.includes('diterima')) return 3;
    if (value.includes('perjalanan') || value.includes('dikirim')) return 2;
    if (value.includes('diproses') || value.includes('dikemas')) return 1;
    return 0;
  };

  function render(order) {
    const currentStep = statusIndex(order.status);
    const steps = ['Pesanan diterima', 'Sedang diproses', 'Dalam perjalanan', 'Selesai diantar'];
    let journey = Array.isArray(order.perjalanan) ? [...order.perjalanan] : [];
    if (!journey.length) {
      journey = [{ waktu: order.tanggalKirim || '-', keterangan: 'Pesanan tercatat di sistem Smartbook.' }];
      if (currentStep >= 1) journey.push({ waktu: order.tanggalKirim || '-', keterangan: 'Buku sedang diproses dan disiapkan untuk dikirim.' });
      if (currentStep >= 2) journey.push({ waktu: order.tanggalKirim || '-', keterangan: `Paket diserahkan kepada ekspedisi ${order.ekspedisi || 'JNE'}.` });
      if (currentStep >= 3) journey.push({ waktu: order.tanggalKirim || '-', keterangan: 'Paket telah diterima oleh pemesan.' });
    }
    result.innerHTML = `
      <section class="card">
        <div class="tracking-hero"><div><span class="eyebrow">Nomor DO</span><h2>${V.escapeHTML(order.nomorDO)}</h2><p>Nama pemesan: <strong style="color:var(--ink)">${V.escapeHTML(order.nama || '-')}</strong></p><p style="margin-top:5px">Tanggal kirim: ${V.escapeHTML(order.tanggalKirim || '-')}</p></div><span class="pill ${V.statusClass(order.status)}">● ${V.escapeHTML(order.status || 'Diproses')}</span></div>
        <div class="progress-steps">${steps.map((label, index) => `<div class="progress-step ${index <= currentStep ? 'done' : ''}"><span class="progress-dot">${index <= currentStep ? '✓' : index + 1}</span><strong>${label}</strong></div>`).join('')}</div>
        <div class="section-heading"><div><h2>Detail pengiriman</h2><p>Informasi ekspedisi dan pembayaran pesanan.</p></div><span class="icon-box" style="width:38px;height:38px">↗</span></div>
        <div class="tracking-details"><div class="detail-tile"><span>Ekspedisi</span><strong>${V.escapeHTML(order.ekspedisi || 'JNE')}</strong></div><div class="detail-tile"><span>Jenis paket</span><strong>${V.escapeHTML(order.paket || 'Reguler')}</strong></div><div class="detail-tile"><span>Total pembayaran</span><strong>${V.money(order.total)}</strong></div><div class="detail-tile"><span>Metode pembayaran</span><strong>${V.escapeHTML(order.metodePembayaran || 'Transfer bank')}</strong></div></div>
        <div class="section-heading" style="margin-top:26px"><div><h2>Riwayat perjalanan</h2><p>Update status pengiriman paket.</p></div></div>
        <div class="timeline">${journey.slice().reverse().map((entry) => `<div class="timeline-item"><span class="timeline-dot"></span><div><time>${V.escapeHTML(entry.waktu || '-')}</time><strong>${V.escapeHTML(entry.keterangan || 'Status pengiriman diperbarui.')}</strong></div></div>`).join('')}</div>
        ${order.alamat && order.alamat !== '-' ? `<div style="margin-top:25px;padding-top:18px;border-top:1px solid var(--line)"><span class="muted small">ALAMAT PENERIMA</span><p style="margin:5px 0 0;font-size:12px">${V.escapeHTML(order.nama)} · ${V.escapeHTML(order.telepon || '')}<br>${V.escapeHTML(order.alamat)}${order.kota ? ', ' + V.escapeHTML(order.kota) : ''}</p></div>` : ''}
      </section>`;
    result.hidden = false;
    empty.hidden = true;
  }

  function searchCode(code) {
    const normalized = String(code || '').trim();
    if (!normalized) { V.toast('Masukkan nomor DO terlebih dahulu.', 'error'); return; }
    const order = V.getTrackingByCode(normalized);
    if (!order) {
      result.hidden = true;
      empty.hidden = false;
      empty.innerHTML = '<span class="empty-icon">⌕</span><strong style="display:block;color:var(--ink);margin-bottom:5px">Nomor DO tidak ditemukan</strong>Pastikan nomor delivery order benar, lalu coba lagi.';
      V.toast('Nomor DO tidak ditemukan. Periksa kembali input kamu.', 'error');
      return;
    }
    render(order);
  }

  document.getElementById('tracking-form').addEventListener('submit', (event) => {
    event.preventDefault();
    searchCode(document.getElementById('do-number').value);
  });
  document.querySelectorAll('[data-sample-do]').forEach((button) => button.addEventListener('click', () => {
    document.getElementById('do-number').value = button.dataset.sampleDo;
    searchCode(button.dataset.sampleDo);
  }));
  const params = new URLSearchParams(window.location.search);
  if (params.get('do')) {
    document.getElementById('do-number').value = params.get('do');
    searchCode(params.get('do'));
  }
});
