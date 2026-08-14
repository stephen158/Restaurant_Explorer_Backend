/**
 * Success response formatter
 */
export function success(data, message = 'Success') {
  return {
    success: true,
    message,
    data
  };
}

/**
 * Error response formatter
 */
export function error(message, errorCode = null) {
  return {
    success: false,
    message,
    ...(errorCode && { errorCode })
  };
}

/**
 * Paginated response formatter
 */
export function paginated(data, skip, limit, total) {
  return {
    success: true,
    data,
    pagination: {
      skip,
      limit,
      total,
      hasMore: skip + limit < total
    }
  };
}

/**
 * Send success response
 */
export function sendSuccess(res, data, message = 'Success', statusCode = 200) {
  res.status(statusCode).json(success(data, message));
}

/**
 * Send error response
 */
export function sendError(res, message, statusCode = 400, errorCode = null) {
  res.status(statusCode).json(error(message, errorCode));
}

/**
 * Send paginated response
 */
export function sendPaginated(res, data, skip, limit, total, statusCode = 200) {
  res.status(statusCode).json(paginated(data, skip, limit, total));
}

export default {
  success,
  error,
  paginated,
  sendSuccess,
  sendError,
  sendPaginated
};
