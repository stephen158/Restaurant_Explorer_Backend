import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const driver = neo4j.driver(
  process.env.COGNODB_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.COGNODB_USERNAME || 'neo4j',
    process.env.COGNODB_PASSWORD || 'password'
  )
);

const session = driver.session();

// Data templates
const restaurants = [
  { name: 'Maharaja Palace', cuisine: ['North Indian', 'Mughlai'], area: 'Downtown', rating: 4.8, desc: 'Premium North Indian cuisine' },
  { name: 'Spice Route', cuisine: ['South Indian', 'Coastal'], area: 'Marina', rating: 4.6, desc: 'Authentic South Indian flavors' },
  { name: 'Biryani House', cuisine: ['Biryani', 'Hyderabadi'], area: 'Downtown', rating: 4.7, desc: 'Specialty biryani restaurant' },
  { name: 'Curry Corner', cuisine: ['North Indian', 'Punjabi'], area: 'Uptown', rating: 4.5, desc: 'Traditional Punjabi recipes' },
  { name: 'Tandoor Express', cuisine: ['Tandoori', 'Kebabs'], area: 'Midtown', rating: 4.4, desc: 'Tandoori specialties' },
  { name: 'Dosa King', cuisine: ['South Indian', 'Breakfast'], area: 'Marina', rating: 4.7, desc: 'Traditional dosas and idlis' },
  { name: 'Thali Bazaar', cuisine: ['Multi-Cuisine', 'Indian'], area: 'Downtown', rating: 4.3, desc: 'Complete meal sets' },
  { name: 'Kebab Paradise', cuisine: ['Kebabs', 'Mughlai'], area: 'Uptown', rating: 4.5, desc: 'Grilled kebabs and more' },
  { name: 'Coastal Kitchen', cuisine: ['Seafood', 'Coastal'], area: 'Marina', rating: 4.6, desc: 'Fresh seafood preparations' },
  { name: 'Masala Kitchen', cuisine: ['North Indian', 'Punjabi'], area: 'Midtown', rating: 4.4, desc: 'Homestyle Indian cooking' },
  { name: 'Hyderabad Express', cuisine: ['Biryani', 'Telangana'], area: 'Downtown', rating: 4.7, desc: 'Authentic Hyderabadi biryani' },
  { name: 'Kerala House', cuisine: ['South Indian', 'Coastal'], area: 'Marina', rating: 4.5, desc: 'Kerala backwater cuisine' },
  { name: 'Paneer Paradise', cuisine: ['Vegetarian', 'North Indian'], area: 'Uptown', rating: 4.6, desc: 'Paneer specialties' },
  { name: 'Samosa Cafe', cuisine: ['Street Food', 'Snacks'], area: 'Midtown', rating: 4.2, desc: 'Quick bites and snacks' },
  { name: 'Butter Chicken House', cuisine: ['North Indian', 'Mughlai'], area: 'Downtown', rating: 4.8, desc: 'Famous for butter chicken' },
  { name: 'Chaat House', cuisine: ['Street Food', 'Snacks'], area: 'Downtown', rating: 4.3, desc: 'Indian street food' },
  { name: 'Momos Master', cuisine: ['Asian Fusion', 'Street Food'], area: 'Uptown', rating: 4.4, desc: 'Momos and Asian street food' },
  { name: 'Pav Bhaji King', cuisine: ['Street Food', 'Snacks'], area: 'Midtown', rating: 4.2, desc: 'Mumbai street food' },
  { name: 'Bengali Kitchen', cuisine: ['East Indian', 'Bengali'], area: 'Marina', rating: 4.4, desc: 'Bengali cuisine' },
  { name: 'Rajasthani Haveli', cuisine: ['Rajasthani', 'North Indian'], area: 'Downtown', rating: 4.5, desc: 'Desert cuisine' },
  { name: 'Goan Paradise', cuisine: ['Coastal', 'Seafood'], area: 'Marina', rating: 4.6, desc: 'Goan specialties' },
  { name: 'Punjab Junction', cuisine: ['Punjabi', 'North Indian'], area: 'Uptown', rating: 4.4, desc: 'Authentic Punjabi food' },
  { name: 'Dhaba Express', cuisine: ['Punjabi', 'North Indian'], area: 'Midtown', rating: 4.3, desc: 'Rustic Indian cooking' },
  { name: 'Andhra Spice', cuisine: ['South Indian', 'Andhra'], area: 'Downtown', rating: 4.5, desc: 'Andhra cuisine' },
  { name: 'Vegetarian Heaven', cuisine: ['Vegetarian', 'Multi-Cuisine'], area: 'Marina', rating: 4.6, desc: 'Pure vegetarian cuisine' }
];

