import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Neo4j driver
const driver = neo4j.driver(
  process.env.COGNODB_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.COGNODB_USERNAME || 'neo4j',
    process.env.COGNODB_PASSWORD || 'password'
  ),
  {
    maxConnectionPoolSize: 50,
    minConnectionPoolSize: 10,
    connectionTimeoutMs: 5000,
    maxTransactionRetryTime: 30000,
    logging: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      logger: (level, message) => console.log(`[${level}] ${message}`),
    },
  }
);

/**
 * Verify database connection
 * @returns {Promise<boolean>} - true if connected, false otherwise
 */
export async function verifyConnection() {
  try {
    const session = driver.session();
    const result = await session.run('RETURN 1');
    await session.close();
    return !!result;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}

/**
 * Execute a Cypher query
 * @param {string} query - The Cypher query
 * @param {object} params - Query parameters
 * @param {object} options - Session options
 * @returns {Promise<object>} - Query result
 */
export async function executeQuery(query, params = {}, options = {}) {
  const session = driver.session(options);
  try {
    const result = await session.run(query, params);
    return result;
  } finally {
    await session.close();
  }
}

/**
 * Execute a Cypher query and return records
 * @param {string} query - The Cypher query
 * @param {object} params - Query parameters
 * @returns {Promise<array>} - Array of records
 */
export async function executeQueryAndReturnRecords(query, params = {}) {
  const result = await executeQuery(query, params);
  return result.records.map((record) => record.toObject());
}

/**
 * Execute a Cypher query and return a single record
 * @param {string} query - The Cypher query
 * @param {object} params - Query parameters
 * @returns {Promise<object|null>} - Single record or null
 */
export async function executeQueryAndReturnSingle(query, params = {}) {
  const result = await executeQuery(query, params);
  if (result.records.length === 0) return null;
  return result.records[0].toObject();
}

/**
 * Close the database connection
 * @returns {Promise<void>}
 */
export async function closeConnection() {
  await driver.close();
  console.log('Database connection closed');
}

export default driver;
