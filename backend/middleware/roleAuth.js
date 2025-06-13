module.exports = function(allowedRoles = []) {
  return function(req, res, next) {
    // Check if user info is present
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
}; 