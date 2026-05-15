const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/', pageController.home.bind(pageController));
router.get('/about', pageController.about.bind(pageController));
router.get('/contact', pageController.contact.bind(pageController));
router.post('/contact', pageController.submitContact.bind(pageController));
router.get('/faq', pageController.faq.bind(pageController));
router.get('/terms', (req, res) => res.render('pages/terms', { title: 'Terms of Use' }));
router.get('/privacy', (req, res) => res.render('pages/privacy', { title: 'Privacy Policy' }));
router.get('/refund-policy', (req, res) => res.render('pages/refund-policy', { title: 'Refund & Cancellation Policy' }));

module.exports = router;
