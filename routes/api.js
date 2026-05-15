const express = require('express');
const router = express.Router();
const { unitController } = require('../controllers/unitController');
const paymentController = require('../controllers/paymentController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/units/:id', unitController.getUnitJson.bind(unitController));
router.get('/payments/:id/invoice', isAuthenticated, paymentController.getPaymentInvoice.bind(paymentController));

module.exports = router;
