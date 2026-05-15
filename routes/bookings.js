const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/new', bookingController.showBookingForm.bind(bookingController));
router.post('/', isAuthenticated, bookingController.createBooking.bind(bookingController));
router.get('/:id', isAuthenticated, bookingController.getBooking.bind(bookingController));
router.post('/:id/cancel', isAuthenticated, bookingController.cancelBooking.bind(bookingController));

router.get('/admin/list', isAuthenticated, isAdmin, bookingController.adminListBookings.bind(bookingController));
router.put('/admin/:id', isAuthenticated, isAdmin, bookingController.adminUpdateBooking.bind(bookingController));

module.exports = router;
