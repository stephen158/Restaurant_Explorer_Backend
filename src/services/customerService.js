import { executeQueryAndReturnRecords, executeQueryAndReturnSingle } from '../config/database.js';
import { customerQueries } from '../queries/customerQueries.js';

export class CustomerService {
  /**
   * Validate customer ID format
   */
  static validateCustomerId(id) {
    return id && id.trim().length > 0;
  }

  /**
   * Get all customers with pagination
   */
  static async getAllCustomers(skip = 0, limit = 20) {
    try {
      const skip_value = Math.max(0, parseInt(skip) || 0);
      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 20));

      return await executeQueryAndReturnRecords(
        customerQueries.getAllCustomers,
        { skip: skip_value, limit: limit_value }
      );
    } catch (error) {
      console.error('Error fetching all customers:', error);
      throw error;
    }
  }

  /**
   * Get customer by ID with full details
   */
  static async getCustomerById(customerId) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      const result = await executeQueryAndReturnSingle(
        customerQueries.getCustomerById,
        { customerId }
      );

      if (!result) {
        return null;
      }

      return result;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  /**
   * Get customer purchases with pagination
   */
  static async getCustomerPurchases(customerId, skip = 0, limit = 20) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      const skip_value = Math.max(0, parseInt(skip) || 0);
      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 20));

      return await executeQueryAndReturnRecords(
        customerQueries.getCustomerPurchases,
        { customerId, skip: skip_value, limit: limit_value }
      );
    } catch (error) {
      console.error('Error fetching customer purchases:', error);
      throw error;
    }
  }

  /**
   * Get customer orders
   */
  static async getCustomerOrders(customerId, skip = 0, limit = 20) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      const skip_value = Math.max(0, parseInt(skip) || 0);
      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 20));

      return await executeQueryAndReturnRecords(
        customerQueries.getCustomerOrders,
        { customerId, skip: skip_value, limit: limit_value }
      );
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  }

  /**
   * Search customers by name
   */
  static async searchByName(searchTerm, skip = 0, limit = 20) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    try {
      const skip_value = Math.max(0, parseInt(skip) || 0);
      const limit_value = Math.min(100, Math.max(1, parseInt(limit) || 20));

      return await executeQueryAndReturnRecords(
        customerQueries.searchCustomersByName,
        { searchTerm: searchTerm.trim(), skip: skip_value, limit: limit_value }
      );
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }

  /**
   * Get customer cuisine preferences
   */
  static async getCuisinePreferences(customerId) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      return await executeQueryAndReturnRecords(
        customerQueries.getCustomerCuisinePreferences,
        { customerId }
      );
    } catch (error) {
      console.error('Error fetching cuisine preferences:', error);
      throw error;
    }
  }

  /**
   * Get customer's area
   */
  static async getCustomerArea(customerId) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      return await executeQueryAndReturnSingle(
        customerQueries.getCustomerArea,
        { customerId }
      );
    } catch (error) {
      console.error('Error fetching customer area:', error);
      throw error;
    }
  }

  /**
   * Get all dishes purchased by customer
   */
  static async getPurchasedDishes(customerId) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      return await executeQueryAndReturnRecords(
        customerQueries.getCustomerPurchasedDishes,
        { customerId }
      );
    } catch (error) {
      console.error('Error fetching purchased dishes:', error);
      throw error;
    }
  }

  /**
   * Count total customers
   */
  static async countCustomers() {
    try {
      const result = await executeQueryAndReturnSingle(customerQueries.countCustomers);
      return result?.total || 0;
    } catch (error) {
      console.error('Error counting customers:', error);
      throw error;
    }
  }

  /**
   * Count customer orders
   */
  static async countCustomerOrders(customerId) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      const result = await executeQueryAndReturnSingle(
        customerQueries.countCustomerOrders,
        { customerId }
      );
      return result?.total || 0;
    } catch (error) {
      console.error('Error counting customer orders:', error);
      throw error;
    }
  }

  /**
   * Get customer spending statistics
   */
  static async getSpendingStats(customerId) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      return await executeQueryAndReturnSingle(
        customerQueries.getCustomerSpendingStats,
        { customerId }
      );
    } catch (error) {
      console.error('Error fetching spending stats:', error);
      throw error;
    }
  }
}

export default CustomerService;