const cuisines = ['North Indian', 'South Indian', 'Mughlai', 'Punjabi', 'Tandoori', 'Biryani', 'Hyderabadi', 'Breakfast', 'Multi-Cuisine', 'Kebabs', 'Seafood', 'Coastal', 'Vegetarian', 'Street Food', 'Snacks', 'Telangana', 'Asian Fusion', 'Bengali', 'Rajasthani', 'East Indian', 'Goan', 'Andhra'];

const areas = [
  { name: 'Downtown', city: 'Metro City' },
  { name: 'Uptown', city: 'Metro City' },
  { name: 'Midtown', city: 'Metro City' },
  { name: 'Marina', city: 'Coastal Area' },
  { name: 'Airport Road', city: 'Metro City' },
  { name: 'Business District', city: 'Metro City' },
  { name: 'Suburbs', city: 'Outer Metro' },
  { name: 'Harbor', city: 'Coastal Area' },
  { name: 'Arts District', city: 'Metro City' },
  { name: 'Tech Park', city: 'Metro City' }
];

const dishes = [
  { name: 'Butter Chicken', price: 15.99, category: 'Main Course', desc: 'Creamy tomato-based chicken curry' },
  { name: 'Biryani (Chicken)', price: 12.99, category: 'Main Course', desc: 'Fragrant rice with chicken and spices' },
  { name: 'Paneer Tikka', price: 11.99, category: 'Appetizer', desc: 'Grilled paneer with spices' },
  { name: 'Naan', price: 3.99, category: 'Bread', desc: 'Traditional Indian bread' },
  { name: 'Masala Dosa', price: 8.99, category: 'Main Course', desc: 'Rice crepe with potato filling' },
  { name: 'Samosa', price: 4.99, category: 'Appetizer', desc: 'Fried pastry with spiced filling' },
  { name: 'Tandoori Chicken', price: 13.99, category: 'Main Course', desc: 'Spiced grilled chicken' },
  { name: 'Idli', price: 5.99, category: 'Breakfast', desc: 'Steamed rice cake' },
  { name: 'Chaat', price: 6.99, category: 'Snacks', desc: 'Indian street food preparation' },
  { name: 'Dal Makhani', price: 10.99, category: 'Main Course', desc: 'Creamy lentil curry' },
  { name: 'Chicken Tikka Masala', price: 14.99, category: 'Main Course', desc: 'Tomato cream sauce with chicken' },
  { name: 'Biryani (Mutton)', price: 13.99, category: 'Main Course', desc: 'Lamb biryani with basmati rice' },
  { name: 'Rogan Josh', price: 14.99, category: 'Main Course', desc: 'Aromatic meat curry' },
  { name: 'Chole Bhature', price: 9.99, category: 'Main Course', desc: 'Chickpeas with fried bread' },
  { name: 'Fish Curry', price: 15.99, category: 'Main Course', desc: 'Traditional fish in spice sauce' },
  { name: 'Prawn Biryani', price: 16.99, category: 'Main Course', desc: 'Biryani with fresh prawns' },
  { name: 'Kebab', price: 11.99, category: 'Appetizer', desc: 'Grilled meat skewers' },
  { name: 'Pakora', price: 6.99, category: 'Appetizer', desc: 'Fried vegetable fritters' },
  { name: 'Raita', price: 2.99, category: 'Side', desc: 'Yogurt-based condiment' },
  { name: 'Pav Bhaji', price: 7.99, category: 'Snacks', desc: 'Spiced bread with vegetables' },
  { name: 'Dosa', price: 7.99, category: 'Main Course', desc: 'Crispy rice crepe' },
  { name: 'Biryani (Vegetarian)', price: 10.99, category: 'Main Course', desc: 'Vegetable biryani' },
  { name: 'Korma', price: 12.99, category: 'Main Course', desc: 'Mild cream curry' },
  { name: 'Nihari', price: 13.99, category: 'Main Course', desc: 'Slow-cooked meat stew' },
  { name: 'Momos', price: 6.99, category: 'Snacks', desc: 'Steamed dumpling' },
  { name: 'Lassie', price: 3.99, category: 'Beverage', desc: 'Yogurt drink' },
  { name: 'Mango Lassi', price: 4.99, category: 'Beverage', desc: 'Mango yogurt drink' },
  { name: 'Gulab Jamun', price: 5.99, category: 'Dessert', desc: 'Sweet fried dumplings' },
  { name: 'Kheer', price: 4.99, category: 'Dessert', desc: 'Rice pudding' },
  { name: 'Jalebi', price: 3.99, category: 'Dessert', desc: 'Crispy sweet spirals' },
  { name: 'Biryani (Egg)', price: 11.99, category: 'Main Course', desc: 'Egg biryani with fragrant rice' },
  { name: 'Haleem', price: 12.99, category: 'Main Course', desc: 'Meat and lentil stew' },
  { name: 'Dum Aloo', price: 9.99, category: 'Main Course', desc: 'Spiced potato curry' }
];

