import { sendError } from '../utils/response.js';

/**
 * Centralized error handling middleware
 */
export function errorHandler(err, req, res, next) {
  // Log error with detailed information
  console.error('Error Details:', {
    message: err.message,
    code: err.code,
    stack: err.stack,
    path: req.path,
    method: req.method,
    query: req.query,
    params: req.params
  });

  // Database connection error
  if (err.message && err.message.includes('database') && err.message.includes('connection')) {
    return sendError(res, 'Database connection unavailable', 503);
  }

  // Invalid customer/restaurant ID
  if (err.message && err.message.includes('Invalid customer ID')) {
    return sendError(res, 'Invalid customer ID provided', 400, 'INVALID_CUSTOMER_ID');
  }

  if (err.message && err.message.includes('Invalid restaurant ID')) {
    return sendError(res, 'Invalid restaurant ID provided', 400, 'INVALID_RESTAURANT_ID');
  }

  // Customer/Restaurant not found
  if (err.message && err.message.includes('Customer not found')) {
    return sendError(res, 'Customer not found', 404, 'CUSTOMER_NOT_FOUND');
  }

  if (err.message && err.message.includes('Restaurant not found')) {
    return sendError(res, 'Restaurant not found', 404, 'RESTAURANT_NOT_FOUND');
  }

  // Query error
  if (err.message && err.message.includes('query')) {
    return sendError(res, 'Database query failed', 500, 'QUERY_ERROR');
  }

  // Invalid request parameters
  if (err.message && (err.message.includes('Invalid') || err.message.includes('validation'))) {
    return sendError(res, err.message, 400, 'VALIDATION_ERROR');
  }

  // Neo4j/Driver errors
  if (err.code) {
    if (err.code === 'Neo.ClientError.Database.DatabaseNotFound') {
      return sendError(res, 'Database not found', 404);
    }
    if (err.code === 'Neo.ClientError.Security.Unauthorized') {
      return sendError(res, 'Unauthorized database access', 401);
    }
    if (err.code === 'Neo.ClientError.Database.DatabaseUnavailable') {
      return sendError(res, 'Database unavailable', 503);
    }
    // Generic Neo4j error
    return sendError(res, `Database error: ${err.message}`, 500, 'DATABASE_ERROR');
  }

  // Generic server error
  sendError(res, 'An unexpected error occurred', 500);
}

export default errorHandler;
