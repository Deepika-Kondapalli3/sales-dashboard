const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Revenue & Orders
router.get('/revenue-orders', analyticsController.getRevenueAndOrders);

// Top Products
router.get('/top-products', analyticsController.getTopProducts);

// Top Customers
router.get('/top-customers', analyticsController.getTopCustomers);

module.exports = router;
