// Customer Queries

export const customerQueries = {
  // Get all customers with pagination
  getAllCustomers: `
    MATCH (c:Customer)
    OPTIONAL MATCH (c)-[:LIVES_IN]->(a:Area)
    OPTIONAL MATCH (c)-[:LIKES]->(cu:Cuisine)
    RETURN 
      c.id AS id,
      c.name AS name,
      c.email AS email,
      c.phone AS phone,
      COLLECT(DISTINCT a.name) AS areas,
      COLLECT(DISTINCT cu.name) AS cuisines
    ORDER BY c.name
    SKIP $skip
    LIMIT $limit
  `,

  // Get customer by ID with details
  getCustomerById: `
    MATCH (c:Customer {id: $customerId})
    OPTIONAL MATCH (c)-[:LIVES_IN]->(a:Area)
    OPTIONAL MATCH (c)-[:LIKES]->(cu:Cuisine)
    RETURN 
      c.id AS id,
      c.name AS name,
      c.email AS email,
      c.phone AS phone,
      COLLECT(DISTINCT a.name) AS areas,
      COLLECT(DISTINCT cu.name) AS cuisines
  `,

  // Get customer purchases with order and dish details
  getCustomerPurchases: `
    MATCH (c:Customer {id: $customerId})-[:PLACED]->(o:Order)-[:CONTAINS]->(d:Dish)
    RETURN 
      o.id AS orderId,
      o.orderDate AS orderDate,
      o.totalAmount AS totalAmount,
      o.status AS status,
      COLLECT(DISTINCT {id: d.id, name: d.name, price: d.price}) AS dishes
    ORDER BY o.orderDate DESC
    SKIP $skip
    LIMIT $limit
  `,

  // Get customer orders
  getCustomerOrders: `
    MATCH (c:Customer {id: $customerId})-[:PLACED]->(o:Order)
    RETURN 
      o.id AS id,
      o.orderDate AS orderDate,
      o.totalAmount AS totalAmount,
      o.status AS status
    ORDER BY o.orderDate DESC
    SKIP $skip
    LIMIT $limit
  `,

  // Search customers by name
  searchCustomersByName: `
    MATCH (c:Customer)
    WHERE TOLOWER(c.name) CONTAINS TOLOWER($searchTerm)
    OPTIONAL MATCH (c)-[:LIVES_IN]->(a:Area)
    OPTIONAL MATCH (c)-[:LIKES]->(cu:Cuisine)
    RETURN 
      c.id AS id,
      c.name AS name,
      c.email AS email,
      c.phone AS phone,
      COLLECT(DISTINCT a.name) AS areas,
      COLLECT(DISTINCT cu.name) AS cuisines
    ORDER BY c.name
    SKIP $skip
    LIMIT $limit
  `,

  // Get customer's cuisine preferences
  getCustomerCuisinePreferences: `
    MATCH (c:Customer {id: $customerId})-[:LIKES]->(cu:Cuisine)
    RETURN DISTINCT cu.id, cu.name
  `,

  // Get customer's area
  getCustomerArea: `
    MATCH (c:Customer {id: $customerId})-[:LIVES_IN]->(a:Area)
    RETURN a.id, a.name, a.city
  `,

  // Get all dishes purchased by customer
  getCustomerPurchasedDishes: `
    MATCH (c:Customer {id: $customerId})-[:PLACED]->(:Order)-[:CONTAINS]->(d:Dish)
    RETURN DISTINCT d.id, d.name, d.price
    ORDER BY d.name
  `,

  // Count total customers
  countCustomers: `
    MATCH (c:Customer) 
    RETURN COUNT(c) AS total
  `,

  // Count customer orders
  countCustomerOrders: `
    MATCH (c:Customer {id: $customerId})-[:PLACED]->(:Order)
    RETURN COUNT(*) AS total
  `,

  // Get customer spending statistics
  getCustomerSpendingStats: `
    MATCH (c:Customer {id: $customerId})-[:PLACED]->(o:Order)
    RETURN 
      COUNT(o) AS totalOrders,
      SUM(o.totalAmount) AS totalSpent,
      AVG(o.totalAmount) AS avgOrderValue,
      MAX(o.totalAmount) AS maxOrderValue,
      MIN(o.totalAmount) AS minOrderValue
  `
};

export default customerQueries;
