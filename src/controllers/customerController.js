import CustomerService from '../services/customerService.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

/**
 * GET /api/customers
 * Get all customers with optional search and order count
 */
export async function getAllCustomers(req, res, next) {
  try {
    const { skip = 0, limit = 20, search } = req.query;

    let data;
    let total;

    if (search) {
      data = await CustomerService.searchByName(search, skip, limit);
      total = data.length;
    } else {
      data = await CustomerService.getAllCustomers(skip, limit);
      total = await CustomerService.countCustomers();
    }

    // Add order count for each customer
    const customersWithOrderCount = await Promise.all(
      data.map(async (customer) => ({
        ...customer,
        orderCount: await CustomerService.countCustomerOrders(customer.id || customer.customerId)
      }))
    );

    sendPaginated(res, customersWithOrderCount, parseInt(skip), parseInt(limit), total, 200);
  } catch (error) {
    console.error('Get all customers error:', error);
    next(error);
  }
}

/**
 * GET /api/customers/:id
 * Get customer by ID with full details
 */
export async function getCustomerById(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const customer = await CustomerService.getCustomerById(id);

    if (!customer) {
      return sendError(res, 'Customer not found', 404, 'CUSTOMER_NOT_FOUND');
    }

    sendSuccess(res, customer, 'Customer retrieved', 200);
  } catch (error) {
    console.error('Get customer error:', error);
    next(error);
  }
}

/**
 * GET /api/customers/:id/purchases
 * Get customer's purchase history with profile data
 */
export async function getCustomerPurchases(req, res, next) {
  try {
    const { id } = req.params;
    const { skip = 0, limit = 20 } = req.query;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    // Verify customer exists
    const customer = await CustomerService.getCustomerById(id);
    if (!customer) {
      return sendError(res, 'Customer not found', 404, 'CUSTOMER_NOT_FOUND');
    }

    const purchases = await CustomerService.getCustomerPurchases(id, skip, limit);
    const total = await CustomerService.countCustomerOrders(id);

    // Include profile data with purchases
    const responseData = {
      profile: customer,
      purchases: purchases
    };

    res.status(200).json({
      success: true,
      data: responseData,
      pagination: {
        skip: parseInt(skip),
        limit: parseInt(limit),
        total,
        hasMore: parseInt(skip) + parseInt(limit) < total
      }
    });
  } catch (error) {
    console.error('Get customer purchases error:', error);
    next(error);
  }
}

/**
 * GET /api/customers/:id/orders
 * Get customer's orders with profile data
 */
export async function getCustomerOrders(req, res, next) {
  try {
    const { id } = req.params;
    const { skip = 0, limit = 20 } = req.query;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const customer = await CustomerService.getCustomerById(id);
    if (!customer) {
      return sendError(res, 'Customer not found', 404, 'CUSTOMER_NOT_FOUND');
    }

    const orders = await CustomerService.getCustomerOrders(id, skip, limit);
    const total = await CustomerService.countCustomerOrders(id);

    // Include profile data with orders
    const responseData = {
      profile: customer,
      orders: orders
    };

    res.status(200).json({
      success: true,
      data: responseData,
      pagination: {
        skip: parseInt(skip),
        limit: parseInt(limit),
        total,
        hasMore: parseInt(skip) + parseInt(limit) < total
      }
    });
  } catch (error) {
    console.error('Get customer orders error:', error);
    next(error);
  }
}

/**
 * GET /api/customers/:id/preferences
 * Get customer's cuisine preferences
 */
export async function getCustomerPreferences(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const customer = await CustomerService.getCustomerById(id);
    if (!customer) {
      return sendError(res, 'Customer not found', 404, 'CUSTOMER_NOT_FOUND');
    }

    const preferences = await CustomerService.getCuisinePreferences(id);

    sendSuccess(res, preferences, 'Cuisine preferences retrieved', 200);
  } catch (error) {
    console.error('Get customer preferences error:', error);
    next(error);
  }
}

/**
 * GET /api/customers/:id/stats
 * Get customer spending statistics
 */
export async function getCustomerStats(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const customer = await CustomerService.getCustomerById(id);
    if (!customer) {
      return sendError(res, 'Customer not found', 404, 'CUSTOMER_NOT_FOUND');
    }

    const stats = await CustomerService.getSpendingStats(id);

    sendSuccess(res, stats, 'Customer statistics retrieved', 200);
  } catch (error) {
    console.error('Get customer stats error:', error);
    next(error);
  }
}

export default {
  getAllCustomers,
  getCustomerById,
  getCustomerPurchases,
  getCustomerOrders,
  getCustomerPreferences,
  getCustomerStats
};
