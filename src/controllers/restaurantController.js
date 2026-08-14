import RestaurantService from '../services/restaurantService.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

/**
 * GET /api/restaurants
 * Get all restaurants with optional filters
 */
export async function getAllRestaurants(req, res, next) {
  try {
    const { skip = 0, limit = 20, search, cuisine, area } = req.query;

    let data;
    let total;

    if (search && search.trim()) {
      // Search by name
      data = await RestaurantService.searchByName(search, skip, limit);
      total = data.length; // Approximate
    } else if (cuisine && cuisine.trim() && area && area.trim()) {
      // Filter by both cuisine AND area
      data = await RestaurantService.filterByCuisineAndArea(cuisine, area, skip, limit);
      total = await RestaurantService.countByCuisineAndArea(cuisine, area);
    } else if (cuisine && cuisine.trim()) {
      // Filter by cuisine only
      data = await RestaurantService.filterByCuisine(cuisine, skip, limit);
      total = await RestaurantService.countByCuisine(cuisine);
    } else if (area && area.trim()) {
      // Filter by area only
      data = await RestaurantService.filterByArea(area, skip, limit);
      total = await RestaurantService.countByArea(area);
    } else {
      // Get all
      data = await RestaurantService.getAllRestaurants(skip, limit);
      total = await RestaurantService.countRestaurants();
    }

    sendPaginated(res, data, parseInt(skip), parseInt(limit), total, 200);
  } catch (error) {
    console.error('Get all restaurants error:', error);
    next(error);
  }
}

/**
 * GET /api/restaurants/:id
 * Get restaurant by ID with full details
 */
export async function getRestaurantById(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, 'Restaurant ID is required', 400);
    }

    const restaurant = await RestaurantService.getRestaurantById(id);

    if (!restaurant) {
      return sendError(res, 'Restaurant not found', 404, 'RESTAURANT_NOT_FOUND');
    }

    sendSuccess(res, restaurant, 'Restaurant retrieved', 200);
  } catch (error) {
    console.error('Get restaurant error:', error);
    next(error);
  }
}

/**
 * GET /api/restaurants/search/advanced
 * Advanced restaurant search with multiple filters
 */
export async function advancedSearch(req, res, next) {
  try {
    const { search = '', cuisines = [], areas = [], skip = 0, limit = 20 } = req.query;

    const cuisineList = Array.isArray(cuisines) ? cuisines : (cuisines ? [cuisines] : []);
    const areaList = Array.isArray(areas) ? areas : (areas ? [areas] : []);

    const data = await RestaurantService.advancedSearch(search, cuisineList, areaList, skip, limit);

    sendPaginated(res, data, parseInt(skip), parseInt(limit), data.length, 200);
  } catch (error) {
    console.error('Advanced search error:', error);
    next(error);
  }
}

/**
 * GET /api/restaurants/serving/:dishId
 * Get restaurants serving a specific dish
 */
export async function getRestaurantsServingDish(req, res, next) {
  try {
    const { dishId } = req.params;

    if (!dishId) {
      return sendError(res, 'Dish ID is required', 400);
    }

    const restaurants = await RestaurantService.getRestaurantsServingDish(dishId);

    sendSuccess(res, restaurants, 'Restaurants retrieved', 200);
  } catch (error) {
    console.error('Get restaurants serving dish error:', error);
    next(error);
  }
}

export default {
  getAllRestaurants,
  getRestaurantById,
  advancedSearch,
  getRestaurantsServingDish
};
