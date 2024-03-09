const bcrypt = require('bcrypt');
const saltRounds = 10; // You can adjust the number of salt rounds

async function encryptPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    throw err;
  }
}

async function comparePasswords(enteredPassword, storedHash) {
    try {
      const result = await bcrypt.compare(enteredPassword, storedHash);
      return result;
    } catch (err) {
      console.error('Error comparing passwords:', err);
      throw err;
    }
  }

module.exports = { encryptPassword ,comparePasswords};
