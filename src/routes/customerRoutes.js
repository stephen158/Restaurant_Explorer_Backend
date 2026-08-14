import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  getCustomerPurchases,
  getCustomerOrders,
  getCustomerPreferences,
  getCustomerStats
} from '../controllers/customerController.js';

const router = express.Router();

/**
 * GET /api/customers
 * Get all customers with optional search
 */
router.get('/', getAllCustomers);

/**
 * GET /api/customers/:id
 * Get customer by ID with full details
 */
router.get('/:id', getCustomerById);

/**
 * GET /api/customers/:id/purchases
 * Get customer's purchase history
 */
router.get('/:id/purchases', getCustomerPurchases);

/**
 * GET /api/customers/:id/orders
 * Get customer's orders
 */
router.get('/:id/orders', getCustomerOrders);

/**
 * GET /api/customers/:id/preferences
 * Get customer's cuisine preferences
 */
router.get('/:id/preferences', getCustomerPreferences);

/**
 * GET /api/customers/:id/stats
 * Get customer spending statistics
 */
router.get('/:id/stats', getCustomerStats);

export default router;
