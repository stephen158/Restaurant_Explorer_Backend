import { executeQueryAndReturnRecords, executeQueryAndReturnSingle } from '../config/database.js';
import { recommendationQueries } from '../queries/recommendationQueries.js';
import CustomerService from './customerService.js';

export class RecommendationService {
  /**
   * Validate customer ID
   */
  static validateCustomerId(id) {
    return id && id.trim().length > 0;
  }

  /**
   * Get recommendations for a customer
   * Multi-hop query:
   * Customer → Order → Dish ← Order ← Similar Customer → Order → Dish → Restaurant
   * Falls back to top-rated restaurants if no personalized recommendations available
   */
  static async getRecommendations(customerId, limit = 10) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      // Verify customer exists
      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 10));

      let recommendations = await executeQueryAndReturnRecords(
        recommendationQueries.getRecommendations,
        { customerId, limit: limit_value }
      );

      // If no personalized recommendations, use fallback (top-rated restaurants)
      if (!recommendations || recommendations.length === 0) {
        recommendations = await executeQueryAndReturnRecords(
          recommendationQueries.getFallbackRecommendations,
          { limit: limit_value }
        );
      }

      if (!recommendations || recommendations.length === 0) {
        return [];
      }

      // Format recommendations with reasoning
      return recommendations.map((rec) => ({
        id: rec.id,
        name: rec.name,
        rating: rec.rating,
        description: rec.description,
        similarCustomers: rec.similarCustomers || 0,
        matchingDishes: rec.matchingDishes || 0,
        recommendationScore: rec.recommendationScore || rec.rating,
        reason: this.generateRecommendationReason(rec.similarCustomers || 0, rec.matchingDishes || 0)
      }));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  /**
   * Get detailed recommendations with cuisines and dishes
   */
  static async getRecommendationsDetailed(customerId, limit = 10) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      // Verify customer exists
      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 10));

      let recommendations = await executeQueryAndReturnRecords(
        recommendationQueries.getRecommendationsDetailed,
        { customerId, limit: limit_value }
      );

      // If no personalized recommendations, use fallback (top-rated restaurants)
      if (!recommendations || recommendations.length === 0) {
        recommendations = await executeQueryAndReturnRecords(
          recommendationQueries.getFallbackRecommendations,
          { limit: limit_value }
        );
      }

      if (!recommendations || recommendations.length === 0) {
        return [];
      }

      return recommendations.map((rec) => ({
        id: rec.id,
        name: rec.name,
        rating: rec.rating,
        description: rec.description,
        address: rec.address,
        cuisines: rec.cuisines || [],
        areas: rec.areas || [],
        similarCustomers: rec.similarCustomers || 0,
        matchingDishes: rec.matchingDishes || 0,
        recommendedDishes: rec.recommendedDishes || [],
        recommendationScore: rec.recommendationScore || rec.rating,
        reason: this.generateRecommendationReason(rec.similarCustomers || 0, rec.matchingDishes || 0)
      }));
    } catch (error) {
      console.error('Error fetching detailed recommendations:', error);
      throw error;
    }
  }

  /**
   * Get recommendations based on cuisine preferences
   */
  static async getRecommendationsByCuisine(customerId, limit = 10) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 10));

      return await executeQueryAndReturnRecords(
        recommendationQueries.getRecommendationsByCuisinePreference,
        { customerId, limit: limit_value }
      );
    } catch (error) {
      console.error('Error fetching cuisine-based recommendations:', error);
      throw error;
    }
  }

  /**
   * Get recommendations based on area
   */
  static async getRecommendationsByArea(customerId, limit = 10) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 10));

      return await executeQueryAndReturnRecords(
        recommendationQueries.getRecommendationsByArea,
        { customerId, limit: limit_value }
      );
    } catch (error) {
      console.error('Error fetching area-based recommendations:', error);
      throw error;
    }
  }

  /**
   * Get top recommendations with reasoning
   */
  static async getTopRecommendationsWithReason(customerId, limit = 10) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 10));

      return await executeQueryAndReturnRecords(
        recommendationQueries.getTopRecommendationsWithReason,
        { customerId, limit: limit_value }
      );
    } catch (error) {
      console.error('Error fetching recommendations with reasons:', error);
      throw error;
    }
  }

  /**
   * Get similar customers
   */
  static async getSimilarCustomers(customerId, limit = 10) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 10));

      return await executeQueryAndReturnRecords(
        recommendationQueries.getSimilarCustomers,
        { customerId, limit: limit_value }
      );
    } catch (error) {
      console.error('Error fetching similar customers:', error);
      throw error;
    }
  }

  /**
   * Count recommendations
   */
  static async countRecommendations(customerId) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      const result = await executeQueryAndReturnSingle(
        recommendationQueries.countRecommendations,
        { customerId }
      );
      return result?.total || 0;
    } catch (error) {
      console.error('Error counting recommendations:', error);
      throw error;
    }
  }

  /**
   * Generate human-readable recommendation reason
   */
  static generateRecommendationReason(similarCustomers, matchingDishes) {
    if (similarCustomers > 0) {
      if (similarCustomers >= 30) {
        return `Highly recommended - ${similarCustomers} similar customers ordered here`;
      } else if (similarCustomers >= 15) {
        return `Recommended - ${similarCustomers} similar customers enjoyed this`;
      } else if (similarCustomers >= 5) {
        return `You might like this - ${similarCustomers} customers with similar tastes ordered here`;
      } else {
        return `Based on ${matchingDishes} dishes that match your previous orders`;
      }
    } else {
      // Fallback recommendation (top-rated restaurants)
      return 'Popular restaurant - highly rated by customers';
    }
  }
}

export default RecommendationService;
