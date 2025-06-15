const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { query } = require('../config/database');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = result.rows[0];

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Create admin (protected route)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await query(
      'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get admin dashboard data (protected route)
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const presentsResult = await query('SELECT COUNT(*) as total FROM presents');
    const selectionsResult = await query('SELECT COUNT(*) as total FROM gift_selections');
    const selectedPresentsResult = await query('SELECT COUNT(*) as total FROM presents WHERE is_selected = true');

    res.json({
      totalPresents: parseInt(presentsResult.rows[0].total),
      totalSelections: parseInt(selectionsResult.rows[0].total),
      selectedPresents: parseInt(selectedPresentsResult.rows[0].total)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 