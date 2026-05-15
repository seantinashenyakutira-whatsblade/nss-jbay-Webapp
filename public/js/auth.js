class AuthHandler {
  constructor(formEl) {
    this.form = formEl;
    this.submitBtn = formEl.querySelector('[type="submit"]');
    this.submitted = false;

    this.form.addEventListener('submit', this);

    this.form.querySelectorAll('input, select, textarea').forEach((el) => {
      el.addEventListener('input', () => this.clearFeedback());
    });
  }

  handleEvent(e) {
    if (this.submitted) {
      e.preventDefault();
      return;
    }

    try {
      const error = this.validate(new FormData(this.form));
      if (error) {
        e.preventDefault();
        this.showFeedback(error);
        return;
      }

      e.preventDefault();
      this.submitted = true;
      this.setLoading(true);

      this.form.submit();
    } catch (err) {
      console.error('AuthHandler error:', err);
      this.submitted = false;
      this.setLoading(false);
      this.showFeedback('An unexpected error occurred. Please try again.');
    }
  }

  validate(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    if (!email || !password) return 'Please fill in all required fields.';
    if (!email.includes('@')) return 'Please enter a valid email address.';
    return null;
  }

  setLoading(loading) {
    if (!this.submitBtn) return;
    this.submitBtn.disabled = loading;

    if (loading) {
      this.submitBtn.dataset.originalText = this.submitBtn.textContent;
      this.submitBtn.textContent = 'Please wait\u2026';
    } else {
      this.submitBtn.textContent =
        this.submitBtn.dataset.originalText || 'Submit';
    }

    this.form.querySelectorAll('input, select, textarea').forEach((el) => {
      el.readOnly = loading;
    });
  }

  clearFeedback() {
    const existing = this.form.querySelector('.form-feedback');
    if (existing) existing.remove();
  }

  showFeedback(message) {
    this.clearFeedback();
    const feedback = document.createElement('div');
    feedback.className = 'form-feedback form-feedback--error';
    feedback.setAttribute('role', 'alert');
    feedback.textContent = message;
    this.form.prepend(feedback);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#tab-login form');
  const registerForm = document.querySelector('#tab-register form');
  if (loginForm) new AuthHandler(loginForm);
  if (registerForm) new AuthHandler(registerForm);
});
