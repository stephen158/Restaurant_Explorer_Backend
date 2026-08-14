import GraphService from '../services/graphService.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /api/graph/customer/:id
 * Get customer subgraph for visualization
 * Returns nodes and relationships for frontend graph rendering
 * Also includes formatted display data
 */
export async function getCustomerSubgraph(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const subgraph = await GraphService.getCustomerSubgraph(id);
    
    // Format display data
    const displayData = GraphService.formatGraphDisplay(
      subgraph.nodes,
      subgraph.relationships,
      id
    );

    const responseData = {
      success: true,
      customerId: id,
      nodes: subgraph.nodes,
      relationships: subgraph.relationships,
      display: displayData,
      statistics: subgraph.statistics
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Get customer subgraph error:', error);
    next(error);
  }
}

/**
 * GET /api/graph/customer/:id/expanded
 * Get expanded customer subgraph with depth limit
 */
export async function getExpandedSubgraph(req, res, next) {
  try {
    const { id } = req.params;
    const { maxDepth = 100 } = req.query;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const subgraph = await GraphService.getCustomerSubgraphExpanded(id, maxDepth);

    const responseData = {
      success: true,
      customerId: id,
      nodes: subgraph.nodes
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Get expanded subgraph error:', error);
    next(error);
  }
}

/**
 * GET /api/graph/customer/:id/statistics
 * Get graph statistics for a customer
 */
export async function getGraphStatistics(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const statistics = await GraphService.getGraphStatistics(id);

    sendSuccess(res, statistics, 'Graph statistics retrieved', 200);
  } catch (error) {
    console.error('Get graph statistics error:', error);
    next(error);
  }
}

/**
 * GET /api/graph/customer/:id/exploration
 * Get complete graph exploration data
 */
export async function getGraphExploration(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, 'Customer ID is required', 400);
    }

    const explorationData = await GraphService.getGraphExplorationData(id);

    res.status(200).json(explorationData);
  } catch (error) {
    console.error('Get graph exploration error:', error);
    next(error);
  }
}

export default {
  getCustomerSubgraph,
  getExpandedSubgraph,
  getGraphStatistics,
  getGraphExploration
};
