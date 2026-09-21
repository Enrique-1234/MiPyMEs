/* ============================================
   NAVIGATION.JS
   Navbar, menú móvil y scroll
   ============================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    /* ============================================
       EFECTO SCROLL NAVBAR
       ============================================ */

    function handleScroll() {
      if (!navbar) return;
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ============================================
       MENÚ MÓVIL
       ============================================ */

    function openMenu() {
      navToggle?.classList.add('active');
      navToggle?.setAttribute('aria-expanded', 'true');
      mobileMenu?.classList.add('open');
      mobileMenu?.setAttribute('aria-hidden', 'false');
      menuOverlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navToggle?.classList.remove('active');
      navToggle?.setAttribute('aria-expanded', 'false');
      mobileMenu?.classList.remove('open');
      mobileMenu?.setAttribute('aria-hidden', 'true');
      menuOverlay?.classList.remove('open');
      document.body.style.overflow = '';
    }

    navToggle?.addEventListener('click', () => {
      if (mobileMenu?.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menuOverlay?.addEventListener('click', closeMenu);

    // Cerrar al hacer click en un enlace del menú móvil
    mobileMenu?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    /* ============================================
       SCROLL SUAVE PARA ANCLAS
       ============================================ */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  });
})();S