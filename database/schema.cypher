// CognoDB Schema for Restaurant Recommendation System
// This file documents the graph data model and indexes

// =======================
// Node Types
// =======================

/*
CREATE CONSTRAINT unique_customer_id IF NOT EXISTS
ON (c:Customer) ASSERT c.id IS UNIQUE;

CREATE CONSTRAINT unique_restaurant_id IF NOT EXISTS
ON (r:Restaurant) ASSERT r.id IS UNIQUE;

CREATE CONSTRAINT unique_dish_id IF NOT EXISTS
ON (d:Dish) ASSERT d.id IS UNIQUE;

CREATE CONSTRAINT unique_order_id IF NOT EXISTS
ON (o:Order) ASSERT o.id IS UNIQUE;

CREATE CONSTRAINT unique_category_id IF NOT EXISTS
ON (cat:Category) ASSERT cat.id IS UNIQUE;

CREATE CONSTRAINT unique_cuisine_id IF NOT EXISTS
ON (cu:Cuisine) ASSERT cu.id IS UNIQUE;

CREATE CONSTRAINT unique_area_id IF NOT EXISTS
ON (a:Area) ASSERT a.id IS UNIQUE;

CREATE INDEX idx_customer_email IF NOT EXISTS
ON (c:Customer) FOR (c.email);

CREATE INDEX idx_restaurant_name IF NOT EXISTS
ON (r:Restaurant) FOR (r.name);

CREATE INDEX idx_dish_name IF NOT EXISTS
ON (d:Dish) FOR (d.name);

CREATE INDEX idx_order_date IF NOT EXISTS
ON (o:Order) FOR (o.orderDate);

CREATE INDEX idx_area_city IF NOT EXISTS
ON (a:Area) FOR (a.city);
*/

// =======================
// Node Properties
// =======================

// Customer Node
// {
//   id: string (unique)
//   name: string
//   email: string
//   phone: string
// }

// Order Node
// {
//   id: string (unique)
//   orderDate: date
//   totalAmount: float
//   status: string (pending, completed, cancelled)
// }

// Dish Node
// {
//   id: string (unique)
//   name: string
//   price: float
//   description: string
// }

// Category Node
// {
//   id: string (unique)
//   name: string
// }

// Restaurant Node
// {
//   id: string (unique)
//   name: string
//   description: string
//   rating: float (0-5)
//   address: string
// }

// Cuisine Node
// {
//   id: string (unique)
//   name: string
// }

// Area Node
// {
//   id: string (unique)
//   name: string
//   city: string
// }

// =======================
// Relationships
// =======================

// PLACED: Customer -> Order
// Properties: None required

// CONTAINS: Order -> Dish
// Properties: quantity (integer)

// BELONGS_TO: Dish -> Category
// Properties: None required

// SERVES: Restaurant -> Dish
// Properties: None required

// HAS_CUISINE: Restaurant -> Cuisine
// Properties: None required

// LOCATED_IN: Restaurant -> Area
// Properties: None required

// LIVES_IN: Customer -> Area
// Properties: None required

// LIKES: Customer -> Cuisine
// Properties: preference (string, optional)

// =======================
// Query Patterns
// =======================

// Find orders by customer:
// MATCH (c:Customer {id: $customerId})-[:PLACED]->(o:Order) RETURN o

// Find dishes in an order:
// MATCH (o:Order {id: $orderId})-[:CONTAINS]->(d:Dish) RETURN d

// Find restaurants serving a dish:
// MATCH (r:Restaurant)-[:SERVES]->(d:Dish {id: $dishId}) RETURN r

// Recommendation path:
// MATCH (target:Customer {id: $customerId})
//       -[:PLACED]->(:Order)
//       -[:CONTAINS]->(d:Dish)
// MATCH (similar:Customer)
//       -[:PLACED]->(:Order)
//       -[:CONTAINS]->(d)
// MATCH (similar)
//       -[:PLACED]->(:Order)
//       -[:CONTAINS]->(recommended:Dish)
// MATCH (restaurant:Restaurant)
//       -[:SERVES]->(recommended)
// WHERE target <> similar
// RETURN restaurant
