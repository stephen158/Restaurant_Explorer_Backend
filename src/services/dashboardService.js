import { executeQueryAndReturnRecords, executeQueryAndReturnSingle } from '../config/database.js';
import { dashboardQueries } from '../queries/dashboardQueries.js';

export class DashboardService {
  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    try {
      const restaurantCount = await executeQueryAndReturnSingle(dashboardQueries.getRestaurantCount);
      const customerCount = await executeQueryAndReturnSingle(dashboardQueries.getCustomerCount);
      const dishCount = await executeQueryAndReturnSingle(dashboardQueries.getDishCount);
      const orderCount = await executeQueryAndReturnSingle(dashboardQueries.getOrderCount);
      const categoryCount = await executeQueryAndReturnSingle(dashboardQueries.getCategoryCount);
      const cuisineCount = await executeQueryAndReturnSingle(dashboardQueries.getCuisineCount);

      return {
        restaurantCount: restaurantCount?.count || 0,
        customerCount: customerCount?.count || 0,
        dishCount: dishCount?.count || 0,
        orderCount: orderCount?.count || 0,
        categoryCount: categoryCount?.count || 0,
        cuisineCount: cuisineCount?.count || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get popular cuisines
   */
  static async getPopularCuisines() {
    try {
      return await executeQueryAndReturnRecords(dashboardQueries.getPopularCuisines);
    } catch (error) {
      console.error('Error fetching popular cuisines:', error);
      throw error;
    }
  }

  /**
   * Get popular dishes
   */
  static async getPopularDishes() {
    try {
      return await executeQueryAndReturnRecords(dashboardQueries.getPopularDishes);
    } catch (error) {
      console.error('Error fetching popular dishes:', error);
      throw error;
    }
  }

  /**
   * Get top restaurants
   */
  static async getTopRestaurants() {
    try {
      return await executeQueryAndReturnRecords(dashboardQueries.getTopRestaurants);
    } catch (error) {
      console.error('Error fetching top restaurants:', error);
      throw error;
    }
  }

  /**
   * Get recent orders
   */
  static async getRecentOrders() {
    try {
      return await executeQueryAndReturnRecords(dashboardQueries.getRecentOrders);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  }

  /**
   * Get complete dashboard data
   */
  static async getCompleteDashboard() {
    try {
      const [stats, popularCuisines, popularDishes, topRestaurants, recentOrders] = await Promise.all([
        this.getDashboardStats(),
        this.getPopularCuisines(),
        this.getPopularDishes(),
        this.getTopRestaurants(),
        this.getRecentOrders()
      ]);

      return {
        stats,
        popularCuisines,
        popularDishes: popularDishes.slice(0, 10),
        topRestaurants: topRestaurants.slice(0, 10),
        recentOrders: recentOrders.slice(0, 10)
      };
    } catch (error) {
      console.error('Error fetching complete dashboard:', error);
      throw error;
    }
  }
}

export default DashboardService;
