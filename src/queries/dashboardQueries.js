// Dashboard Queries

export const dashboardQueries = {
  // Count all nodes
  getRestaurantCount: `
    MATCH (r:Restaurant) 
    RETURN COUNT(r) AS count
  `,

  getCustomerCount: `
    MATCH (c:Customer) 
    RETURN COUNT(c) AS count
  `,

  getDishCount: `
    MATCH (d:Dish) 
    RETURN COUNT(d) AS count
  `,

  getOrderCount: `
    MATCH (o:Order) 
    RETURN COUNT(o) AS count
  `,

  getCategoryCount: `
    MATCH (cat:Category) 
    RETURN COUNT(cat) AS count
  `,

  getCuisineCount: `
    MATCH (c:Cuisine) 
    RETURN COUNT(c) AS count
  `,

  // Popular cuisines
  getPopularCuisines: `
    MATCH (r:Restaurant)-[:HAS_CUISINE]->(c:Cuisine)
    RETURN c.id, c.name, COUNT(r) AS restaurantCount
    ORDER BY restaurantCount DESC
    LIMIT 5
  `,

  // Popular dishes (most ordered)
  getPopularDishes: `
    MATCH (o:Order)-[:CONTAINS]->(d:Dish)
    RETURN d.id, d.name, d.price, COUNT(o) AS orderCount
    ORDER BY orderCount DESC
    LIMIT 10
  `,

  // Top rated restaurants
  getTopRestaurants: `
    MATCH (r:Restaurant)
    RETURN r.id, r.name, r.rating, COUNT(DISTINCT r) AS total
    ORDER BY r.rating DESC
    LIMIT 10
  `,

  // Recent orders
  getRecentOrders: `
    MATCH (c:Customer)-[:PLACED]->(o:Order)
    RETURN 
      o.id AS orderId,
      c.id AS customerId,
      c.name AS customerName,
      o.orderDate AS orderDate,
      o.totalAmount AS totalAmount,
      o.status AS status
    ORDER BY o.orderDate DESC
    LIMIT 20
  `
};

export default dashboardQueries;
