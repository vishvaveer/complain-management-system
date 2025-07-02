const express = require('express');
const app = express();
const path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const complaintsRoutes = require("./routes/complaints");
const jwt = require("jsonwebtoken");

app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware for parsing JSON bodies (if needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'frontend' directory
// app.use(express.static(path.join(__dirname, 'frontend')));

// Route to serve your index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});
 

// --- START: CHANGES FOR DATABASE CONNECTION AND BEST PRACTICES ---
const { connectDB, query } = require("./config/db"); // IMPORTANT: Import connectDB and query
require('dotenv').config(); // Load environment variables from .env file

// Use environment variable for JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_fallback"; // Get from .env or use fallback
// --- END: CHANGES FOR DATABASE CONNECTION AND BEST PRACTICES ---



app.use(cors());
app.use(bodyParser.json());

// --- START: DATABASE CONNECTION CALL ---
// Call the connectDB function here to establish the database connection
// This should be done early in your application startup
connectDB();
// --- END: DATABASE CONNECTION CALL ---

app.use("/auth", authRoutes); // Assuming /auth is for login/signup

// Example: Basic test route to check DB connection (Good to have!)
// Ensure you have `query` exported from your db.js for this to work.
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await query('SELECT version()'); // Use the imported 'query' function
        res.json({ message: 'Database connected and queried successfully!', dbVersion: result.rows[0].version });
    } catch (error) {
        console.error('DB Test Error from /api/test-db:', error);
        res.status(500).json({ message: 'Failed to connect or query database', error: error.message });
    }
});


// JWT middleware
// Note: You have /auth for authRoutes, so the JWT middleware might not need to run on /auth routes.
// Your current logic already correctly bypasses paths not starting with /api/
app.use((req, res, next) => {
    // If the path starts with /api/, apply JWT verification
    if (req.path.startsWith("/api/")) {
        const auth = req.headers.authorization?.split(" ")[1]; // Get token from "Bearer <token>"
        if (!auth) {
            return res.status(401).json({ error: "Missing token" });
        }
        try {
            const payload = jwt.verify(auth, JWT_SECRET);
            req.userId = payload.id; // Assuming your JWT payload has 'id' as user ID
            next();
        } catch (error) { // Catch specific JWT errors for better debugging
            console.error("JWT Verification Error:", error.message);
            res.status(401).json({ error: "Invalid token" });
        }
    } else {
        next(); // For non-/api/ paths (like /auth, or static files)
    }
});

app.use("/api/complaints", complaintsRoutes); // This will be protected by the above JWT middleware

app.listen(3000, () => console.log("Server listening on port 3000"));