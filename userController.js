// userController.js
const dbConnection = require('./db'); // Implement this to connect to your database
const bcrypt = require('bcrypt');
const util = require('util');


const getUserByEmail = async (email) => {
    try {
        const sqlQuery = 'SELECT * FROM users WHERE email = ?';
        const query = util.promisify(dbConnection.query).bind(dbConnection);
        const result = await query(sqlQuery, [email]);
        
        if (result.length === 0) {
            console.log('User not found for email: ', email);
            return null;
        }

        return result[0]
    } catch (error) {
        console.error('Error in getUserByEmail: ', error);
        throw new Error('Database error');
    }
};

const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Password hashing failed');
    }
};

module.exports = { getUserByEmail, validatePassword, hashPassword };