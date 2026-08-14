// Restaurant Queries

export const restaurantQueries = {
  // Get all restaurants with pagination
  getAllRestaurants: `
    MATCH (r:Restaurant)
    OPTIONAL MATCH (r)-[:HAS_CUISINE]->(c:Cuisine)
    OPTIONAL MATCH (r)-[:LOCATED_IN]->(a:Area)
    RETURN 
      r.id AS id,
      r.name AS name,
      r.description AS description,
      r.rating AS rating,
      r.address AS address,
      COLLECT(DISTINCT c.name) AS cuisines,
      COLLECT(DISTINCT a.name) AS areas
    ORDER BY r.rating DESC
    SKIP $skip
    LIMIT $limit
  `,

  // Get restaurant by ID with details
  getRestaurantById: `
    MATCH (r:Restaurant {id: $restaurantId})
    OPTIONAL MATCH (r)-[:HAS_CUISINE]->(c:Cuisine)
    OPTIONAL MATCH (r)-[:LOCATED_IN]->(a:Area)
    OPTIONAL MATCH (r)-[:SERVES]->(d:Dish)
    RETURN 
      r.id AS id,
      r.name AS name,
      r.description AS description,
      r.rating AS rating,
      r.address AS address,
      COLLECT(DISTINCT c.name) AS cuisines,
      COLLECT(DISTINCT a.name) AS areas,
      COLLECT(DISTINCT {id: d.id, name: d.name, price: d.price}) AS dishes
  `,

  // Search restaurants by name
  searchRestaurantsByName: `
    MATCH (r:Restaurant)
    WHERE TOLOWER(r.name) CONTAINS TOLOWER($searchTerm)
    OPTIONAL MATCH (r)-[:HAS_CUISINE]->(c:Cuisine)
    OPTIONAL MATCH (r)-[:LOCATED_IN]->(a:Area)
    RETURN 
      r.id AS id,
      r.name AS name,
      r.description AS description,
      r.rating AS rating,
      r.address AS address,
      COLLECT(DISTINCT c.name) AS cuisines,
      COLLECT(DISTINCT a.name) AS areas
    ORDER BY r.rating DESC
    SKIP $skip
    LIMIT $limit
  `,

  // Filter restaurants by cuisine
  getRestaurantsByCuisine: `
    MATCH (r:Restaurant)-[:HAS_CUISINE]->(c:Cuisine {name: $cuisineName})
    OPTIONAL MATCH (r)-[:HAS_CUISINE]->(c2:Cuisine)
    OPTIONAL MATCH (r)-[:LOCATED_IN]->(a:Area)
    RETURN 
      r.id AS id,
      r.name AS name,
      r.description AS description,
      r.rating AS rating,
      r.address AS address,
      COLLECT(DISTINCT c2.name) AS cuisines,
      COLLECT(DISTINCT a.name) AS areas
    ORDER BY r.rating DESC
    SKIP $skip
    LIMIT $limit
  `,

  // Filter restaurants by area
  getRestaurantsByArea: `
    MATCH (r:Restaurant)-[:LOCATED_IN]->(a:Area {name: $areaName})
    OPTIONAL MATCH (r)-[:HAS_CUISINE]->(c:Cuisine)
    OPTIONAL MATCH (r)-[:LOCATED_IN]->(a2:Area)
    RETURN 
      r.id AS id,
      r.name AS name,
      r.description AS description,
      r.rating AS rating,
      r.address AS address,
      COLLECT(DISTINCT c.name) AS cuisines,
      COLLECT(DISTINCT a2.name) AS areas
    ORDER BY r.rating DESC
    SKIP $skip
    LIMIT $limit
  `,

  // Filter by cuisine and area
  getRestaurantsByCuisineAndArea: `
    MATCH (r:Restaurant)-[:HAS_CUISINE]->(c:Cuisine {name: $cuisineName})
    OPTIONAL MATCH (r)-[:HAS_CUISINE]->(c2:Cuisine)
    OPTIONAL MATCH (r)-[:LOCATED_IN]->(a:Area)
    RETURN 
      r.id AS id,
      r.name AS name,
      r.description AS description,
      r.rating AS rating,
      r.address AS address,
      COLLECT(DISTINCT c2.name) AS cuisines,
      COLLECT(DISTINCT a.name) AS areas
    ORDER BY r.rating DESC
    SKIP $skip
    LIMIT $limit
  `,

  // Filter by cuisine and area (alternative approach)
  getRestaurantsByCuisineAndAreaV2: `
    MATCH (r:Restaurant)
    WHERE EXISTS { (r)-[:HAS_CUISINE]->(c:Cuisine {name: $cuisineName}) }
      AND EXISTS { (r)-[:LOCATED_IN]->(a:Area {name: $areaName}) }
    OPTIONAL MATCH (r)-[:HAS_CUISINE]->(c2:Cuisine)
    OPTIONAL MATCH (r)-[:LOCATED_IN]->(a2:Area)
    RETURN 
      r.id AS id,
      r.name AS name,
      r.description AS description,
      r.rating AS rating,
      r.address AS address,
      COLLECT(DISTINCT c2.name) AS cuisines,
      COLLECT(DISTINCT a2.name) AS areas
    ORDER BY r.rating DESC
    SKIP $skip
    LIMIT $limit
  `,

  // Combined search and filters
  searchRestaurantsAdvanced: `
    MATCH (r:Restaurant)
    WHERE TOLOWER(r.name) CONTAINS TOLOWER($searchTerm)
    OPTIONAL MATCH (r)-[:HAS_CUISINE]->(c:Cuisine)
    OPTIONAL MATCH (r)-[:LOCATED_IN]->(a:Area)
    WITH r, c, a
    WHERE ($cuisines IS NULL OR c.name IN $cuisines)
      AND ($areas IS NULL OR a.name IN $areas)
    OPTIONAL MATCH (r)-[:HAS_CUISINE]->(c2:Cuisine)
    OPTIONAL MATCH (r)-[:LOCATED_IN]->(a2:Area)
    RETURN DISTINCT 
      r.id AS id,
      r.name AS name,
      r.description AS description,
      r.rating AS rating,
      r.address AS address,
      COLLECT(DISTINCT c2.name) AS cuisines,
      COLLECT(DISTINCT a2.name) AS areas
    ORDER BY r.rating DESC
    SKIP $skip
    LIMIT $limit
  `,

  // Get restaurants serving a specific dish
  getRestaurantsServingDish: `
    MATCH (r:Restaurant)-[:SERVES]->(d:Dish {id: $dishId})
    OPTIONAL MATCH (r)-[:HAS_CUISINE]->(c:Cuisine)
    OPTIONAL MATCH (r)-[:LOCATED_IN]->(a:Area)
    RETURN 
      r.id AS id,
      r.name AS name,
      r.description AS description,
      r.rating AS rating,
      r.address AS address,
      COLLECT(DISTINCT c.name) AS cuisines,
      COLLECT(DISTINCT a.name) AS areas
    ORDER BY r.rating DESC
  `,

  // Count total restaurants
  countRestaurants: `
    MATCH (r:Restaurant) 
    RETURN COUNT(r) AS total
  `,

  // Count restaurants by cuisine
  countRestaurantsByCuisine: `
    MATCH (r:Restaurant)-[:HAS_CUISINE]->(c:Cuisine {name: $cuisineName})
    RETURN COUNT(r) AS total
  `,

  // Count restaurants by area
  countRestaurantsByArea: `
    MATCH (r:Restaurant)-[:LOCATED_IN]->(a:Area {name: $areaName})
    RETURN COUNT(r) AS total
  `,

  // Count restaurants by cuisine and area
  countRestaurantsByCuisineAndArea: `
    MATCH (r:Restaurant)
    WHERE EXISTS { (r)-[:HAS_CUISINE]->(c:Cuisine {name: $cuisineName}) }
      AND EXISTS { (r)-[:LOCATED_IN]->(a:Area {name: $areaName}) }
    RETURN COUNT(r) AS total
  `
};

export default restaurantQueries;
