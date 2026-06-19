const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shopez_secret_key_123_abc_xyz');

      // Check if Mock DB mode is active
      if (global.useMockDb) {
        const user = global.mockUsers.find(u => u._id === decoded.id);
        if (!user) {
          return res.status(401).json({ message: 'Not authorized, user not found in mock store' });
        }
        // Attach user clone without password
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        return next();
      }

      // MongoDB mode
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
