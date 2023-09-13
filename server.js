const express = require('express');
const dbConnection = require('./db.js');
const cors = require('cors');

const app = express();
const port = 4000

// Middleware
app.use(express.json());
app.use(cors());

// --- Routes ---
// Sample route to test the database connection
app.get('/', (req, res) => {
    dbConnection.query('SHOW TABLES in cookbook;', (err, result) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(200).json({ result });
        }
    });
});

/* 
Recipes

*/
// Get Recipe
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
                console.log(result);
                res.status(200).json({ result });
            }
        });
    }
});

// Create a new Recipe
app.post('/recipes', (req, res) => {
    const { name, description, instructions, ingredients } = req.body;

    // Validate required fields
    if (!name || !description || !instructions || !ingredients) {
        return res.status(400).json({ message: 'Please provide name, description, instructions, and ingredients' });
    }

    // Insert the new recipe into the database
    const recipeQuery = 'INSERT INTO recipes (name, description, instructions) VALUES (?, ?, ?)';
    dbConnection.query(recipeQuery, [name, description, instructions], (err, result) => {
        if (err) {
            console.error('Error creating the recipe:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            // ID of the newly inserted recipe
            const recipeId = result.insertId;
            
            // Insert ingredients into their db
            const ingredientsQuery = 'INSERT INTO ingredients (recipe_id, name, quantity, measurement) VALUES ?';
            const ingredientsData = ingredients.map(obj => [
                recipeId,
                obj.name,
                obj.quantity,
                obj.measurement
            ]);
            console.log(ingredientsData)
            dbConnection.query(ingredientsQuery, [ingredientsData], (err, result) => {
                if (err) {
                    console.error('Error inserting ingredients: ', err);
                    res.status(500).json({ message: 'Internal Server Error'});
                } else {
                    res.status(201).json({ message: 'Recipe created successfully', recipeId: result.insertId });
                }
            });
        }
    });
    // TODO: Insert into USERS_RECIPES
});

// Delete a Recipe
app.delete('/recipes', (req, res) => {
    const { name } = req.body;

    // Insert the new recipe into the database
    const query = 'DELETE FROM `recipes` WHERE `name`= ?';
    dbConnection.query(query, [name], (err, result) => {
        if (err) {
            console.error('Error creating the recipe:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            // The 'result.insertId' contains the ID of the newly inserted recipe
            res.status(201).json({ message: 'Recipe deleted successfully', recipeId: result.insertId });
        }
    });

})

/*
Ingredients
*/
// Get Ingredients via id
app.get('/ingredients', (req, res) => {
    const id = req.query.id;


    if (id) {
        const query = 'SELECT * FROM Ingredients WHERE `recipe_id` = ?';
        dbConnection.query(query, [id], (err, result) => {
            if (err) {
                console.error('Error connecting to the database:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json({ result });
            }
        })
    } else {
        // No search parameters
        const query = 'SELECT * FROM Ingredients';
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

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})