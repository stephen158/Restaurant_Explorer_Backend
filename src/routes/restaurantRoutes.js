import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  advancedSearch,
  getRestaurantsServingDish
} from '../controllers/restaurantController.js';

const router = express.Router();

/**
 * GET /api/restaurants
 * Get all restaurants with optional filters (search, cuisine, area)
 */
router.get('/', getAllRestaurants);

/**
 * GET /api/restaurants/search/advanced
 * Advanced search with multiple filters
 */
router.get('/search/advanced', advancedSearch);

/**
 * GET /api/restaurants/serving/:dishId
 * Get restaurants serving a specific dish
 */
router.get('/serving/:dishId', getRestaurantsServingDish);

/**
 * GET /api/restaurants/:id
 * Get restaurant by ID with full details
 */
router.get('/:id', getRestaurantById);

export default router;
