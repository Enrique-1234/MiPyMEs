/* ============================================
   ANIMATIONS.JS
   Scroll reveal, microinteracciones y flujo de reservas
   ============================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    /* ============================================
       SCROLL REVEAL
       ============================================ */

    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealElements.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    } else {
      // Fallback: mostrar todo
      revealElements.forEach(el => el.classList.add('visible'));
    }

    /* ============================================
       FLUJO DE RESERVAS (multi-paso)
       ============================================ */

    const bookingPanels = document.querySelectorAll('.booking-panel');
    if (bookingPanels.length) {
      initBookingFlow();
    }

    /* ============================================
       MAPA DE MESAS (Restaurante)
       ============================================ */

    const tableNodes = document.querySelectorAll('.table-node');
    if (tableNodes.length) {
      initTableMap();
    }

  });

  /* ============================================
     FLUJO DE RESERVAS
     ============================================ */

  function initBookingFlow() {
    const panels = document.querySelectorAll('.booking-panel');
    const steps = document.querySelectorAll('.booking-step');
    const connectors = document.querySelectorAll('.booking-step-connector');

    const state = {
      service: null,
      date: null,
      time: null
    };

    function goToStep(stepNumber) {
      // Paneles
      panels.forEach(p => {
        p.classList.toggle('active', parseInt(p.dataset.panel) === stepNumber);
      });

      // Steps
      steps.forEach(s => {
        const num = parseInt(s.dataset.step);
        s.classList.toggle('active', num === stepNumber);
        s.classList.toggle('completed', num < stepNumber);
      });

      // Conectores
      connectors.forEach((c, i) => {
        const stepIdx = i + 1;
        c.style.background = stepIdx < stepNumber
          ? 'var(--color-primary)'
          : 'var(--color-border)';
      });

      // Scroll al inicio del contenido
      const content = document.querySelector('.booking-content');
      if (content) {
        const top = content.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }

    // Botones "Continuar"
    document.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = parseInt(btn.dataset.next);
        goToStep(next);
      });
    });

    // Botones "Atrás"
    document.querySelectorAll('[data-prev]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prev = parseInt(btn.dataset.prev);
        goToStep(prev);
      });
    });

    // Selección de servicio
    panels.forEach(panel => {
      const stepNum = parseInt(panel.dataset.panel);

      if (stepNum === 1) {
        const cards = panel.querySelectorAll('.select-card');
        const nextBtn = panel.querySelector('[data-next]');

        cards.forEach(card => {
          card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.service = card.dataset.value;
            if (nextBtn) nextBtn.disabled = false;
          });
        });
      }

      if (stepNum === 2) {
        const cards = panel.querySelectorAll('.select-card');
        const nextBtn = panel.querySelector('[data-next]');

        cards.forEach(card => {
          card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.date = card.dataset.value;
            if (nextBtn) nextBtn.disabled = false;
          });
        });
      }

      if (stepNum === 3) {
        const slots = panel.querySelectorAll('.time-slot:not(:disabled)');
        const nextBtn = panel.querySelector('[data-next]');

        slots.forEach(slot => {
          slot.addEventListener('click', () => {
            panel.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            state.time = slot.textContent.trim();
            if (nextBtn) nextBtn.disabled = false;
          });
        });
      }
    });

    // Botón "Nueva reserva" en confirmación
    const newBtn = document.getElementById('newBooking');
    newBtn?.addEventListener('click', () => {
      // Reset
      document.querySelectorAll('.select-card').forEach(c => c.classList.remove('selected'));
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      document.querySelectorAll('[data-next]').forEach(b => b.disabled = true);
      state.service = state.date = state.time = null;

      // Ir al paso 1
      goToStep(1);
      ToastManager.show('Listo para una nueva reserva.', 'info');
    });
  }

  /* ============================================
     MAPA DE MESAS
     ============================================ */

  function initTableMap() {
    const nodes = document.querySelectorAll('.table-node.available, .table-node.selected');
    const label = document.getElementById('mesaSeleccionada');
    const reservarBtn = document.getElementById('reservarMesa');

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        if (node.classList.contains('occupied')) return;

        document.querySelectorAll('.table-node').forEach(n => {
          if (!n.classList.contains('occupied')) {
            n.classList.remove('selected');
            n.classList.add('available');
          }
        });

        node.classList.remove('available');
        node.classList.add('selected');

        const num = node.dataset.table;
        const zone = parseInt(num) > 8 ? 'Terraza' : 'Principal';
        if (label) label.textContent = `M${num} · ${zone}`;
      });
    });

    reservarBtn?.addEventListener('click', () => {
      ToastManager.show('Mesa reservada correctamente (demo visual).', 'success');
    });
  }

})();