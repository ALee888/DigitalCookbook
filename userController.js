// userController.js
const dbConnection = require('./db'); // Implement this to connect to your database
const bcrypt = require('bcrypt');

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const validatePassword = async (password, hashedPassword) => {
    // Implement password validation logic, e.g., using bcrypt
    // Compare the hashedPassword with the provided password
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Password validation failed');
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