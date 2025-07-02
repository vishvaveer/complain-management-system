const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // ssl: {
    //     rejectUnauthorized: false // Use this if you're having SSL issues locally or with services like Render (for development only)
    //     sslmode=disable  // Disable SSL for local development; remove or set to 'require' in production
    // }
    ssl : process.env.DB_SSL ? {
        rejectUnauthorized: false // Adjust based on your environment; true for production, false for local development
    } : false // Disable SSL if not set in .env
});

// Function to test the connection (optional, but good practice)
const connectDB = async () => {
    try {
        await pool.connect();
        console.log('PostgreSQL Database connected successfully!');
    } catch (err) {
        console.error('PostgreSQL connection error:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params), // Export a query method for direct queries
    pool, // Export the pool itself if you need direct client access
    connectDB // Export the connection function
};