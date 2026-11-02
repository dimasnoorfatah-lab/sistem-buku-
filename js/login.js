document.addEventListener('DOMContentLoaded', () => {
  const V = window.Smartbook;
  document.getElementById('year').textContent = new Date().getFullYear();

  if (V.getCurrentUser()) window.location.replace('dashboard.html');

  const openModal = (id) => {
    document.getElementById(id)?.classList.add('open');
    document.getElementById(id)?.setAttribute('aria-hidden', 'false');
  };
  const closeModal = (modal) => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('[data-open-modal]').forEach((button) => button.addEventListener('click', () => openModal(button.dataset.openModal)));
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => closeModal(button.closest('.modal-backdrop'))));
  document.querySelectorAll('.modal-backdrop').forEach((modal) => modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal(modal);
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') document.querySelectorAll('.modal-backdrop.open').forEach(closeModal);
  });

  document.querySelectorAll('[data-demo-email]').forEach((button) => button.addEventListener('click', () => {
    document.getElementById('email').value = button.dataset.demoEmail;
    document.getElementById('password').value = button.dataset.demoPassword;
    document.getElementById('email').focus();
  }));

  document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const user = V.getUsers().find((item) => item.email.toLowerCase() === email && item.password === password);
    if (!user) {
      alert('email/password yang anda masukkan salah');
      return;
    }
    V.setCurrentUser({ id: user.id || Date.now(), nama: user.nama, email: user.email, role: user.role || 'User' });
    window.location.href = 'dashboard.html';
  });

  document.getElementById('forgot-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('forgot-email').value.trim().toLowerCase();
    const user = V.getUsers().find((item) => item.email.toLowerCase() === email);
    if (user) alert(`Akun ditemukan untuk ${user.email}. Untuk demo, gunakan password yang dibuat saat pendaftaran.`);
    else alert('Email belum terdaftar di Smartbook. Periksa kembali alamat email kamu.');
    closeModal(document.getElementById('forgot-modal'));
  });

  document.getElementById('register-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const nama = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    if (nama.length < 3 || password.length < 6) {
      alert('Nama minimal 3 karakter dan password minimal 6 karakter.');
      return;
    }
    if (V.getUsers().some((user) => user.email.toLowerCase() === email)) {
      alert('Email sudah terdaftar. Silakan login.');
      return;
    }
    V.saveUser({ id: Date.now(), nama, email, password, role: 'User' });
    closeModal(document.getElementById('register-modal'));
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
    alert('Pendaftaran berhasil! Kamu bisa login sekarang.');
  });
});
