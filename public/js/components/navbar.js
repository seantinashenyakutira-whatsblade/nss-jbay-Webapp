import { $, $$ } from '../utils.js';

class Navbar {
  constructor() {
    this.hamburger = $('.navbar__hamburger');
    this.mobileNav = $('.navbar__mobile');
    this.overlay = $('.navbar__mobile-overlay');
    this.dropdowns = $$('[data-dropdown]');

    if (this.hamburger) this.initHamburger();
    if (this.dropdowns.length) this.initDropdowns();
  }

  initHamburger() {
    this.hamburger.addEventListener('click', () => {
      const isOpen = this.hamburger.classList.toggle('active');
      this.mobileNav.classList.toggle('open', isOpen);
      this.mobileNav.hidden = !isOpen;
      this.overlay.classList.toggle('open', isOpen);
      this.hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeMobile());
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) this.closeMobile();
    });
  }

  closeMobile() {
    this.hamburger.classList.remove('active');
    this.mobileNav.classList.remove('open');
    this.mobileNav.hidden = true;
    this.overlay.classList.remove('open');
    this.hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  initDropdowns() {
    this.dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector('[data-dropdown-toggle]');
      const menu = dropdown.querySelector('[data-dropdown-menu]');

      if (!toggle || !menu) return;

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Navbar();
});
