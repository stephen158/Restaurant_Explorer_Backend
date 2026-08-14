import { verifyConnection } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /api/health
 * Verify database connection
 */
export async function getHealth(req, res, next) {
  try {
    const connected = await verifyConnection();

    if (connected) {
      return sendSuccess(res, { database: 'connected' }, 'Health check passed', 200);
    } else {
      return sendError(res, 'Database connection unavailable', 503);
    }
  } catch (error) {
    console.error('Health check error:', error);
    return sendError(res, 'Health check failed', 500);
  }
}

export default { getHealth };
