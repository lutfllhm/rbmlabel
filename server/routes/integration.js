const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get full flow: SPK → LPS → Stock Label
router.get('/flow/:spk_no', async (req, res) => {
  try {
    const { spk_no } = req.params;

    // Get SPK details
    const [spk] = await pool.execute(
      `SELECT s.*, m.nama_material, m.ukuran as material_ukuran, m.supplier,
              l.nama_item as label_nama, l.ukuran as label_ukuran
       FROM material_spk s
       LEFT JOIN material_stock m ON s.material_id = m.id
       LEFT JOIN material_label_list l ON s.label_id = l.id
       WHERE s.no_spk = ?`,
      [spk_no]
    );

    if (spk.length === 0) {
      return res.status(404).json({ error: 'SPK not found' });
    }

    // Get LPS related to this SPK
    const [lps] = await pool.execute(
      `SELECT * FROM lps WHERE no_spk = ? ORDER BY created_at DESC`,
      [spk_no]
    );

    // Get Stock Label Masuk related to this SPK
    const [stockMasuk] = await pool.execute(
      `SELECT * FROM stok_label_masuk WHERE no_spk = ? ORDER BY created_at DESC`,
      [spk_no]
    );

    // Get Stock Label Keluar for items from this SPK
    const [stockKeluar] = await pool.execute(
      `SELECT k.* FROM stok_label_keluar k
       INNER JOIN stok_label_masuk m ON k.part_number = m.part_number
       WHERE m.no_spk = ?
       ORDER BY k.created_at DESC`,
      [spk_no]
    );

    res.json({
      spk: spk[0],
      lps: lps,
      stock_masuk: stockMasuk,
      stock_keluar: stockKeluar,
      flow_status: {
        spk_created: true,
        lps_created: lps.length > 0,
        lps_finished: lps.some(l => l.status === 'finish'),
        stock_received: stockMasuk.length > 0,
        stock_shipped: stockKeluar.length > 0
      }
    });
  } catch (error) {
    console.error('Error fetching flow:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get material usage tracking
router.get('/material/:material_id/usage', async (req, res) => {
  try {
    const { material_id } = req.params;

    // Get material details
    const [material] = await pool.execute(
      `SELECT m.*, c.name as kategori_nama
       FROM material_stock m
       LEFT JOIN material_categories c ON m.kategori_id = c.id
       WHERE m.id = ?`,
      [material_id]
    );

    if (material.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Get SPKs using this material
    const [spks] = await pool.execute(
      `SELECT * FROM material_spk WHERE material_id = ? ORDER BY created_at DESC`,
      [material_id]
    );

    // Get LPS from those SPKs
    const spkNumbers = spks.map(s => s.no_spk);
    let lpsData = [];
    if (spkNumbers.length > 0) {
      const placeholders = spkNumbers.map(() => '?').join(',');
      const [lps] = await pool.execute(
        `SELECT * FROM lps WHERE no_spk IN (${placeholders}) ORDER BY created_at DESC`,
        spkNumbers
      );
      lpsData = lps;
    }

    // Calculate usage statistics
    const totalSpk = spks.length;
    const totalLps = lpsData.length;
    const finishedLps = lpsData.filter(l => l.status === 'finish').length;
    const totalProduced = lpsData.reduce((sum, l) => sum + (l.jumlah_pcs || 0), 0);

    res.json({
      material: material[0],
      spks: spks,
      lps: lpsData,
      statistics: {
        total_spk: totalSpk,
        total_lps: totalLps,
        finished_lps: finishedLps,
        pending_lps: totalLps - finishedLps,
        total_produced_pcs: totalProduced
      }
    });
  } catch (error) {
    console.error('Error fetching material usage:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get integrated dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    // Material stats
    const [materialStats] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT id) as total_materials,
        SUM(jumlah_roll) as total_rolls,
        COUNT(DISTINCT kategori_id) as total_categories
      FROM material_stock
    `);

    // SPK stats
    const [spkStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_spk,
        COUNT(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE()) 
              AND YEAR(created_at) = YEAR(CURRENT_DATE()) THEN 1 END) as spk_this_month
      FROM material_spk
    `);

    // LPS stats
    const [lpsStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_lps,
        COUNT(CASE WHEN status = 'finish' THEN 1 END) as finished_lps,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_lps,
        COUNT(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE()) 
              AND YEAR(created_at) = YEAR(CURRENT_DATE()) THEN 1 END) as lps_this_month
      FROM lps
    `);

    // Stock Label stats
    const [stockStats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM stok_label) as total_labels,
        (SELECT SUM(jumlah_roll) FROM stok_label) as total_label_rolls,
        (SELECT COUNT(*) FROM stok_label_masuk 
         WHERE MONTH(tanggal) = MONTH(CURRENT_DATE()) 
         AND YEAR(tanggal) = YEAR(CURRENT_DATE())) as masuk_this_month,
        (SELECT COUNT(*) FROM stok_label_keluar 
         WHERE MONTH(tanggal) = MONTH(CURRENT_DATE()) 
         AND YEAR(tanggal) = YEAR(CURRENT_DATE())) as keluar_this_month
    `);

    // Integration flow stats
    const [flowStats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM material_spk WHERE no_spk IN (SELECT no_spk FROM lps)) as spk_with_lps,
        (SELECT COUNT(*) FROM lps WHERE no_lps IN (SELECT no_lps FROM stok_label_masuk)) as lps_in_stock,
        (SELECT COUNT(*) FROM material_spk WHERE no_spk NOT IN (SELECT DISTINCT no_spk FROM lps WHERE no_spk IS NOT NULL)) as spk_without_lps
    `);

    res.json({
      material: materialStats[0],
      spk: spkStats[0],
      lps: lpsStats[0],
      stock: stockStats[0],
      integration: flowStats[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get recent activities across all modules
router.get('/activities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const activities = [];

    // Recent SPKs
    const [recentSpk] = await pool.execute(
      `SELECT 'spk' as type, no_spk as reference, nama_item as description, 
              created_at as timestamp FROM material_spk 
       ORDER BY created_at DESC LIMIT ?`,
      [Math.floor(limit / 4)]
    );

    // Recent LPS
    const [recentLps] = await pool.execute(
      `SELECT 'lps' as type, no_lps as reference, nama_item as description, 
              status, created_at as timestamp FROM lps 
       ORDER BY created_at DESC LIMIT ?`,
      [Math.floor(limit / 4)]
    );

    // Recent Stock Masuk
    const [recentMasuk] = await pool.execute(
      `SELECT 'stock_masuk' as type, no_spk as reference, nama_item as description, 
              created_at as timestamp FROM stok_label_masuk 
       ORDER BY created_at DESC LIMIT ?`,
      [Math.floor(limit / 4)]
    );

    // Recent Stock Keluar
    const [recentKeluar] = await pool.execute(
      `SELECT 'stock_keluar' as type, part_number as reference, nama_item as description, 
              customer, created_at as timestamp FROM stok_label_keluar 
       ORDER BY created_at DESC LIMIT ?`,
      [Math.floor(limit / 4)]
    );

    // Combine and sort
    const allActivities = [
      ...recentSpk.map(a => ({ ...a, module: 'Material' })),
      ...recentLps.map(a => ({ ...a, module: 'LPS' })),
      ...recentMasuk.map(a => ({ ...a, module: 'Stock Label' })),
      ...recentKeluar.map(a => ({ ...a, module: 'Stock Label' }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
     .slice(0, limit);

    res.json({ activities: allActivities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
