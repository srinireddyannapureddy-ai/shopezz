const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');
const { getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/login', loginAdmin);
router.get('/dashboard', protect, admin, getDashboardStats);

module.exports = router;
