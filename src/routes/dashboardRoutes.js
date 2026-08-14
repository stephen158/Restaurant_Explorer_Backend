import express from 'express';
import {
  getDashboard,
  getStats,
  getPopularCuisines,
  getPopularDishes,
  getTopRestaurants,
  getRecentOrders
} from '../controllers/dashboardController.js';

const router = express.Router();

/**
 * GET /api/dashboard
 * Get complete dashboard data
 */
router.get('/', getDashboard);

/**
 * GET /api/dashboard/stats
 * Get statistics only
 */
router.get('/stats', getStats);

/**
 * GET /api/dashboard/popular-cuisines
 * Get popular cuisines
 */
router.get('/popular-cuisines', getPopularCuisines);

/**
 * GET /api/dashboard/popular-dishes
 * Get popular dishes
 */
router.get('/popular-dishes', getPopularDishes);

/**
 * GET /api/dashboard/top-restaurants
 * Get top rated restaurants
 */
router.get('/top-restaurants', getTopRestaurants);

/**
 * GET /api/dashboard/recent-orders
 * Get recent orders
 */
router.get('/recent-orders', getRecentOrders);

export default router;
