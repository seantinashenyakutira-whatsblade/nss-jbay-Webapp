const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/pay/:bookingId', isAuthenticated, paymentController.showPaymentPage.bind(paymentController));
router.post('/process', isAuthenticated, paymentController.processPayment.bind(paymentController));
router.get('/history', isAuthenticated, paymentController.getPaymentHistory.bind(paymentController));
router.get('/admin/list', isAuthenticated, isAdmin, paymentController.adminListPayments.bind(paymentController));

module.exports = router;
