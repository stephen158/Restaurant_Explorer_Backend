import { executeQueryAndReturnSingle, executeQueryAndReturnRecords } from '../config/database.js';
import { graphQueries } from '../queries/graphQueries.js';
import CustomerService from './customerService.js';

export class GraphService {
  /**
   * Validate customer ID
   */
  static validateCustomerId(id) {
    return id && id.trim().length > 0;
  }

  /**
   * Get customer subgraph for visualization
   * Returns nodes and relationships in a format suitable for graph visualization
   */
  static async getCustomerSubgraph(customerId) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      // Verify customer exists
      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const result = await executeQueryAndReturnSingle(
        graphQueries.getCustomerSubgraph,
        { customerId }
      );

      if (!result || !result.graph) {
        return {
          customerId,
          nodes: [],
          relationships: []
        };
      }

      // Filter out null nodes and relationships
      const graph = result.graph;
      const nodes = graph.nodes.filter(node => node && node.id);
      const relationships = graph.relationships.filter(rel => rel && rel.source && rel.target);

      return {
        customerId,
        nodes: this.formatNodes(nodes),
        relationships: this.formatRelationships(relationships),
        statistics: {
          nodeCount: nodes.length,
          relationshipCount: relationships.length
        }
      };
    } catch (error) {
      console.error('Error fetching customer subgraph:', error);
      throw error;
    }
  }

  /**
   * Get expanded subgraph with depth limit
   */
  static async getCustomerSubgraphExpanded(customerId, maxDepth = 100) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const depth_value = Math.max(10, Math.min(1000, parseInt(maxDepth) || 100));

      const result = await executeQueryAndReturnSingle(
        graphQueries.getCustomerSubgraphExpanded,
        { customerId, maxDepth: depth_value }
      );

      if (!result || !result.nodes) {
        return {
          customerId,
          nodes: []
        };
      }

      return {
        customerId,
        nodes: this.formatNodes(result.nodes)
      };
    } catch (error) {
      console.error('Error fetching expanded subgraph:', error);
      throw error;
    }
  }

  /**
   * Get graph statistics for customer
   */
  static async getGraphStatistics(customerId) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const result = await executeQueryAndReturnSingle(
        graphQueries.getGraphStatistics,
        { customerId }
      );

      if (!result || !result.stats) {
        return null;
      }

      return result.stats;
    } catch (error) {
      console.error('Error fetching graph statistics:', error);
      throw error;
    }
  }

  /**
   * Format nodes for frontend visualization
   */
  static formatNodes(nodes) {
    return nodes.map((node) => ({
      id: node.id,
      type: node.type,
      label: node.label || node.id,
      properties: node.properties || {}
    })).filter(node => node.id);
  }

  /**
   * Format relationships for frontend visualization
   */
  static formatRelationships(relationships) {
    return relationships.map((rel) => ({
      id: `${rel.source}-${rel.type}-${rel.target}`,
      type: rel.type,
      source: rel.source,
      target: rel.target,
      properties: rel.properties || {}
    })).filter(rel => rel.source && rel.target);
  }

  /**
   * Format graph data for hierarchical display
   */
  static formatGraphDisplay(nodes, relationships, customerId) {
    // Find the customer node
    const customerNode = nodes.find(n => n.type === 'Customer' && n.id === customerId);
    
    // Find all orders placed by customer
    const orderRelationships = relationships.filter(
      r => r.type === 'PLACED' && r.source === customerId
    );
    
    const display = [];
    
    if (customerNode) {
      display.push({
        type: 'Customer',
        label: customerNode.label,
        id: customerNode.id,
        properties: customerNode.properties
      });
    }
    
    // For each order, get the hierarchy
    orderRelationships.forEach(orderRel => {
      const orderNode = nodes.find(n => n.id === orderRel.target && n.type === 'Order');
      if (orderNode) {
        display.push({
          type: 'Order',
          label: orderNode.label,
          id: orderNode.id,
          properties: orderNode.properties
        });
        
        // Find all dishes in this order
        const dishRelationships = relationships.filter(
          r => r.type === 'CONTAINS' && r.source === orderNode.id
        );
        
        dishRelationships.forEach(dishRel => {
          const dishNode = nodes.find(n => n.id === dishRel.target && n.type === 'Dish');
          if (dishNode) {
            display.push({
              type: 'Dish',
              label: dishNode.label,
              id: dishNode.id,
              properties: dishNode.properties
            });
            
            // Find category for this dish
            const categoryRel = relationships.find(
              r => r.type === 'BELONGS_TO' && r.source === dishNode.id
            );
            if (categoryRel) {
              const categoryNode = nodes.find(n => n.id === categoryRel.target && n.type === 'Category');
              if (categoryNode) {
                display.push({
                  type: 'Category',
                  label: categoryNode.label,
                  id: categoryNode.id,
                  properties: categoryNode.properties
                });
              }
            }
          }
        });
      }
    });
    
    // Add area information
    const areaRel = relationships.find(r => r.type === 'LIVES_IN' && r.source === customerId);
    if (areaRel) {
      const areaNode = nodes.find(n => n.id === areaRel.target && n.type === 'Area');
      if (areaNode) {
        display.push({
          type: 'Area',
          label: areaNode.label,
          id: areaNode.id,
          properties: areaNode.properties
        });
      }
    }
    
    // Add cuisine preferences
    const cuisineRel = relationships.find(r => r.type === 'LIKES' && r.source === customerId);
    if (cuisineRel) {
      const cuisineNode = nodes.find(n => n.id === cuisineRel.target && n.type === 'Cuisine');
      if (cuisineNode) {
        display.push({
          type: 'Cuisine',
          label: cuisineNode.label,
          id: cuisineNode.id,
          properties: cuisineNode.properties
        });
      }
    }
    
    return display;
  }

  /**
   * Get graph exploration data for API
   */
  static async getGraphExplorationData(customerId) {
    if (!this.validateCustomerId(customerId)) {
      throw new Error('Invalid customer ID');
    }

    try {
      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const [subgraph, stats] = await Promise.all([
        this.getCustomerSubgraph(customerId),
        this.getGraphStatistics(customerId)
      ]);

      // Format display data
      const displayData = this.formatGraphDisplay(
        subgraph.nodes,
        subgraph.relationships,
        customerId
      );

      return {
        success: true,
        data: {
          customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email
          },
          graph: subgraph,
          display: displayData,
          statistics: stats
        }
      };
    } catch (error) {
      console.error('Error fetching graph exploration data:', error);
      throw error;
    }
  }
}

export default GraphService;
