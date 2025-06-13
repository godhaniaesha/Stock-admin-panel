const jwt = require('jsonwebtoken');

// Replace with your actual secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = function(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // decoded should contain user info, including role
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};