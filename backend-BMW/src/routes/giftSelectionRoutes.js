const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Get all selections
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT gs.*, p.title as present_title, p.description as present_description, 
             p.price as present_price, p.category as present_category, p.image as present_image
      FROM gift_selections gs
      JOIN presents p ON gs.present_id = p.id
      ORDER BY gs.selection_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new selection
router.post('/', async (req, res) => {
  const { present_id, name, email } = req.body;
  try {
    // Verifica se o presente existe
    const presentResult = await query('SELECT * FROM presents WHERE id = $1', [present_id]);
    if (presentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Present not found' });
    }

    // Verifica se o presente já foi selecionado
    const selectionResult = await query('SELECT * FROM gift_selections WHERE present_id = $1', [present_id]);
    if (selectionResult.rows.length > 0) {
      return res.status(400).json({ error: 'This present has already been selected' });
    }

    // Cria a seleção
    const result = await query(
      'INSERT INTO gift_selections (present_id, name, email) VALUES ($1, $2, $3) RETURNING *',
      [present_id, name, email]
    );

    // Atualiza o status do presente
    await query('UPDATE presents SET is_selected = true WHERE id = $1', [present_id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get selections by email
router.get('/email/:email', async (req, res) => {
  try {
    const result = await query(`
      SELECT gs.*, p.title as present_title, p.description as present_description, 
             p.price as present_price, p.category as present_category, p.image as present_image
      FROM gift_selections gs
      JOIN presents p ON gs.present_id = p.id
      WHERE gs.email = $1
      ORDER BY gs.selection_date DESC
    `, [req.params.email]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 