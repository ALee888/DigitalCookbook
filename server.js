const express = require('express');
const dbConnection = require('./db.js');

const app = express();
const port = 3000

// Middleware
app.use(express.json());

// --- Routes ---
// Sample route to test the database connection
app.get('/', (req, res) => {
    dbConnection.query('SELECT 1 + 1 AS result', (err, rows) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            const result = rows[0].result;
            res.status(200).json({ result });
        }
    });
});

// Get Recipes
app.get('/recipes', (req, res) => {
    const { name } = req.body;
    
    if (name) {
        res.status(400).json({message: 'Search query'});
    } else {
        // No search parameters
        const query = 'SELECT * FROM RECIPES';
        dbConnection.query(query, (err, result) => {
            if (err) {
                console.error('Error connecting to the database:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json({ result });
            }
        });
    }
});

// Create a new Recipe
app.post('/recipes', (req, res) => {
    const { name, description, ingredients } = req.body;

    // Validate required fields
    if (!name || !description || !ingredients) {
        return res.status(400).json({ message: 'Please provide name, description, and ingredients' });
    }

    // Insert the new recipe into the database
    const query = 'INSERT INTO recipes (name, description) VALUES (?, ?)';
    dbConnection.query(query, [name, description], (err, result) => {
        if (err) {
            console.error('Error creating the recipe:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            // The 'result.insertId' contains the ID of the newly inserted recipe
            res.status(201).json({ message: 'Recipe created successfully', recipeId: result.insertId });
        }
    });

    
});

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})