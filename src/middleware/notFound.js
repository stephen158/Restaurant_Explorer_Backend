import { sendError } from '../utils/response.js';

/**
 * 404 Not Found middleware
 * Should be registered after all other routes
 */
export function notFound(req, res, next) {
  sendError(res, `Endpoint ${req.method} ${req.originalUrl} not found`, 404, 'ENDPOINT_NOT_FOUND');
}

export default notFound;
