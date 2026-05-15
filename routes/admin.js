const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { unitController, upload } = require('../controllers/unitController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.use(isAuthenticated, isAdmin);

router.get('/', adminController.dashboard.bind(adminController));
router.get('/dashboard', adminController.dashboard.bind(adminController));

router.get('/units', adminController.manageUnits.bind(adminController));
router.get('/units/new', adminController.showNewUnitForm.bind(adminController));
router.get('/units/:id/edit', adminController.editUnitForm.bind(adminController));
router.post('/units', upload.single('image'), unitController.createUnit.bind(unitController));
router.post('/units/:id', upload.single('image'), unitController.updateUnit.bind(unitController));
router.delete('/units/:id', unitController.deleteUnit.bind(unitController));

router.get('/pricing', adminController.managePricing.bind(adminController));
router.post('/pricing/bulk', adminController.updateBulkPricing.bind(adminController));

router.get('/customers', adminController.manageCustomers.bind(adminController));
router.get('/users', adminController.manageCustomers.bind(adminController));

router.get('/bookings', adminController.manageBookings.bind(adminController));
router.get('/payments', adminController.managePayments.bind(adminController));

router.get('/settings', adminController.manageSettings.bind(adminController));
router.post('/settings', adminController.updateSettings.bind(adminController));

router.get('/api/stats', adminController.getStats.bind(adminController));

module.exports = router;
