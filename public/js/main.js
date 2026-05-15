document.addEventListener('DOMContentLoaded', () => {
  /* ─── Modal Helpers ─── */
  function openModal(el) {
    if (!el) return;
    el.removeAttribute('hidden');
    document.body.classList.add('modal-open');
    const focusable = el.querySelector('button:not([disabled]), a, input:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (focusable) setTimeout(() => focusable.focus(), 100);
  }

  function closeModal(el) {
    if (!el) return;
    el.setAttribute('hidden', '');
    const hasOpenModals = document.querySelectorAll('.modal-overlay:not([hidden])').length > 0;
    if (!hasOpenModals) document.body.classList.remove('modal-open');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openEl = document.querySelector('.modal-overlay:not([hidden])');
      if (openEl) closeModal(openEl);
    }
  });

  /* ─── Flash Auto-Dismiss ─── */
  document.querySelectorAll('.toast').forEach(el => {
    const isError = el.classList.contains('toast--error');
    if (!isError) {
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.5s';
        setTimeout(() => el.remove(), 500);
      }, 5000);
    } else {
      el.addEventListener('click', () => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s';
        setTimeout(() => el.remove(), 300);
      });
    }
  });

  /* ─── Auth Tab Switching ─── */
  const authTabs = document.querySelectorAll('.auth-tab');
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('tab-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  if (authTabs.length) {
    const activeTab = document.querySelector('.auth-tab.active') || authTabs[0];
    activeTab.click();
  }

  /* ─── Unit Search Filter ─── */
  const unitSearch = document.getElementById('unitSearch');
  const unitsGrid = document.getElementById('unitsGrid');
  const visibleCount = document.getElementById('visibleCount');

  if (unitSearch && unitsGrid) {
    const totalUnits = unitsGrid.querySelectorAll('.unit-card').length;
    unitSearch.addEventListener('input', () => {
      const term = unitSearch.value.toLowerCase().trim();
      let visible = 0;
      unitsGrid.querySelectorAll('.unit-card').forEach(card => {
        const searchText = card.dataset.search || card.textContent.toLowerCase();
        const match = !term || searchText.includes(term);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      if (visibleCount) visibleCount.textContent = visible;
    });
  }

  /* ─── Image Preview ─── */
  const imageInput = document.getElementById('unitImage');
  const preview = document.getElementById('imagePreview');
  if (imageInput && preview) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          preview.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;">`;
        };
        reader.readAsDataURL(file);
      } else {
        preview.innerHTML = '<span class="text-mono text-dim text-xs">Image preview</span>';
      }
    });
  }

  /* ─── Delete Confirmation ─── */
  window.confirmDelete = (id) => {
    if (confirm('Are you sure you want to deactivate this unit?')) {
      fetch(`/admin/units/${id}`, { method: 'DELETE' })
        .then(r => r.json())
        .then(data => {
          if (data.success) { window.location.reload(); }
          else { alert('Failed to delete unit'); }
        })
        .catch(() => alert('Failed to delete unit'));
    }
  };

  /* ─── Booking Status Update ─── */
  window.updateBookingStatus = (id, status) => {
    if (confirm(`Change booking status to "${status}"?`)) {
      fetch(`/bookings/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
        .then(() => window.location.reload())
        .catch(() => alert('Failed to update status'));
    }
  };

  /* ─── Bulk Pricing Update ─── */
  window.updateBulkPricing = (size) => {
    const monthly = document.querySelector(`[data-size="${size}"][data-type="monthly"]`);
    const annual = document.querySelector(`[data-size="${size}"][data-type="annual"]`);
    if (!monthly || !annual) return;
    const monthlyVal = monthly.value;
    const annualVal = annual.value;
    if (!monthlyVal && !annualVal) { alert('Enter at least one price'); return; }
    if (confirm(`Update all "${size}" units?`)) {
      fetch('/admin/pricing/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size, price_monthly: monthlyVal, price_annual: annualVal }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) { alert('Pricing updated!'); window.location.reload(); }
          else { alert('Failed to update pricing'); }
        })
        .catch(() => alert('Failed to update pricing'));
    }
  };

  /* ─── Payment Date Filter ─── */
  window.filterPayments = () => {
    const from = document.getElementById('paymentsFrom');
    const to = document.getElementById('paymentsTo');
    if (!from || !to) return;

    document.querySelectorAll('.table-wrap tbody tr').forEach(row => {
      const dateText = row.cells[0]?.textContent?.trim();
      if (!dateText) { row.style.display = ''; return; }
      const rowDate = new Date(dateText);
      const fromDate = from.value ? new Date(from.value) : null;
      const toDate = to.value ? new Date(to.value) : null;
      let show = true;
      if (fromDate && rowDate < fromDate) show = false;
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59);
        if (rowDate > endOfDay) show = false;
      }
      row.style.display = show ? '' : 'none';
    });
  };

  /* ─── Tab Navigation (filter by data-status) ─── */
  const rentalCardsList = document.getElementById('rental-cards-list');
  const rentalEmptyState = document.getElementById('rental-empty-state');
  const rentalEmptyMsg = document.getElementById('rental-empty-msg');

  document.querySelectorAll('.tab-nav__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      document.querySelectorAll('.tab-nav__btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (!rentalCardsList) return;

      let visibleCount = 0;
      rentalCardsList.querySelectorAll('.rental-card').forEach(card => {
        const status = card.dataset.status;
        const match = tabId === 'all' || status === tabId || (tabId === 'cancelled' && status === 'expired');
        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      if (rentalEmptyState) {
        if (visibleCount === 0) {
          rentalEmptyState.classList.remove('hidden');
          if (rentalEmptyMsg) {
            const labels = { active: 'active', completed: 'completed', cancelled: 'cancelled or expired' };
            rentalEmptyMsg.textContent = `No ${labels[tabId] || ''} rentals found.`;
          }
        } else {
          rentalEmptyState.classList.add('hidden');
        }
      }
    });
  });

  /* ─── Cancel Booking Modal ─── */
  const cancelModal = document.getElementById('cancel-modal');
  const cancelFormAction = document.getElementById('cancel-form');

  document.querySelectorAll('.js-cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookingId = btn.dataset.bookingId;
      const form = btn.closest('form');
      if (cancelModal && cancelFormAction) {
        cancelFormAction.action = form ? form.action : `/bookings/${bookingId}/cancel`;
        openModal(cancelModal);
      }
    });
  });

  if (cancelModal) {
    const closeBtn = cancelModal.querySelector('.modal__close');
    const cancelActionBtn = cancelModal.querySelector('.modal-cancel');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(cancelModal));
    }
    if (cancelActionBtn) {
      cancelActionBtn.addEventListener('click', () => closeModal(cancelModal));
    }
  }

  /* ─── Delete Account Modal ─── */
  const deleteBtn = document.getElementById('delete-account-btn');
  const deleteModal = document.getElementById('delete-modal');
  const deleteInput = document.getElementById('delete-confirm-input');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const deleteForm = document.getElementById('delete-form');
  const deleteConfirmHidden = document.getElementById('delete-confirm-hidden');

  if (deleteBtn && deleteModal && deleteInput && confirmDeleteBtn && deleteForm) {
    const userEmail = deleteBtn.getAttribute('data-user-email') || '';

    const closeBtn = deleteModal.querySelector('.modal__close');
    const cancelBtn = deleteModal.querySelector('.modal-cancel');

    deleteBtn.addEventListener('click', () => {
      openModal(deleteModal);
      deleteInput.value = '';
      confirmDeleteBtn.disabled = true;
      if (deleteConfirmHidden) deleteConfirmHidden.value = '';
      deleteInput.focus();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(deleteModal));
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => closeModal(deleteModal));
    }

    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) closeModal(deleteModal);
    });

    deleteInput.addEventListener('input', () => {
      const isMatch = deleteInput.value.trim() === userEmail;
      confirmDeleteBtn.disabled = !isMatch;
      if (isMatch && deleteConfirmHidden) {
        deleteConfirmHidden.value = deleteInput.value.trim();
      } else if (deleteConfirmHidden) {
        deleteConfirmHidden.value = '';
      }
    });

    deleteForm.addEventListener('submit', (e) => {
      if (!userEmail) {
        e.preventDefault();
        alert('Error: Email not found. Please refresh the page and try again.');
        return;
      }
      if (deleteInput.value.trim() !== userEmail) {
        e.preventDefault();
        alert('Email does not match. Please verify and try again.');
        return;
      }
    });
  }

  /* ─── Invoice Modal ─── */
  const invoiceModal = document.getElementById('invoice-modal');
  const invoiceContent = document.getElementById('invoice-content');

  function buildInvoiceHTML(data) {
    const amount = data ? Number(data.amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 }) : '0.00';
    return `
      <div style="padding:32px;background:#fff;">
        <div style="text-align:center;border-bottom:2px solid #D4006A;padding-bottom:24px;margin-bottom:24px;">
          <h2 style="font-family:var(--font-heading);color:#D4006A;margin-bottom:4px;">INVOICE</h2>
          <p class="text-mono text-dim">${data ? data.reference : ''}</p>
        </div>
        <div style="margin-bottom:24px;">
          <p style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--clr-text-dim);margin-bottom:4px;">From</p>
          <p><strong>National Secure Storage</strong></p>
          <p>35 St Croix Street, Jeffrey's Bay, 6330</p>
          <p>info@nss-jbay.co.za</p>
        </div>
        <div style="margin-bottom:24px;">
          <p style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--clr-text-dim);margin-bottom:4px;">Invoice Number</p>
          <p class="text-mono">${data ? data.reference : ''}</p>
          <p style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--clr-text-dim);margin-top:8px;margin-bottom:4px;">Date</p>
          <p>${data ? new Date(data.created_at).toLocaleDateString('en-ZA') : new Date().toLocaleDateString('en-ZA')}</p>
        </div>
        <div style="border:1px solid var(--clr-border);border-radius:var(--radius-sm);overflow:hidden;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <thead><tr style="background:var(--clr-bg-alt);"><th style="padding:12px;text-align:left;font-size:0.75rem;">Description</th><th style="padding:12px;text-align:right;font-size:0.75rem;">Amount</th></tr></thead>
            <tbody>
              <tr><td style="padding:12px;">Storage Unit Rental</td><td style="padding:12px;text-align:right;">R ${amount}</td></tr>
            </tbody>
            <tfoot><tr><td style="padding:12px;font-weight:600;">Total</td><td style="padding:12px;text-align:right;font-weight:600;color:var(--clr-primary);">R ${amount}</td></tr></tfoot>
          </table>
        </div>
        <p style="font-size:0.75rem;color:var(--clr-text-dim);text-align:center;">Thank you for choosing National Secure Storage</p>
      </div>
    `;
  }

  document.querySelectorAll('.js-download-invoice').forEach(btn => {
    btn.addEventListener('click', async () => {
      const paymentId = btn.dataset.paymentId;
      const reference = btn.dataset.reference;

      if (invoiceContent) {
        invoiceContent.innerHTML = `<div style="padding:32px;text-align:center;"><p class="text-dim">Loading invoice...</p></div>`;
      }
      if (invoiceModal) {
        openModal(invoiceModal);
      }

      try {
        const response = await fetch(`/api/payments/${paymentId}/invoice`);
        const data = await response.json();
        if (invoiceContent && data.success) {
          invoiceContent.innerHTML = buildInvoiceHTML(data.payment);
        } else if (invoiceContent) {
          invoiceContent.innerHTML = buildInvoiceHTML({ reference, amount: 0, created_at: new Date().toISOString() });
        }
      } catch (err) {
        console.error('Failed to load invoice:', err);
        if (invoiceContent) {
          invoiceContent.innerHTML = buildInvoiceHTML({ reference, amount: 0, created_at: new Date().toISOString() });
        }
      }
    });
  });

  if (invoiceModal) {
    const invoiceCloseBtn = invoiceModal.querySelector('.modal__close');
    const invoiceCancelBtn = invoiceModal.querySelector('.modal-cancel');

    if (invoiceCloseBtn) {
      invoiceCloseBtn.addEventListener('click', () => closeModal(invoiceModal));
    }
    if (invoiceCancelBtn) {
      invoiceCancelBtn.addEventListener('click', () => closeModal(invoiceModal));
    }
  }

  document.getElementById('print-invoice-btn')?.addEventListener('click', () => {
    const invoiceContent = document.getElementById('invoice-content');
    if (!invoiceContent) { window.print(); return; }
    const printContents = invoiceContent.innerHTML;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html><head><title>Invoice</title>
        <style>
          body { font-family: 'DM Sans', sans-serif; padding: 40px; color: #1a1a1a; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f5f5f5; }
          .text-right { text-align: right; }
          @media print { body { padding: 0; } }
        </style></head><body>${printContents}</body></html>
      `);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); win.close(); }, 300);
    } else {
      window.print();
    }
  });

  /* ─── Scroll Animations ─── */
  if ('IntersectionObserver' in window) {
    const animEls = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    animEls.forEach(el => observer.observe(el));
  }

  /* ─── Modal Close on Overlay Click ─── */
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });
});
