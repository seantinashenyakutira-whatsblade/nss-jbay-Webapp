const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passwordController = require('../controllers/passwordController');

// Login
router.get('/login', authController.showLogin.bind(authController));
router.post('/login', authController.login.bind(authController));

// Register
router.get('/register', (req, res) => {
  res.render('auth/login', { title: 'Create Account', registerActive: true });
});
router.post('/register', authController.register.bind(authController));

// Password reset
router.get('/forgot-password', passwordController.showForgotPassword.bind(passwordController));
router.post('/forgot-password', passwordController.sendResetEmail.bind(passwordController));

// Password reset callback (landing page after email link click)
router.get('/reset-password/callback', passwordController.handleResetCallback.bind(passwordController));

// Update password (from reset form)
router.post('/reset-password', passwordController.updatePassword.bind(passwordController));

// Logout
router.get('/logout', authController.logout.bind(authController));

module.exports = router;
