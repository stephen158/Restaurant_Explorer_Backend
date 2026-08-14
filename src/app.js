import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { closeConnection } from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

// Import routes
import healthRoutes from './routes/healthRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import graphRoutes from './routes/graphRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============
// Middleware
// ============

// CORS configuration
const corsOptions = {
  //  origin: process.env.FRONTEND_URL || ' https://restaurant-explorer-frontend-rose.vercel.app' ,
  origin:  'https://restaurant-explorer-frontend-rose.vercel.app' ,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============
// Routes
// ============

// Health check (no /api prefix)
app.use('/health', healthRoutes);

// API routes
app.use('/api/health', healthRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/customers', recommendationRoutes);
app.use('/api/graph', graphRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Restaurant Relationship & Recommendation Explorer - Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      dashboard: '/api/dashboard',
      restaurants: '/api/restaurants',
      customers: '/api/customers',
      recommendations: '/api/customers/:id/recommendations',
      graph: '/api/graph/customer/:id'
    }
  });
});

// ============
// Error Handling
// ============

// 404 Not Found middleware (must be after all routes)
app.use(notFound);

// Centralized error handler (must be last)
app.use(errorHandler);

// ============
// Server Startup
// ============

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🍽️  Restaurant Recommendation Explorer - Backend API     ║
║                                                            ║
║  🚀 Server running on: http://localhost:${PORT}          ║
║  📊 Database: CognoDB (Neo4j)                            ║
║  🔗 Bolt URI: ${process.env.COGNODB_URI || 'bolt://localhost:7687'} ║
║                                                            ║
║  API Endpoints:                                           ║
║  • GET /api/health                  - Health check        ║
║  • GET /api/dashboard               - Dashboard stats     ║
║  • GET /api/restaurants             - All restaurants     ║
║  • GET /api/customers               - All customers       ║
║  • GET /api/customers/:id/recommendations - Recommendations║
║  • GET /api/graph/customer/:id      - Graph explorer      ║
║                                                            ║
║  📖 Documentation:                                        ║
║  See README.md for full API documentation               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// ============
// Graceful Shutdown
// ============

/**
 * Handle graceful shutdown
 */
async function gracefulShutdown(signal) {
  console.log(`\n${signal} signal received: closing HTTP server`);
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    // Close database connection
    try {
      await closeConnection();
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
    
    console.log('Application shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

export default app;
