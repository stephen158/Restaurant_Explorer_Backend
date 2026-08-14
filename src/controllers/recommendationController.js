import RecommendationService from '../services/recommendationService.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /api/customers/:id/recommendations
 * Get restaurant recommendations for a customer
 * Uses multi-hop graph traversal
 */
export async function getRecommendations(req, res, next) {
  try {
    const { id } = req.params;
    const { limit = 10, detailed = false } = req.query;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    let recommendations;

    if (detailed === 'true' || detailed === '1') {
      recommendations = await RecommendationService.getRecommendationsDetailed(id, limit);
    } else {
      recommendations = await RecommendationService.getRecommendations(id, limit);
    }

    const data = {
      customerId: id,
      recommendationCount: recommendations.length,
      recommendations
    };

    sendSuccess(res, data, 'Recommendations retrieved', 200);
  } catch (error) {
    console.error('Get recommendations error:', error);
    next(error);
  }
}

/**
 * GET /api/customers/:id/recommendations/detailed
 * Get detailed recommendations with dishes and cuisines
 */
export async function getDetailedRecommendations(req, res, next) {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const recommendations = await RecommendationService.getRecommendationsDetailed(id, limit);

    const data = {
      customerId: id,
      recommendationCount: recommendations.length,
      recommendations
    };

    sendSuccess(res, data, 'Detailed recommendations retrieved', 200);
  } catch (error) {
    console.error('Get detailed recommendations error:', error);
    next(error);
  }
}

/**
 * GET /api/customers/:id/recommendations/cuisine-based
 * Get recommendations based on cuisine preferences
 */
export async function getCuisineBasedRecommendations(req, res, next) {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const recommendations = await RecommendationService.getRecommendationsByCuisine(id, limit);

    const data = {
      customerId: id,
      type: 'cuisine-based',
      recommendationCount: recommendations.length,
      recommendations
    };

    sendSuccess(res, data, 'Cuisine-based recommendations retrieved', 200);
  } catch (error) {
    console.error('Get cuisine-based recommendations error:', error);
    next(error);
  }
}

/**
 * GET /api/customers/:id/recommendations/area-based
 * Get recommendations based on area
 */
export async function getAreaBasedRecommendations(req, res, next) {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const recommendations = await RecommendationService.getRecommendationsByArea(id, limit);

    const data = {
      customerId: id,
      type: 'area-based',
      recommendationCount: recommendations.length,
      recommendations
    };

    sendSuccess(res, data, 'Area-based recommendations retrieved', 200);
  } catch (error) {
    console.error('Get area-based recommendations error:', error);
    next(error);
  }
}

/**
 * GET /api/customers/:id/recommendations/with-reasons
 * Get top recommendations with detailed reasons
 */
export async function getRecommendationsWithReasons(req, res, next) {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const recommendations = await RecommendationService.getTopRecommendationsWithReason(id, limit);

    const data = {
      customerId: id,
      recommendationCount: recommendations.length,
      recommendations
    };

    sendSuccess(res, data, 'Recommendations with reasons retrieved', 200);
  } catch (error) {
    console.error('Get recommendations with reasons error:', error);
    next(error);
  }
}

/**
 * GET /api/customers/:id/similar-customers
 * Get similar customers based on order history
 */
export async function getSimilarCustomers(req, res, next) {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const similarCustomers = await RecommendationService.getSimilarCustomers(id, limit);

    const data = {
      customerId: id,
      similarCustomersCount: similarCustomers.length,
      similarCustomers
    };

    sendSuccess(res, data, 'Similar customers retrieved', 200);
  } catch (error) {
    console.error('Get similar customers error:', error);
    next(error);
  }
}

export default {
  getRecommendations,
  getDetailedRecommendations,
  getCuisineBasedRecommendations,
  getAreaBasedRecommendations,
  getRecommendationsWithReasons,
  getSimilarCustomers
};
