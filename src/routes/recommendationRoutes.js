import express from 'express';
import {
  getRecommendations,
  getDetailedRecommendations,
  getCuisineBasedRecommendations,
  getAreaBasedRecommendations,
  getRecommendationsWithReasons,
  getSimilarCustomers
} from '../controllers/recommendationController.js';

const router = express.Router();

/**
 * GET /api/customers/:id/recommendations
 * Get restaurant recommendations for a customer
 * Uses multi-hop graph traversal
 */
router.get('/:id/recommendations', getRecommendations);

/**
 * GET /api/customers/:id/recommendations/detailed
 * Get detailed recommendations with dishes and cuisines
 */
router.get('/:id/recommendations/detailed', getDetailedRecommendations);

/**
 * GET /api/customers/:id/recommendations/cuisine-based
 * Get recommendations based on cuisine preferences
 */
router.get('/:id/recommendations/cuisine-based', getCuisineBasedRecommendations);

/**
 * GET /api/customers/:id/recommendations/area-based
 * Get recommendations based on area
 */
router.get('/:id/recommendations/area-based', getAreaBasedRecommendations);

/**
 * GET /api/customers/:id/recommendations/with-reasons
 * Get top recommendations with detailed reasons
 */
router.get('/:id/recommendations/with-reasons', getRecommendationsWithReasons);

/**
 * GET /api/customers/:id/similar-customers
 * Get similar customers based on order history
 */
router.get('/:id/similar-customers', getSimilarCustomers);

export default router;
