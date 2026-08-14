// Graph Explorer Queries

export const graphQueries = {
  // Get customer subgraph for visualization
  getCustomerSubgraph: `
    MATCH (c:Customer {id: $customerId})
    
    // Get direct relationships
    OPTIONAL MATCH (c)-[rel1:PLACED]->(o:Order)
    OPTIONAL MATCH (o)-[rel2:CONTAINS]->(d:Dish)
    OPTIONAL MATCH (d)-[rel3:BELONGS_TO]->(cat:Category)
    OPTIONAL MATCH (d)-[served:SERVED_BY]-(r:Restaurant)
    OPTIONAL MATCH (r)-[rel5:HAS_CUISINE]->(cu:Cuisine)
    OPTIONAL MATCH (r)-[rel6:LOCATED_IN]->(a:Area)
    OPTIONAL MATCH (c)-[rel7:LIVES_IN]->(ca:Area)
    OPTIONAL MATCH (c)-[rel8:LIKES]->(pref:Cuisine)
    
    RETURN {
      nodes: [
        {id: c.id, type: 'Customer', label: c.name, properties: {name: c.name, email: c.email}},
        {id: o.id, type: 'Order', label: 'Order ' + o.id, properties: {date: o.orderDate, amount: o.totalAmount, status: o.status}},
        {id: d.id, type: 'Dish', label: d.name, properties: {name: d.name, price: d.price}},
        {id: cat.id, type: 'Category', label: cat.name, properties: {name: cat.name}},
        {id: r.id, type: 'Restaurant', label: r.name, properties: {name: r.name, rating: r.rating}},
        {id: cu.id, type: 'Cuisine', label: cu.name, properties: {name: cu.name}},
        {id: a.id, type: 'Area', label: a.name, properties: {name: a.name, city: a.city}},
        {id: ca.id, type: 'Area', label: ca.name, properties: {name: ca.name, city: ca.city}},
        {id: pref.id, type: 'Cuisine', label: pref.name, properties: {name: pref.name}}
      ],
      relationships: [
        {source: c.id, target: o.id, type: 'PLACED', properties: {}},
        {source: o.id, target: d.id, type: 'CONTAINS', properties: rel2},
        {source: d.id, target: cat.id, type: 'BELONGS_TO', properties: {}},
        {source: r.id, target: d.id, type: 'SERVES', properties: {}},
        {source: r.id, target: cu.id, type: 'HAS_CUISINE', properties: {}},
        {source: r.id, target: a.id, type: 'LOCATED_IN', properties: {}},
        {source: c.id, target: ca.id, type: 'LIVES_IN', properties: {}},
        {source: c.id, target: pref.id, type: 'LIKES', properties: {}}
      ]
    } AS graph
  `,

  // Get expanded subgraph with depth limit
  getCustomerSubgraphExpanded: `
    MATCH (c:Customer {id: $customerId})
    OPTIONAL MATCH (c)-[:PLACED]->(o:Order)-[:CONTAINS]->(d:Dish)-[:BELONGS_TO]->(cat:Category)
    OPTIONAL MATCH (r:Restaurant)-[:SERVES]->(d)
    OPTIONAL MATCH (r)-[:HAS_CUISINE]->(cu:Cuisine)
    OPTIONAL MATCH (r)-[:LOCATED_IN]->(a:Area)
    OPTIONAL MATCH (c)-[:LIVES_IN]->(ca:Area)
    OPTIONAL MATCH (c)-[:LIKES]->(pref:Cuisine)
    
    OPTIONAL MATCH (similar:Customer)-[:PLACED]->(:Order)-[:CONTAINS]->(d)
    WHERE similar <> c
    
    WITH c, o, d, cat, r, cu, a, ca, pref, similar
    LIMIT $maxDepth
    
    RETURN 
      COLLECT(DISTINCT {
        id: COALESCE(c.id, o.id, d.id, cat.id, r.id, cu.id, a.id, ca.id, pref.id, similar.id),
        type: CASE 
          WHEN c.id IS NOT NULL THEN 'Customer'
          WHEN o.id IS NOT NULL THEN 'Order'
          WHEN d.id IS NOT NULL THEN 'Dish'
          WHEN cat.id IS NOT NULL THEN 'Category'
          WHEN r.id IS NOT NULL THEN 'Restaurant'
          WHEN cu.id IS NOT NULL THEN 'Cuisine'
          WHEN a.id IS NOT NULL THEN 'Area'
          WHEN ca.id IS NOT NULL THEN 'Area'
          WHEN pref.id IS NOT NULL THEN 'Cuisine'
          WHEN similar.id IS NOT NULL THEN 'Customer'
        END,
        label: COALESCE(c.name, 'Order ' + o.id, d.name, cat.name, r.name, cu.name, a.name, ca.name, pref.name, similar.name),
        properties: {}
      }) AS nodes
  `,

  // Get relationship statistics for graph
  getGraphStatistics: `
    MATCH (c:Customer {id: $customerId})
    
    OPTIONAL MATCH (c)-[:PLACED]->(o:Order)
    OPTIONAL MATCH (c)-[:LIVES_IN]->(area:Area)
    OPTIONAL MATCH (c)-[:LIKES]->(cuisine:Cuisine)
    OPTIONAL MATCH (c)-[:PLACED]->(:Order)-[:CONTAINS]->(dish:Dish)
    
    RETURN {
      customerId: c.id,
      customerName: c.name,
      orderCount: COUNT(DISTINCT o),
      areasCount: COUNT(DISTINCT area),
      cuisinePreferencesCount: COUNT(DISTINCT cuisine),
      uniqueDishesOrdered: COUNT(DISTINCT dish)
    } AS stats
  `
};

export default graphQueries;
