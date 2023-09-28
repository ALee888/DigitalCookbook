const express = require('express');
const dbConnection = require('./db.js');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail, validatePassword, hashPassword } = require('./userController.js');

// const authController = require('./controllers/auth')
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
    const id = req.query.id
    // Insert the new recipe into the database
    const query = 'DELETE FROM `recipes` WHERE `id`= ?';
    dbConnection.query(query, [id], (err, result) => {
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

/*
USERS
*/
// Get User information
app.get('/users', (req, res) => {
    const id = req.query.id;

    if (id) {
        const query = 'SELECT * FROM USERS WHERE `id` = ?';
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
        const query = 'SELECT * FROM USERS';
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
// Delete a User
app.delete('/users', (req, res) => {
    const id = req.query.id
    // TODO: Authenitcate User

    // Insert the new recipe into the database
    const query = 'DELETE FROM users WHERE id= ?';
    dbConnection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error creating the recipe:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            // The 'result.insertId' contains the ID of the newly inserted recipe
            res.status(201).json({ message: 'Recipe deleted successfully', recipeId: result.insertId });
        }
    });

})
// Get all recipes from specific user
app.get('/users-recipes', (req, res) => {
    const id = req.query.id;

    const query = "SELECT * FROM recipes WHERE id = (SELECT recipe_id FROM users_recipes WHERE user_id = ?)";
    dbConnection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(200).json({ result });
        }
    })
});

// Link a user and recipe
app.post('/users-recipes', (req, res) => {
    const { userId, recipeId } = req.body;

    // Validate required fields
    if (!userId || !recipeId) {
        return res.status(400).json({ message: 'Please provide the id of a user and recipe' });
    }

    // Insert the new recipe into the database
    const recipeQuery = `INSERT INTO users_recipes(user_id, recipe_id) VALUES (?, ?);`;
    dbConnection.query(recipeQuery, [userId, recipeId], (err, result) => {
        if (err) {
            console.error('Error creating the recipe:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(201).json({ message: 'Recipe saved successfully: ' + result });
        }
    });
});

// Verify user credentials
app.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        
        const query = 'SELECT * FROM users WHERE email = ?';
        
        try {
            const match = await bcrypt.compare(password, user.password);   
            console.log(match);
            if (!user || !match) {
                return res.status(401).json({ message: 'Invalid credentials'});
            }   
        } catch (error) {
            throw new Error('Password validation failed');
        }
            
        const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
        res.json({ token });
            
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new user
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    // Check if the user already exists
    const userExistsQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
    dbConnection.query(userExistsQuery, [email], (err, result) => {
        if (err) {
            console.error('Error checking if user exists', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        } else {
            const userExists = result[0].count > 0;
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }
        }
    });
    
    // Hash the password
    //const hashedPassword = hashPassword(password);
    var hashedPass = password;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        hashedPass = hashedPassword
    } catch (error) {
        throw new Error('Password hashing failed');
    }
    
    // Insert the user into the database
    const createUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    dbConnection.query(createUserQuery, [username, email, hashedPass], (err, result) => {
        if (err) {
            console.error('Error checking if user exists', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        } else {
            console.log('User registered successfully');
        }
    });
    
    // Get the newly created user
    const getUserQuery = 'SELECT * FROM users WHERE email = ?';
    dbConnection.query(getUserQuery, [email], (err, result) => {
        if (err) {
            console.error('Error getting newly created user', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        } else {
            const user = result[0];
            // Create JWT token
            const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
            return res.json({ token });    
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})