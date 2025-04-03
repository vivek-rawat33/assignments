const { Admin } = require("../db");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config");
// Middleware for handling auth
function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the asdmin DB. Check readme for the exact headers to be expected

  const token = req.headers.authorization;
  //Bearer token
  const words = token.split(" ");
  const jwtToken = words[1];
  try {
    const decodedValue = jwt.verify(jwtToken, jwt_secret);

    if (decodedValue.username) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = adminMiddleware;
