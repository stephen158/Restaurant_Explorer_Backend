import { executeQueryAndReturnRecords, executeQueryAndReturnSingle } from '../config/database.js';
import { restaurantQueries } from '../queries/restaurantQueries.js';

export class RestaurantService {
  /**
   * Validate restaurant ID format
   */
  static validateRestaurantId(id) {
    return id && id.trim().length > 0;
  }

  /**
   * Get all restaurants with pagination
   */
  static async getAllRestaurants(skip = 0, limit = 20) {
    try {
      const skip_value = Math.max(0, parseInt(skip) || 0);
      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 20));

      return await executeQueryAndReturnRecords(
        restaurantQueries.getAllRestaurants,
        { skip: skip_value, limit: limit_value }
      );
    } catch (error) {
      console.error('Error fetching all restaurants:', error);
      throw error;
    }
  }

  /**
   * Get restaurant by ID
   */
  static async getRestaurantById(restaurantId) {
    if (!this.validateRestaurantId(restaurantId)) {
      throw new Error('Invalid restaurant ID');
    }

    try {
      const result = await executeQueryAndReturnSingle(
        restaurantQueries.getRestaurantById,
        { restaurantId }
      );

      if (!result) {
        return null;
      }

      return result;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw error;
    }
  }

  /**
   * Search restaurants by name
   */
  static async searchByName(searchTerm, skip = 0, limit = 20) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    try {
      const skip_value = Math.max(0, parseInt(skip) || 0);
      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 20));

      return await executeQueryAndReturnRecords(
        restaurantQueries.searchRestaurantsByName,
        { searchTerm: searchTerm.trim(), skip: skip_value, limit: limit_value }
      );
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw error;
    }
  }

  /**
   * Filter restaurants by cuisine
   */
  static async filterByCuisine(cuisineName, skip = 0, limit = 20) {
    if (!cuisineName || cuisineName.trim().length === 0) {
      return [];
    }

    try {
      const skip_value = Math.max(0, parseInt(skip) || 0);
      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 20));

      return await executeQueryAndReturnRecords(
        restaurantQueries.getRestaurantsByCuisine,
        { cuisineName: cuisineName.trim(), skip: skip_value, limit: limit_value }
      );
    } catch (error) {
      console.error('Error filtering by cuisine:', error);
      throw error;
    }
  }

  /**
   * Filter restaurants by area
   */
  static async filterByArea(areaName, skip = 0, limit = 20) {
    if (!areaName || areaName.trim().length === 0) {
      return [];
    }

    try {
      const skip_value = Math.max(0, parseInt(skip) || 0);
      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 20));

      return await executeQueryAndReturnRecords(
        restaurantQueries.getRestaurantsByArea,
        { areaName: areaName.trim(), skip: skip_value, limit: limit_value }
      );
    } catch (error) {
      console.error('Error filtering by area:', error);
      throw error;
    }
  }

  /**
   * Filter restaurants by cuisine and area
   */
  static async filterByCuisineAndArea(cuisineName, areaName, skip = 0, limit = 20) {
    if (!cuisineName || cuisineName.trim().length === 0 || !areaName || areaName.trim().length === 0) {
      return [];
    }

    try {
      const skip_value = Math.max(0, parseInt(skip) || 0);
      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 20));

      return await executeQueryAndReturnRecords(
        restaurantQueries.getRestaurantsByCuisineAndAreaV2,
        { 
          cuisineName: cuisineName.trim(), 
          areaName: areaName.trim(), 
          skip: skip_value, 
          limit: limit_value 
        }
      );
    } catch (error) {
      console.error('Error filtering by cuisine and area:', error);
      throw error;
    }
  }

  /**
   * Advanced search with multiple filters
   */
  static async advancedSearch(searchTerm = '', cuisines = [], areas = [], skip = 0, limit = 20) {
    try {
      const skip_value = Math.max(0, parseInt(skip) || 0);
      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 20));
      const cuisineList = Array.isArray(cuisines) && cuisines.length > 0 ? cuisines : null;
      const areaList = Array.isArray(areas) && areas.length > 0 ? areas : null;

      return await executeQueryAndReturnRecords(
        restaurantQueries.searchRestaurantsAdvanced,
        {
          searchTerm: searchTerm.trim() || '',
          cuisines: cuisineList,
          areas: areaList,
          skip: skip_value,
          limit: limit_value
        }
      );
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }

  /**
   * Get restaurants serving a specific dish
   */
  static async getRestaurantsServingDish(dishId) {
    if (!dishId || dishId.trim().length === 0) {
      throw new Error('Invalid dish ID');
    }

    try {
      return await executeQueryAndReturnRecords(
        restaurantQueries.getRestaurantsServingDish,
        { dishId }
      );
    } catch (error) {
      console.error('Error fetching restaurants by dish:', error);
      throw error;
    }
  }

  /**
   * Count restaurants
   */
  static async countRestaurants() {
    try {
      const result = await executeQueryAndReturnSingle(restaurantQueries.countRestaurants);
      return result?.total || 0;
    } catch (error) {
      console.error('Error counting restaurants:', error);
      throw error;
    }
  }

  /**
   * Count restaurants by cuisine
   */
  static async countByCuisine(cuisineName) {
    if (!cuisineName || cuisineName.trim().length === 0) {
      throw new Error('Invalid cuisine name');
    }

    try {
      const result = await executeQueryAndReturnSingle(
        restaurantQueries.countRestaurantsByCuisine,
        { cuisineName: cuisineName.trim() }
      );
      return result?.total || 0;
    } catch (error) {
      console.error('Error counting restaurants by cuisine:', error);
      throw error;
    }
  }

  /**
   * Count restaurants by area
   */
  static async countByArea(areaName) {
    if (!areaName || areaName.trim().length === 0) {
      throw new Error('Invalid area name');
    }

    try {
      const result = await executeQueryAndReturnSingle(
        restaurantQueries.countRestaurantsByArea,
        { areaName: areaName.trim() }
      );
      return result?.total || 0;
    } catch (error) {
      console.error('Error counting restaurants by area:', error);
      throw error;
    }
  }

  /**
   * Count restaurants by cuisine and area
   */
  static async countByCuisineAndArea(cuisineName, areaName) {
    if (!cuisineName || cuisineName.trim().length === 0 || !areaName || areaName.trim().length === 0) {
      throw new Error('Invalid cuisine or area name');
    }

    try {
      const result = await executeQueryAndReturnSingle(
        restaurantQueries.countRestaurantsByCuisineAndArea,
        { 
          cuisineName: cuisineName.trim(), 
          areaName: areaName.trim() 
        }
      );
      return result?.total || 0;
    } catch (error) {
      console.error('Error counting restaurants by cuisine and area:', error);
      throw error;
    }
  }
}

export default RestaurantService;
