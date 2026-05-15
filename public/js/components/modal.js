import { $, $$, trapFocus, disableScroll, enableScroll } from '../utils.js';

class Modal {
  constructor() {
    this.root = $('#modal-root');
    this.activeModal = null;
  }

  open({ title, content, footer, size = '' }) {
    this.close();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    const modal = document.createElement('div');
    modal.className = `modal ${size ? 'modal--' + size : ''}`;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    if (title) modal.setAttribute('aria-labelledby', 'modal-title');

    modal.innerHTML = `
      <div class="modal__header">
        ${title ? `<h3 class="modal__title" id="modal-title">${title}</h3>` : ''}
        <button class="modal__close" data-close-modal aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
      ${content ? `<div class="modal__body">${content}</div>` : ''}
      ${footer ? `<div class="modal__footer">${footer}</div>` : ''}
    `;

    overlay.appendChild(modal);
    this.root.appendChild(overlay);
    this.activeModal = overlay;

    disableScroll();
    trapFocus(modal);

    const closeBtn = modal.querySelector('[data-close-modal]');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });

    setTimeout(() => modal.querySelector('button, a, input')?.focus(), 100);
  }

  close() {
    if (this.activeModal) {
      this.activeModal.remove();
      this.activeModal = null;
      enableScroll();
    }
  }

  confirm({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false } = {}) {
    return new Promise((resolve) => {
      this.open({
        title,
        size: 'sm',
        content: `<p style="color:var(--clr-text-muted);font-size:var(--text-sm);">${message}</p>`,
        footer: `
          <button class="btn btn--ghost" data-cancel-modal>${cancelText}</button>
          <button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" data-confirm-modal>${confirmText}</button>
        `,
      });

      const overlay = this.activeModal;
      overlay.querySelector('[data-confirm-modal]').addEventListener('click', () => {
        this.close();
        resolve(true);
      });
      overlay.querySelector('[data-cancel-modal]').addEventListener('click', () => {
        this.close();
        resolve(false);
      });
    });
  }
}

export const modal = new Modal();
