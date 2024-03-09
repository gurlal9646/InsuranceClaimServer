require("dotenv").config();

const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header

  if (req.url.includes('/login') || req.url.includes('/signup')) {
    // If it's the login path, skip token verification and proceed to the next middleware
    return next();
  }

  let token = req.headers["x-access-token"] || req.headers["authorization"];

  // If a token is found, remove 'Bearer ' if it's present

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  // If there is no token, return an error

  if (!token) {
    return res.status(403).json({
      success: false,

      message: "A token is required for authentication",
    });
  }

  // Try to verify the token

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Add the decoded token to the request object
  } catch (err) {
    return res.status(401).json({
      success: false,

      message: "Invalid token",
    });
  }

  return next(); // Proceed to the next middleware or route handler
};

module.exports = verifyToken;
