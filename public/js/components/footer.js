class Footer {
  constructor() {
    this.yearEl = document.querySelector('.footer__bottom-year');
    if (this.yearEl) {
      this.yearEl.textContent = new Date().getFullYear();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Footer();
});
