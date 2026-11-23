/* ============================================
   DASHBOARD.JS — Gestión de vista y roles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Proteger ruta: Redirigir si no hay sesión iniciada
  const currentUser = window.StorageManager ? window.StorageManager.getCurrentUser() : null;

  if (!currentUser) {
    window.location.href = 'login.html?redirect=dashboard.html';
    return;
  }

  // 2. Renderizar datos de usuario en la interfaz
  renderUserInfo(currentUser);

  // 3. Renderizar vista según rol (Admin vs Cliente)
  const isAdmin = currentUser.role === 'admin' || currentUser.email === 'admin@reservapro.com';
  configureDashboardView(currentUser, isAdmin);

  // 4. Configurar eventos de cierre de sesión
  setupLogout();
});

function renderUserInfo(user) {
  // Iniciales del usuario
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'US';

  document.querySelectorAll('.avatar').forEach(avatar => {
    avatar.textContent = initials;
  });

  // Nombre y correo/negocio en sidebar
  const userNameElem = document.querySelector('.sidebar-user-info strong');
  const userSubElem = document.querySelector('.sidebar-user-info span');

  if (userNameElem) userNameElem.textContent = user.name || user.email;
  if (userSubElem) userSubElem.textContent = user.businessName || 'Cliente Registrado';
}

function configureDashboardView(user, isAdmin) {
  const statsSection = document.querySelector('.stats-grid');
  const activityPanel = document.querySelector('.activity-list')?.closest('.panel');
  const titleElem = document.querySelector('.dashboard-header h1');

  // Si es un cliente normal, ocultar estadísticas administrativas y actividad ajena
  if (!isAdmin) {
    if (titleElem) titleElem.textContent = 'Mi Panel de Reservas';

    // Ocultar métricas globales
    if (statsSection) statsSection.style.display = 'none';

    // Ocultar sección de actividad reciente global
    if (activityPanel) activityPanel.style.display = 'none';
  }

  // Cargar tabla de reservas filtrada
  renderReservationsTable(user, isAdmin);
}

function renderReservationsTable(user, isAdmin) {
  const tbody = document.querySelector('.data-table tbody');
  if (!tbody) return;

  const allReservations = window.StorageManager ? window.StorageManager.getReservations() : [];

  // Filtrar: El cliente solo ve sus reservas; el Admin ve todas
  const userReservations = isAdmin
    ? allReservations
    : allReservations.filter(r => r.userEmail === user.email || r.userName === user.name);

  if (userReservations.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 2rem; color: var(--color-text-soft);">
          No tienes reservas agendadas actualmente. <a href="reservas.html" style="color: var(--color-primary); font-weight: 600;">Agendar cita aquí</a>.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = userReservations.map(res => `
    <tr>
      <td>
        <div class="cell-user">
          <div class="avatar" style="width:32px;height:32px;font-size:.75rem; background: var(--color-primary); color: #fff;">
            ${(res.userName || 'US').substring(0, 2).toUpperCase()}
          </div>
          <strong>${res.userName || user.name || 'Cliente'}</strong>
        </div>
      </td>
      <td>${res.service || 'Servicio General'}</td>
      <td>${res.time || '10:00 AM'} (${res.date || 'Hoy'})</td>
      <td><span class="badge badge-success">Confirmada</span></td>
    </tr>
  `).join('');
}

function setupLogout() {
  // Agregar evento de clic a avatares o botones de perfil para cerrar sesión
  const userAvatars = document.querySelectorAll('.avatar, .sidebar-user');
  
  userAvatars.forEach(elem => {
    elem.style.cursor = 'pointer';
    elem.setAttribute('title', 'Clic para cerrar sesión');
    
    elem.addEventListener('click', () => {
      if (confirm('¿Deseas cerrar tu sesión actual?')) {
        if (window.StorageManager) {
          window.StorageManager.setCurrentUser(null);
        } else {
          localStorage.removeItem('currentUser');
        }
        if (window.ToastManager) window.ToastManager.show('Sesión cerrada correctamente.', 'info');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      }
    });
  });
}