const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');
const paymentController = require('../controllers/paymentController');

router.get('/', isAuthenticated, bookingController.accountOverview.bind(bookingController));
router.get('/profile', isAuthenticated, (req, res) => {
  res.render('pages/account/profile', { 
    title: 'My Profile',
    user: req.session.user || {}
  });
});
router.post('/profile', isAuthenticated, bookingController.updateProfile.bind(bookingController));
router.post('/delete-account', isAuthenticated, bookingController.deleteAccount.bind(bookingController));
router.get('/bookings', isAuthenticated, bookingController.getUserBookings.bind(bookingController));
router.get('/payments', isAuthenticated, paymentController.getPaymentHistory.bind(paymentController));

module.exports = router;
