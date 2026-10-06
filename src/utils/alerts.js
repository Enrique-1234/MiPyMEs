// src/utils/alerts.js
import Swal from 'sweetalert2';

// ============================================================
// Configuración base (tema oscuro AlPunto)
// ============================================================
const baseConfig = {
  background: '#1C1C1C',
  color: '#F5F5F5',
  confirmButtonColor: '#FF6B00',
  cancelButtonColor: '#2A2A2A',
  reverseButtons: true,
  customClass: {
    popup: 'alpunto-swal-popup',
  },
};

// ============================================================
// Toasts (notificaciones no intrusivas)
// ============================================================
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  ...baseConfig,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const toast = {
  success: (message) => Toast.fire({ icon: 'success', title: message }),
  error: (message) => Toast.fire({ icon: 'error', title: message }),
  info: (message) => Toast.fire({ icon: 'info', title: message }),
  warning: (message) => Toast.fire({ icon: 'warning', title: message }),
};

// ============================================================
// Diálogo de confirmación (reemplaza window.confirm)
// ============================================================
export const confirmDialog = async ({
  title = '¿Estás seguro?',
  text = '',
  confirmText = 'Sí, continuar',
  cancelText = 'Cancelar',
  danger = false,
  icon = 'warning',
} = {}) => {
  const result = await Swal.fire({
    ...baseConfig,
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: danger ? '#EF4444' : '#FF6B00',
    focusCancel: danger,
  });
  return result.isConfirmed;
};

// ============================================================
// Diálogo de alerta (reemplaza window.alert)
// ============================================================
export const alertDialog = async ({
  title = 'Aviso',
  text = '',
  confirmText = 'Entendido',
  icon = 'info',
} = {}) => {
  await Swal.fire({
    ...baseConfig,
    title,
    text,
    icon,
    confirmButtonText: confirmText,
  });
};