const express = require('express');
const router = express.Router();
const { unitController } = require('../controllers/unitController');

router.get('/', unitController.listUnits.bind(unitController));
router.get('/:id', unitController.getUnit.bind(unitController));

module.exports = router;
