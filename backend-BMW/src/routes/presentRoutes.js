const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Get all presents
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM presents ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single present
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM presents WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Present not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new present
router.post('/', async (req, res) => {
  const { title, description, price, category, image } = req.body;
  try {
    const result = await query(
      'INSERT INTO presents (title, description, price, category, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, price, category, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a present
router.put('/:id', async (req, res) => {
  const { title, description, price, category, image, is_selected } = req.body;
  try {
    const result = await query(
      'UPDATE presents SET title = $1, description = $2, price = $3, category = $4, image = $5, is_selected = $6 WHERE id = $7 RETURNING *',
      [title, description, price, category, image, is_selected, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Present not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a present
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM presents WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Present not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 