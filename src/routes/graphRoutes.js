import express from 'express';
import {
  getCustomerSubgraph,
  getExpandedSubgraph,
  getGraphStatistics,
  getGraphExploration
} from '../controllers/graphController.js';

const router = express.Router();

/**
 * GET /api/graph/customer/:id
 * Get customer subgraph for visualization
 */
router.get('/customer/:id', getCustomerSubgraph);

/**
 * GET /api/graph/customer/:id/expanded
 * Get expanded customer subgraph
 */
router.get('/customer/:id/expanded', getExpandedSubgraph);

/**
 * GET /api/graph/customer/:id/statistics
 * Get graph statistics
 */
router.get('/customer/:id/statistics', getGraphStatistics);

/**
 * GET /api/graph/customer/:id/exploration
 * Get complete graph exploration data
 */
router.get('/customer/:id/exploration', getGraphExploration);

export default router;
