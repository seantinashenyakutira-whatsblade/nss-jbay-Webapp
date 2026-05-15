require('dotenv').config();

const isDev = (process.env.NODE_ENV || '').trim().toLowerCase() === 'development';
console.log(`[Server] Mode: ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'}`);

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const { setUser } = require('./middleware/auth');
const { csrfProtection } = require('./middleware/csrf');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !isDev,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

app.use(flash());

// CSRF protection for all state-changing requests
app.use(csrfProtection);

// Global locals and session refresh
app.use((req, res, next) => {
  const user = req.session.user || null;

  res.locals.currentUser = user;
  res.locals.user = user;
  res.locals.currentPath = req.path;

  const success = req.flash('success');
  const error = req.flash('error');
  const info = req.flash('info');
  res.locals.success_msg = success;
  res.locals.error_msg = error;
  res.locals.info_msg = info;

  const messages = [];
  success.forEach(m => messages.push({ type: 'success', text: m }));
  error.forEach(m => messages.push({ type: 'error', text: m }));
  info.forEach(m => messages.push({ type: 'info', text: m }));
  res.locals.messages = messages;

  res.locals.description = '';
  res.locals.extraStyles = '';
  res.locals.extraScripts = '';
  res.locals.isDev = isDev;
  res.locals.currency = process.env.CURRENCY || 'R';
  res.locals.siteName = process.env.SITE_NAME || 'National Secure Storage';
  res.locals.siteLocation = process.env.SITE_LOCATION || 'Jeffrey\'s Bay';
  res.locals.siteAddress = process.env.SITE_ADDRESS || '';
  res.locals.sitePhone1 = process.env.SITE_PHONE_1 || '';
  res.locals.sitePhone2 = process.env.SITE_PHONE_2 || '';
  res.locals.siteEmail = process.env.SITE_EMAIL || '';
  res.locals.fbUrl = process.env.FB_URL || '';
  res.locals.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  next();
});

// Refresh session user data from profiles table on every request
app.use(setUser);

const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const unitRoutes = require('./routes/units');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const accountRoutes = require('./routes/account');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use('/units', unitRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/account', accountRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  console.error('=== UNHANDLED ERROR ===');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('========================\n');

  res.status(err.status || 500);

  if (isDev) {
    res.render('pages/500', {
      title: 'Server Error',
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    res.render('pages/500', {
      title: 'Server Error',
      message: 'Something went wrong. Please try again later.',
      stack: null,
      error: null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`NSS JBay running on http://localhost:${PORT}`);
  console.log(`Environment: ${isDev ? 'development' : 'production'}`);
});

module.exports = app;
