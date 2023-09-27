// userController.js
const dbConnection = require('./db'); // Implement this to connect to your database
const bcrypt = require('bcrypt');
dbConnection.connect();
const getUserByEmail1 = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    dbConnection.query(query, [email], (err, result) => {
        if (err) {
            console.error('Error getting user via email', err);
            return res.status(500).json({message: 'Internal Server Error'});
        } else {
            return result[0];
        }
    });
    dbConnection
};
const getUserByEmail = async (email) => {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await dbConnection.query(query, [email]);
      
      if (rows.length === 0) {
        console.log('User not found for email:', email);
        return null;  // No user found
      }
  
      return rows[0];
    } catch (error) {
      console.error('Error in getUserByEmail:', error);
      throw new Error('Database error');
    }
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