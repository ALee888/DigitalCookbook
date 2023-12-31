-- @block
CREATE DATABASE cookbook;
USE cookbook;
-- @block
CREATE TABLE recipes(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description text,
    instructions text,
    image BLOB,
    category_id INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- @block 
CREATE TABLE ingredients(
    recipe_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity VARCHAR(255),
    measurement VARCHAR(255)
);
-- @block
--Old recipe_ingredients
CREATE TABLE Recipe_ingredients(
    FOREIGN KEY (recipe_id) REFERENCES Recipes(id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredients(id)
);
-- @block
INSERT INTO ingredients (name)
VALUES ('salt'),
    ('pepper'),
    ('cumin'),
    ('paprika') -- @block
INSERT INTO Recipes (name, description)
VALUES (
        'Steak',
        'Season steak, sear both sides, baste with butter'
    ) -- @block
INSERT INTO Recipe_ingredients (recipe_id, ingredient_id, quantity)
VALUES (
        (
            select id
            from recipes
            where name = 'steak'
        ),
        (
            select id
            from ingredients
            where name = 'paprika'
        ),
        '1 tsp'
    ) -- @block
    -- Display a recipe
SELECT recipes.id AS recipe_id,
    recipes.name AS recipe_name,
    Rooms.id AS room_id,
    FROM Users
    INNER JOIN Rooms ON Rooms.owner_id = Users.id;
-- @block
CREATE TABLE users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);
-- @block
CREATE TABLE users_recipes(
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);
-- @block
INSERT INTO users(username, email, password)
VALUES ('Alee', 'somthing@gmail', 'Coma'),
    ('mia', 'mia@gmail', 'Bofa2');
-- @block
INSERT INTO users_recipes(user_id, recipe_id)
VALUES (1, 8);
-- @block
SELECT *
FROM recipes
WHERE id = (
        SELECT recipe_id
        FROM users_recipes
        WHERE user_id = 1
    );
-- @block
use cookbook;
drop table Recipes;
drop table ingredients;
-- @block
-- CLEAR USER DATABASE
use cookbook;
drop table users_recipes;
drop table users;