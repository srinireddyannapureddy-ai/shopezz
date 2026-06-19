const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'shopez_secret_key_123_abc_xyz', {
    expiresIn: '30d',
  });
};

// Helper to check passwords in mock mode (handles plain text & hashed)
const matchMockPassword = async (enteredPassword, storedPassword) => {
  if (enteredPassword === storedPassword) return true;
  try {
    return await bcrypt.compare(enteredPassword, storedPassword);
  } catch (e) {
    return false;
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const emailLower = email.toLowerCase();
      const userExists = global.mockUsers.some(u => u.email === emailLower);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password for consistency
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: `mock_user_${Date.now()}`,
        username,
        email: emailLower,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date()
      };

      global.mockUsers.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id)
      });
    }

    // --- MONGO DB MODE ---
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: 'user'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, registration failed', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const emailLower = email.toLowerCase();
      const user = global.mockUsers.find(u => u.email === emailLower);
      
      if (user && (await matchMockPassword(password, user.password))) {
        return res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // --- MONGO DB MODE ---
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, login failed' });
  }
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Specific check for default admin credentials
    if (email === 'admin@shopez.com' && password === 'admin123') {
      
      // --- MOCK DB MODE ---
      if (global.useMockDb) {
        let adminUser = global.mockUsers.find(u => u.email === 'admin@shopez.com');
        if (!adminUser) {
          adminUser = {
            _id: 'mock_admin_1',
            username: 'ShopEZ Admin',
            email: 'admin@shopez.com',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date()
          };
          global.mockUsers.push(adminUser);
        }
        return res.json({
          _id: adminUser._id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
          token: generateToken(adminUser._id)
        });
      }

      // --- MONGO DB MODE ---
      let adminUser = await User.findOne({ email: 'admin@shopez.com' });
      if (!adminUser) {
        adminUser = await User.create({
          username: 'ShopEZ Admin',
          email: 'admin@shopez.com',
          password: 'admin123',
          role: 'admin'
        });
      }

      return res.json({
        _id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
        token: generateToken(adminUser._id)
      });
    }

    // Fallback search in db (either mock or mongo)
    if (global.useMockDb) {
      const user = global.mockUsers.find(u => u.email === email.toLowerCase());
      if (user && user.role === 'admin' && (await matchMockPassword(password, user.password))) {
        return res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        });
      }
    } else {
      const user = await User.findOne({ email });
      if (user && user.role === 'admin' && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        });
      }
    }

    res.status(401).json({ message: 'Invalid admin email or password' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, admin login failed' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin
};
