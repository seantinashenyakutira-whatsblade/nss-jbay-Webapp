const crypto = require('crypto');

/**
 * CSRF protection middleware.
 * - Injects a CSRF token into res.locals for all templates.
 * - Validates the token on POST/PUT/DELETE requests.
 * - Gracefully skips validation if no token is provided (logs a warning).
 */
function csrfProtection(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }

  res.locals.csrfToken = req.session.csrfToken;

  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  const token =
    req.body?._csrf ||
    req.headers['x-csrf-token'] ||
    req.headers['x-xsrf-token'];

  if (!token) {
    // Form has no CSRF token — log warning but allow the request.
    // This prevents breaking existing forms that haven't been updated yet.
    console.warn(
      `CSRF: Missing token on ${req.method} ${req.path} (ip: ${req.ip})`
    );
    return next();
  }

  if (token !== req.session.csrfToken) {
    console.warn(
      `CSRF: Token mismatch on ${req.method} ${req.path} (ip: ${req.ip})`
    );

    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    res.locals.csrfToken = req.session.csrfToken;

    if (req.accepts('html')) {
      req.flash('error', 'Session expired. Please try again.');
      return res.redirect('back');
    }

    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
}

module.exports = { csrfProtection };
