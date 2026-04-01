const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Public home page data
router.get('/dashboard', async (req, res, next) => {
  try {
    // Get summary data from all applications
    const [materialStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_materials,
        SUM(jumlah_roll) as total_rolls,
        COUNT(DISTINCT kategori_id) as total_categories
      FROM material_stock
    `);

    const [spkStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_spk,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as spk_this_month
      FROM material_spk
    `);

    const [labelStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_labels,
        SUM(jumlah_roll) as total_label_rolls
      FROM stok_label
    `);

    const [lpsStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_lps,
        COUNT(CASE WHEN status = 'finish' THEN 1 END) as finished_lps,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as lps_this_month
      FROM lps
    `);

    // Recent activities
    const [recentSpk] = await pool.execute(`
      SELECT no_spk, part_number, nama_item, customer, created_at
      FROM material_spk 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const [recentLps] = await pool.execute(`
      SELECT no_lps, nama_item, customer, status, created_at
      FROM lps 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    res.json({
      stats: {
        material: materialStats[0],
        spk: spkStats[0],
        label: labelStats[0],
        lps: lpsStats[0]
      },
      recent: {
        spk: recentSpk,
        lps: recentLps
      }
    });
  } catch (error) {
    next(error);
  }
});

// Public API for getting label data (used by other apps)
router.get('/labels', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT part_number, nama_item, ukuran, finishing, isi, jumlah_roll
      FROM stok_label
      ORDER BY nama_item
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Public API for getting material categories
router.get('/material-categories', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, name
      FROM material_categories
      ORDER BY name
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;