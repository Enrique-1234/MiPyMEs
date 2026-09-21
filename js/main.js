/* ============================================
   MAIN.JS
   Interacciones visuales generales
   ============================================ */

(function () {
  'use strict';

  /* ============================================
     TOASTS
     ============================================ */

  const ToastManager = {
    container: null,

    init() {
      this.container = document.getElementById('toastContainer');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.id = 'toastContainer';
        this.container.setAttribute('aria-live', 'polite');
        document.body.appendChild(this.container);
      }
    },

    show(message, type = 'info', title = '') {
      if (!this.container) this.init();

      const icons = {
        success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>',
        error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
        info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
      };

      const titles = {
        success: 'Éxito',
        error: 'Error',
        info: 'Información'
      };

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        ${icons[type] || icons.info}
        <div class="toast-content">
          <strong>${title || titles[type] || ''}</strong>
          <p>${message}</p>
        </div>
        <button class="toast-close" aria-label="Cerrar notificación">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;

      this.container.appendChild(toast);

      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.remove(toast));

      setTimeout(() => this.remove(toast), 4500);
    },

    remove(toast) {
      if (!toast.parentNode) return;
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }
  };

  window.ToastManager = ToastManager;

  /* ============================================
     FORMULARIOS - Validación visual
     ============================================ */

  function initForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        let valid = true;

        // Validar email
        if (!email.value || !email.value.includes('@')) {
          email.classList.add('error');
          document.getElementById('emailHelper').textContent = 'Introduce un correo válido.';
          document.getElementById('emailHelper').className = 'form-helper error';
          valid = false;
        } else {
          email.classList.remove('error');
          email.classList.add('success');
          document.getElementById('emailHelper').textContent = '';
        }

        // Validar password
        if (!password.value || password.value.length < 6) {
          password.classList.add('error');
          document.getElementById('passwordHelper').textContent = 'La contraseña debe tener al menos 6 caracteres.';
          document.getElementById('passwordHelper').className = 'form-helper error';
          valid = false;
        } else {
          password.classList.remove('error');
          password.classList.add('success');
          document.getElementById('passwordHelper').textContent = '';
        }

        if (!valid) return;

        const btn = document.getElementById('loginBtn');
        btn.classList.add('loading');

        setTimeout(() => {
          btn.classList.remove('loading');
          ToastManager.show('Sesión iniciada correctamente (demo visual).', 'success');
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
        }, 1500);
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('registerBtn');
        btn.classList.add('loading');

        setTimeout(() => {
          btn.classList.remove('loading');
          ToastManager.show('Cuenta creada correctamente (demo visual).', 'success');
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
        }, 1500);
      });
    }
  }

  /* ============================================
     MODAL genérico
     ============================================ */

  function initModals() {
    const modal = document.getElementById('confirmModal');
    if (!modal) return;

    const closeBtn = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('modalCancel');
    const confirmBtn = document.getElementById('modalConfirm');

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    confirmBtn?.addEventListener('click', () => {
      closeModal();
      ToastManager.show('Reserva confirmada correctamente.', 'success');
    });

    window.openConfirmModal = () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
  }

  /* ============================================
     BOTONES CON FEEDBACK
     ============================================ */

  function initButtonFeedback() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function () {
        if (this.classList.contains('loading')) return;
        this.style.transform = 'scale(0.97)';
        setTimeout(() => { this.style.transform = ''; }, 120);
      });
    });
  }

  /* ============================================
     INICIALIZACIÓN
     ============================================ */

  document.addEventListener('DOMContentLoaded', () => {
    ToastManager.init();
    initForms();
    initModals();
    initButtonFeedback();
  });
})();