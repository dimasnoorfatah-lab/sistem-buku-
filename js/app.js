(function () {
  const STORAGE = {
    user: 'smartbookCurrentUser',
    users: 'smartbookUsers',
    books: 'smartbookBooks',
    orders: 'smartbookOrders'
  };

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn(`Data ${key} tidak dapat dibaca.`, error);
      return fallback;
    }
  }

  function getUsers() {
    const source = Array.isArray(dataPengguna) ? dataPengguna : [];
    const saved = readJSON(STORAGE.users, []);
    const users = [...source];
    saved.forEach((user) => {
      if (!users.some((item) => item.email.toLowerCase() === user.email.toLowerCase())) users.push(user);
    });
    return users;
  }

  function saveUser(user) {
    const saved = readJSON(STORAGE.users, []);
    saved.push(user);
    localStorage.setItem(STORAGE.users, JSON.stringify(saved));
  }

  function getBooks() {
    const saved = readJSON(STORAGE.books, null);
    return Array.isArray(saved) ? saved : JSON.parse(JSON.stringify(dataKatalogBuku || []));
  }

  function saveBooks(books) {
    localStorage.setItem(STORAGE.books, JSON.stringify(books));
  }

  function getOrders() {
    const saved = readJSON(STORAGE.orders, null);
    if (Array.isArray(saved)) return saved;
    return Object.values(dataTracking || {}).map((order, index) => ({
      id: `TRX-${order.nomorDO}`,
      nomorDO: order.nomorDO,
      nama: order.nama,
      email: (getUsers().find((user) => user.nama === order.nama) || {}).email || '-',
      status: order.status,
      ekspedisi: order.ekspedisi,
      tanggalKirim: order.tanggalKirim,
      paket: order.paket,
      total: order.total,
      alamat: '-',
      metodePembayaran: 'Transfer bank',
      items: [{ nama: index === 0 ? 'Pengantar Ilmu Komunikasi' : 'Manajemen Keuangan', qty: 1 }],
      perjalanan: order.perjalanan || []
    }));
  }

  function saveOrders(orders) {
    localStorage.setItem(STORAGE.orders, JSON.stringify(orders));
  }

  function getTrackingByCode(code) {
    const normalized = String(code || '').trim().toUpperCase();
    const legacy = Object.values(dataTracking || {}).find((item) => String(item.nomorDO).toUpperCase() === normalized);
    const orders = getOrders();
    const order = orders.find((item) => String(item.nomorDO).toUpperCase() === normalized);
    return order || legacy || null;
  }

  function parseMoney(value) {
    if (typeof value === 'number') return value;
    return Number(String(value || '').replace(/[^0-9]/g, '')) || 0;
  }

  function money(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(parseMoney(value));
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function toast(message, type = 'success') {
    let element = document.querySelector('.toast');
    if (!element) {
      element = document.createElement('div');
      element.className = 'toast';
      element.setAttribute('role', 'status');
      element.innerHTML = '<span class="toast-icon">✓</span><span class="toast-message"></span>';
      document.body.appendChild(element);
    }
    const icon = element.querySelector('.toast-icon');
    icon.textContent = type === 'error' ? '!' : '✓';
    icon.style.color = type === 'error' ? 'var(--red)' : 'var(--green)';
    element.querySelector('.toast-message').textContent = message;
    element.classList.add('show');
    clearTimeout(element._hideTimer);
    element._hideTimer = setTimeout(() => element.classList.remove('show'), 3200);
  }

  function statusClass(status) {
    const value = String(status || '').toLowerCase();
    if (value.includes('selesai') || value.includes('diterima')) return 'success';
    if (value.includes('perjalanan') || value.includes('dikirim')) return 'info';
    if (value.includes('batal') || value.includes('gagal')) return 'danger';
    return 'warning';
  }

  function getCurrentUser() {
    return readJSON(STORAGE.user, null);
  }

  function setCurrentUser(user) {
    localStorage.setItem(STORAGE.user, JSON.stringify(user));
  }

  function logout() {
    localStorage.removeItem(STORAGE.user);
    window.location.href = 'login.html';
  }

  function protectPage() {
    const path = window.location.pathname.split('/').pop();
    if (path === 'login.html' || path === '' || path === 'index.html') return;
    if (!getCurrentUser()) window.location.replace('login.html');
  }

  function initApplication() {
    protectPage();
    const user = getCurrentUser();
    if (user) {
      document.querySelectorAll('[data-user-name]').forEach((el) => el.textContent = user.nama || 'Pengguna Smartbook');
      document.querySelectorAll('[data-user-role]').forEach((el) => el.textContent = user.role || 'User');
      document.querySelectorAll('[data-user-initial]').forEach((el) => {
        const words = String(user.nama || 'V').trim().split(/\s+/);
        el.textContent = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : words[0].slice(0, 2).toUpperCase();
      });
    }
    document.querySelectorAll('.logout-button').forEach((button) => button.addEventListener('click', logout));
    document.querySelectorAll('.mobile-menu').forEach((button) => button.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.toggle('open');
    }));
    document.querySelectorAll('.sidebar a').forEach((link) => link.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.remove('open');
    }));
    document.querySelectorAll('[data-current-date]').forEach((el) => {
      el.textContent = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    });
  }

  window.Smartbook = {
    getUsers, saveUser, getBooks, saveBooks, getOrders, saveOrders, getTrackingByCode,
    parseMoney, money, escapeHTML, toast, statusClass, getCurrentUser, setCurrentUser,
    logout, readJSON
  };

  document.addEventListener('DOMContentLoaded', initApplication);
})();
