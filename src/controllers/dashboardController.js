import DashboardService from '../services/dashboardService.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /api/dashboard
 * Get dashboard statistics and summaries
 */
export async function getDashboard(req, res, next) {
  try {
    const data = await DashboardService.getCompleteDashboard();
    sendSuccess(res, data, 'Dashboard data retrieved', 200);
  } catch (error) {
    console.error('Dashboard error:', error);
    next(error);
  }
}

/**
 * GET /api/dashboard/stats
 * Get only statistics
 */
export async function getStats(req, res, next) {
  try {
    const stats = await DashboardService.getDashboardStats();
    sendSuccess(res, stats, 'Statistics retrieved', 200);
  } catch (error) {
    console.error('Stats error:', error);
    next(error);
  }
}

/**
 * GET /api/dashboard/popular-cuisines
 * Get popular cuisines
 */
export async function getPopularCuisines(req, res, next) {
  try {
    const cuisines = await DashboardService.getPopularCuisines();
    sendSuccess(res, cuisines, 'Popular cuisines retrieved', 200);
  } catch (error) {
    console.error('Popular cuisines error:', error);
    next(error);
  }
}

/**
 * GET /api/dashboard/popular-dishes
 * Get popular dishes
 */
export async function getPopularDishes(req, res, next) {
  try {
    const dishes = await DashboardService.getPopularDishes();
    sendSuccess(res, dishes, 'Popular dishes retrieved', 200);
  } catch (error) {
    console.error('Popular dishes error:', error);
    next(error);
  }
}

/**
 * GET /api/dashboard/top-restaurants
 * Get top rated restaurants
 */
export async function getTopRestaurants(req, res, next) {
  try {
    const restaurants = await DashboardService.getTopRestaurants();
    sendSuccess(res, restaurants, 'Top restaurants retrieved', 200);
  } catch (error) {
    console.error('Top restaurants error:', error);
    next(error);
  }
}

/**
 * GET /api/dashboard/recent-orders
 * Get recent orders
 */
export async function getRecentOrders(req, res, next) {
  try {
    const orders = await DashboardService.getRecentOrders();
    sendSuccess(res, orders, 'Recent orders retrieved', 200);
  } catch (error) {
    console.error('Recent orders error:', error);
    next(error);
  }
}

export default {
  getDashboard,
  getStats,
  getPopularCuisines,
  getPopularDishes,
  getTopRestaurants,
  getRecentOrders
};
