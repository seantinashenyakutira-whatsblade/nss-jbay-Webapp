import { $, $$, fetchJson, formatCurrency, getUrlParam } from '../utils.js';
import { toast } from './toast.js';

class BookingWidget {
  constructor() {
    this.unitSelect = $('#unitId');
    this.durationSelect = $('#duration');
    this.startDateInput = $('#startDate');
    this.summaryEl = $('#booking-summary');
    this.form = $('#booking-form');
    this.csrfToken = document.querySelector('[name="_csrf"]')?.value || '';

    if (this.unitSelect) this.init();
  }

  init() {
    this.unitSelect.addEventListener('change', () => this.updatePricing());
    if (this.durationSelect) {
      this.durationSelect.addEventListener('change', () => this.updateSummary());
    }
    if (this.startDateInput) {
      this.startDateInput.addEventListener('change', () => this.updateSummary());
    }

    const preselected = getUrlParam('unit');
    if (preselected && this.unitSelect) {
      const option = this.unitSelect.querySelector(`option[value="${preselected}"]`);
      if (option) {
        this.unitSelect.value = preselected;
        this.updatePricing();
      }
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  async updatePricing() {
    const unitId = this.unitSelect.value;
    if (!unitId) {
      if (this.summaryEl) this.summaryEl.innerHTML = '<p style="color:var(--clr-text-dim);font-size:var(--text-sm);">Select a unit to see pricing.</p>';
      return;
    }

    try {
      const data = await fetchJson(`/api/units/${unitId}`);

      if (this.durationSelect && data.pricing) {
        this.durationSelect.innerHTML = data.pricing.map((p) => `
          <option value="${p.months}" data-total="${p.total}">
            ${p.months} Month${p.months > 1 ? 's' : ''} ${p.discount > 0 ? '— ' + p.discount + '% off' : ''}
          </option>
        `).join('');
      }

      this.updateSummary();
    } catch (err) {
      console.error('Failed to load unit pricing:', err);
    }
  }

  updateSummary() {
    const unitId = this.unitSelect?.value;
    const duration = parseInt(this.durationSelect?.value || 1);
    const startDate = this.startDateInput?.value;

    if (!unitId || !this.summaryEl) return;

    const selectedOption = this.unitSelect.options[this.unitSelect.selectedIndex];
    const unitName = selectedOption ? selectedOption.text.split(' — ')[0] : 'Unit';
    const durationOption = this.durationSelect?.options[this.durationSelect.selectedIndex];
    const totalText = durationOption?.dataset.total;

    this.summaryEl.innerHTML = `
      <div class="summary-row">
        <span>Unit</span>
        <span>${unitName}</span>
      </div>
      <div class="summary-row">
        <span>Duration</span>
        <span>${duration} Month${duration > 1 ? 's' : ''}</span>
      </div>
      ${startDate ? `<div class="summary-row"><span>Start Date</span><span>${new Date(startDate).toLocaleDateString('en-ZA')}</span></div>` : ''}
      <div class="summary-total">
        <span>Total</span>
        <span>${totalText ? formatCurrency(totalText) : '—'}</span>
      </div>
    `;
  }

  async handleSubmit(e) {
    e.preventDefault();

    const submitBtn = this.form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('btn--loading');
    }

    try {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch(this.form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': this.csrfToken },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || 'Booking confirmed!');
        if (result.redirect) {
          setTimeout(() => window.location.href = result.redirect, 1000);
        }
      } else {
        toast.error(result.error || 'Booking failed. Please try again.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn--loading');
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BookingWidget();
});
