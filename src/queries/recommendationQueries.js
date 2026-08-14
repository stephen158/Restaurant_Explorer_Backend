// Recommendation Queries - Multi-hop Graph Traversal

export const recommendationQueries = {
  // Core recommendation algorithm - with fallback for customers with no order history
  // Finds restaurants that similar customers have ordered from
  // Based on shared dish preferences
  getRecommendations: `
    MATCH (target:Customer {id: $customerId})
    
    OPTIONAL MATCH (target)-[:PLACED]->(:Order)-[:CONTAINS]->(d:Dish)
    
    WITH target, d
    OPTIONAL MATCH (similar:Customer)-[:PLACED]->(:Order)-[:CONTAINS]->(d)
    WHERE similar <> target AND d IS NOT NULL
    
    WITH target, similar, d
    OPTIONAL MATCH (similar)-[:PLACED]->(:Order)-[:CONTAINS]->(recommended:Dish)
    WHERE similar IS NOT NULL
    
    WITH target, similar, recommended
    OPTIONAL MATCH (restaurant:Restaurant)-[:SERVES]->(recommended)
    WHERE recommended IS NOT NULL
    
    WITH DISTINCT restaurant, COUNT(DISTINCT similar) AS similarCount, COUNT(DISTINCT recommended) AS dishCount
    WHERE restaurant IS NOT NULL
    
    RETURN
        restaurant.id AS id,
        restaurant.name AS name,
        restaurant.rating AS rating,
        restaurant.description AS description,
        similarCount AS similarCustomers,
        dishCount AS matchingDishes,
        ROUND((similarCount * 100) / 50.0) AS recommendationScore
    
    ORDER BY recommendationScore DESC, restaurant.rating DESC
    LIMIT $limit
  `,

  // Get recommendations with additional details - with fallback logic
  getRecommendationsDetailed: `
    MATCH (target:Customer {id: $customerId})
    
    OPTIONAL MATCH (target)-[:PLACED]->(:Order)-[:CONTAINS]->(d:Dish)
    
    WITH target, d
    OPTIONAL MATCH (similar:Customer)-[:PLACED]->(:Order)-[:CONTAINS]->(d)
    WHERE similar <> target AND d IS NOT NULL
    
    WITH target, similar, d
    OPTIONAL MATCH (similar)-[:PLACED]->(:Order)-[:CONTAINS]->(recommended:Dish)
    WHERE similar IS NOT NULL
    
    WITH target, similar, recommended
    OPTIONAL MATCH (restaurant:Restaurant)-[:SERVES]->(recommended)
    WHERE recommended IS NOT NULL
    
    OPTIONAL MATCH (restaurant)-[:HAS_CUISINE]->(c:Cuisine)
    OPTIONAL MATCH (restaurant)-[:LOCATED_IN]->(a:Area)
    
    WITH restaurant, c, a, recommended, COUNT(DISTINCT similar) AS similarCount, COUNT(DISTINCT recommended) AS dishCount
    WHERE restaurant IS NOT NULL
    
    RETURN
        restaurant.id AS id,
        restaurant.name AS name,
        restaurant.rating AS rating,
        restaurant.description AS description,
        restaurant.address AS address,
        COLLECT(DISTINCT c.name) AS cuisines,
        COLLECT(DISTINCT a.name) AS areas,
        similarCount AS similarCustomers,
        dishCount AS matchingDishes,
        ROUND((similarCount * 100) / 50.0) AS recommendationScore,
        COLLECT(DISTINCT {id: recommended.id, name: recommended.name, price: recommended.price}) AS recommendedDishes
    
    ORDER BY recommendationScore DESC, restaurant.rating DESC
    LIMIT $limit
  `,

  // Recommendations based on cuisine preferences
  getRecommendationsByCuisinePreference: `
    MATCH (target:Customer {id: $customerId})-[:LIKES]->(preferredCuisine:Cuisine)
    
    MATCH (restaurant:Restaurant)-[:HAS_CUISINE]->(preferredCuisine)
    
    WHERE NOT EXISTS {
      MATCH (target)-[:PLACED]->(:Order)-[:CONTAINS]->(:Dish)-[:BELONGS_TO]->(cat:Category)
                      <-[:BELONGS_TO]-(:Dish)<-[:SERVES]-(restaurant)
    }
    
    RETURN
        restaurant.id AS id,
        restaurant.name AS name,
        restaurant.rating AS rating,
        restaurant.description AS description,
        COUNT(DISTINCT preferredCuisine) AS matchingCuisines
    
    ORDER BY restaurant.rating DESC
    LIMIT $limit
  `,

  // Recommendations based on orders from similar area
  getRecommendationsByArea: `
    MATCH (target:Customer {id: $customerId})-[:LIVES_IN]->(area:Area)
    
    MATCH (similar:Customer)-[:LIVES_IN]->(area)
          -[:PLACED]->(:Order)
          -[:CONTAINS]->(d:Dish)
    
    MATCH (restaurant:Restaurant)
          -[:SERVES]->(d)
          -[:LOCATED_IN]->(area)
    
    WHERE target <> similar
    
    RETURN
        restaurant.id AS id,
        restaurant.name AS name,
        restaurant.rating AS rating,
        restaurant.description AS description,
        COUNT(DISTINCT similar) AS similarCustomersInArea,
        COUNT(DISTINCT d) AS matchingDishes
    
    ORDER BY similarCustomersInArea DESC, restaurant.rating DESC
    LIMIT $limit
  `,

  // Get top recommendations with reasoning
  getTopRecommendationsWithReason: `
    MATCH (target:Customer {id: $customerId})
          -[:PLACED]->(:Order)
          -[:CONTAINS]->(d:Dish)
    
    MATCH (similar:Customer)
          -[:PLACED]->(:Order)
          -[:CONTAINS]->(d)
    
    MATCH (similar)
          -[:PLACED]->(:Order)
          -[:CONTAINS]->(recommended:Dish)
    
    MATCH (restaurant:Restaurant)
          -[:SERVES]->(recommended)
    
    WHERE target <> similar
    
    WITH restaurant, COUNT(DISTINCT similar) AS similarCount, COUNT(DISTINCT recommended) AS dishCount
    
    MATCH (restaurant)-[:HAS_CUISINE]->(c:Cuisine)
    
    RETURN
        restaurant.id AS id,
        restaurant.name AS name,
        restaurant.rating AS rating,
        similarCount AS similarCustomers,
        dishCount AS matchingDishes,
        COLLECT(DISTINCT c.name) AS cuisines,
        ROUND((similarCount * 100) / 50.0) AS score,
        CASE 
          WHEN similarCount >= 30 THEN 'Highly recommended - many similar customers ordered here'
          WHEN similarCount >= 15 THEN 'Recommended - similar customers enjoyed this'
          ELSE 'You might like this - based on similar tastes'
        END AS reason
    
    ORDER BY score DESC
    LIMIT $limit
  `,

  // Get similar customers to target customer
  getSimilarCustomers: `
    MATCH (target:Customer {id: $customerId})
          -[:PLACED]->(:Order)
          -[:CONTAINS]->(d:Dish)
    
    MATCH (similar:Customer)
          -[:PLACED]->(:Order)
          -[:CONTAINS]->(d)
    
    WHERE target <> similar
    
    RETURN
        similar.id AS id,
        similar.name AS name,
        similar.email AS email,
        COUNT(DISTINCT d) AS commonDishes
    
    ORDER BY commonDishes DESC
    LIMIT $limit
  `,

  // Count recommendations
  countRecommendations: `
    MATCH (target:Customer {id: $customerId})
          -[:PLACED]->(:Order)
          -[:CONTAINS]->(d:Dish)
    
    MATCH (similar:Customer)
          -[:PLACED]->(:Order)
          -[:CONTAINS]->(d)
    
    MATCH (similar)
          -[:PLACED]->(:Order)
          -[:CONTAINS]->(recommended:Dish)
    
    MATCH (restaurant:Restaurant)
          -[:SERVES]->(recommended)
    
    WHERE target <> similar
    
    RETURN COUNT(DISTINCT restaurant) AS total
  `,

  // Fallback: Get top-rated restaurants when no personalized recommendations available
  getFallbackRecommendations: `
    MATCH (r:Restaurant)
    OPTIONAL MATCH (r)-[:HAS_CUISINE]->(c:Cuisine)
    OPTIONAL MATCH (r)-[:LOCATED_IN]->(a:Area)
    
    RETURN
        r.id AS id,
        r.name AS name,
        r.rating AS rating,
        r.description AS description,
        r.address AS address,
        COLLECT(DISTINCT c.name) AS cuisines,
        COLLECT(DISTINCT a.name) AS areas,
        0 AS similarCustomers,
        0 AS matchingDishes,
        r.rating AS recommendationScore
    
    ORDER BY r.rating DESC
    LIMIT $limit
  `
};

export default recommendationQueries;