const categories = ['Main Course', 'Appetizer', 'Bread', 'Breakfast', 'Snacks', 'Side', 'Beverage', 'Dessert'];

function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

function generateCustomerName() {
  const firstNames = ['Rajesh', 'Priya', 'Arjun', 'Neha', 'Vikram', 'Anjali', 'Rohit', 'Deepika', 'Sanjay', 'Ritika', 'Arun', 'Pooja', 'Nikhil', 'Divya', 'Karthik'];
  const lastNames = ['Sharma', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Iyer', 'Gupta', 'Nair', 'Bhat', 'Chopra'];
  return firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)];
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await session.run(`
      MATCH (n) DETACH DELETE n
    `);

    // Create areas
    console.log('📍 Creating areas...');
    for (const area of areas) {
      await session.run(
        `CREATE (a:Area {id: $id, name: $name, city: $city})`,
        { id: generateId(), name: area.name, city: area.city }
      );
    }

    // Create cuisines
    console.log('🍛 Creating cuisines...');
    for (const cuisine of cuisines) {
      await session.run(
        `CREATE (c:Cuisine {id: $id, name: $name})`,
        { id: generateId(), name: cuisine }
      );
    }

    // Create categories
    console.log('📂 Creating categories...');
    for (const category of categories) {
      await session.run(
        `CREATE (cat:Category {id: $id, name: $name})`,
        { id: generateId(), name: category }
      );
    }

    // Create dishes
    console.log('🍽️  Creating dishes...');
    const dishMap = {};
    for (const dish of dishes) {
      const id = generateId();
      dishMap[dish.name] = id;
      await session.run(
        `CREATE (d:Dish {id: $id, name: $name, price: $price, description: $description})`,
        { id, name: dish.name, price: dish.price, description: dish.desc }
      );
      // Link dish to category
      await session.run(
        `MATCH (d:Dish {id: $dishId}), (cat:Category {name: $categoryName})
         CREATE (d)-[:BELONGS_TO]->(cat)`,
        { dishId: id, categoryName: dish.category }
      );
    }

    // Create restaurants
    console.log('🏪 Creating restaurants...');
    const restaurantMap = {};
    for (const rest of restaurants) {
      const id = generateId();
      restaurantMap[rest.name] = id;
      await session.run(
        `CREATE (r:Restaurant {id: $id, name: $name, description: $description, rating: $rating, address: $address})`,
        {
          id,
          name: rest.name,
          description: rest.desc,
          rating: rest.rating,
          address: `${Math.floor(Math.random() * 1000)} ${rest.name} Street, ${rest.area}`
        }
      );
      // Link to area
      await session.run(
        `MATCH (r:Restaurant {id: $restaurantId}), (a:Area {name: $areaName})
         CREATE (r)-[:LOCATED_IN]->(a)`,
        { restaurantId: id, areaName: rest.area }
      );
      // Link to cuisines
      for (const cuisine of rest.cuisine) {
        await session.run(
          `MATCH (r:Restaurant {id: $restaurantId}), (c:Cuisine {name: $cuisineName})
           CREATE (r)-[:HAS_CUISINE]->(c)`,
          { restaurantId: id, cuisineName: cuisine }
        );
      }
      // Link to some dishes
      const restaurantDishes = dishes.filter(d => Math.random() > 0.5).slice(0, 15);
      for (const dish of restaurantDishes) {
        await session.run(
          `MATCH (r:Restaurant {id: $restaurantId}), (d:Dish {name: $dishName})
           CREATE (r)-[:SERVES]->(d)`,
          { restaurantId: id, dishName: dish.name }
        );
      }
    }

    // Create customers
    console.log('👥 Creating customers...');
    const customerMap = {};
    for (let i = 0; i < 150; i++) {
      const id = generateId();
      const name = generateCustomerName();
      const email = name.toLowerCase().replace(/\s+/g, '.') + '@email.com';
      const phone = '+91' + Math.floor(Math.random() * 9000000000 + 1000000000);

      customerMap[id] = { name, email };

      await session.run(
        `CREATE (c:Customer {id: $id, name: $name, email: $email, phone: $phone})`,
        { id, name, email, phone }
      );

      // Link customer to a random area
      const areaName = areas[Math.floor(Math.random() * areas.length)].name;
      await session.run(
        `MATCH (c:Customer {id: $customerId}), (a:Area {name: $areaName})
         CREATE (c)-[:LIVES_IN]->(a)`,
        { customerId: id, areaName }
      );

      // Link customer to random cuisines
      const numCuisines = Math.floor(Math.random() * 4) + 2;
      const preferredCuisines = cuisines.sort(() => Math.random() - 0.5).slice(0, numCuisines);
      for (const cuisine of preferredCuisines) {
        await session.run(
          `MATCH (c:Customer {id: $customerId}), (cu:Cuisine {name: $cuisineName})
           CREATE (c)-[:LIKES]->(cu)`,
          { customerId: id, cuisineName: cuisine }
        );
      }
    }

    // Create orders and order-dish relationships
    console.log('📦 Creating orders and relationships...');
    const customerIds = Object.keys(customerMap);
    for (let i = 0; i < 400; i++) {
      const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];
      const orderId = generateId();
      const orderDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString();
      const numDishes = Math.floor(Math.random() * 4) + 1;
      let totalAmount = 0;

      // Create order
      await session.run(
        `MATCH (c:Customer {id: $customerId})
         CREATE (c)-[:PLACED]->(o:Order {id: $orderId, orderDate: $orderDate, status: $status})
         RETURN o`,
        {
          customerId,
          orderId,
          orderDate,
          status: ['completed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)]
        }
      );

      // Add dishes to order
      const selectedDishes = dishes.sort(() => Math.random() - 0.5).slice(0, numDishes);
      for (const dish of selectedDishes) {
        const quantity = Math.floor(Math.random() * 3) + 1;
        totalAmount += dish.price * quantity;

        await session.run(
          `MATCH (o:Order {id: $orderId}), (d:Dish {name: $dishName})
           CREATE (o)-[:CONTAINS {quantity: $quantity}]->(d)`,
          { orderId, dishName: dish.name, quantity }
        );
      }

      // Update order with total amount
      await session.run(
        `MATCH (o:Order {id: $orderId})
         SET o.totalAmount = $totalAmount`,
        { orderId, totalAmount }
      );
    }

    console.log('✅ Database seeded successfully!');
    console.log(`   - 25 restaurants created`);
    console.log(`   - 150 customers created`);
    console.log(`   - 33 dishes created`);
    console.log(`   - 8 categories created`);
    console.log(`   - 22 cuisines created`);
    console.log(`   - 10 areas created`);
    console.log(`   - 400+ orders created`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run seeding
seedDatabase().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
