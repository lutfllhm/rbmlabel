const express = require('express');
const { pool } = require('../config/database');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Dashboard stats
router.get('/dashboard/stats', async (req, res, next) => {
  try {
    const [materialStats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalMaterials,
        SUM(jumlah_roll) as totalRolls,
        COUNT(DISTINCT kategori_id) as totalCategories
      FROM material_stock
    `);

    const [spkStats] = await pool.execute(`
      SELECT 
        COUNT(*) as activeSPK,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as spkThisMonth
      FROM material_spk
    `);

    const [lowStockItems] = await pool.execute(`
      SELECT COUNT(*) as lowStockItems
      FROM material_stock 
      WHERE jumlah_roll < 10
    `);

    const [categoryStats] = await pool.execute(`
      SELECT 
        mc.name,
        COUNT(ms.id) as count
      FROM material_categories mc
      LEFT JOIN material_stock ms ON mc.id = ms.kategori_id
      GROUP BY mc.id, mc.name
      ORDER BY count DESC
    `);

    res.json({
      ...materialStats[0],
      ...spkStats[0],
      ...lowStockItems[0],
      categoryStats
    });
  } catch (error) {
    next(error);
  }
});

// Dashboard activities
router.get('/dashboard/activities', async (req, res, next) => {
  try {
    const [activities] = await pool.execute(`
      SELECT 
        CONCAT('SPK ', no_spk, ' created') as title,
        CONCAT('Part: ', part_number, ' - ', nama_item) as description,
        DATE_FORMAT(created_at, '%H:%i') as time,
        created_at
      FROM material_spk 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    res.json(activities);
  } catch (error) {
    next(error);
  }
});

// Material stock
router.get('/stock', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        ms.*,
        mc.name as kategori_name
      FROM material_stock ms
      JOIN material_categories mc ON ms.kategori_id = mc.id
      ORDER BY ms.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Add material stock
router.post('/stock', async (req, res, next) => {
  try {
    const {
      no_po,
      tanggal,
      nama_material,
      ukuran,
      kategori_id,
      supplier,
      jumlah_roll
    } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO material_stock 
      (no_po, tanggal, nama_material, ukuran, kategori_id, supplier, jumlah_roll)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [no_po, tanggal, nama_material, ukuran, kategori_id, supplier, jumlah_roll]);

    // Broadcast update via socket
    req.io.emit('material_stock_updated', {
      action: 'create',
      data: { id: result.insertId, ...req.body }
    });

    res.json({ 
      success: true, 
      id: result.insertId,
      message: 'Material stock added successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// Update material stock
router.put('/stock/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      no_po,
      tanggal,
      nama_material,
      ukuran,
      kategori_id,
      supplier,
      jumlah_roll
    } = req.body;

    await pool.execute(`
      UPDATE material_stock 
      SET no_po = ?, tanggal = ?, nama_material = ?, ukuran = ?, 
          kategori_id = ?, supplier = ?, jumlah_roll = ?
      WHERE id = ?
    `, [no_po, tanggal, nama_material, ukuran, kategori_id, supplier, jumlah_roll, id]);

    // Broadcast update via socket
    req.io.emit('material_stock_updated', {
      action: 'update',
      data: { id, ...req.body }
    });

    res.json({ success: true, message: 'Material stock updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete material stock
router.delete('/stock/:id', requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM material_stock WHERE id = ?', [id]);

    // Broadcast update via socket
    req.io.emit('material_stock_updated', {
      action: 'delete',
      data: { id }
    });

    res.json({ success: true, message: 'Material stock deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Categories
router.get('/categories', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM material_categories ORDER BY name
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Add category
router.post('/categories', requireRole(['admin']), async (req, res, next) => {
  try {
    const { name } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO material_categories (name) VALUES (?)',
      [name]
    );

    res.json({ 
      success: true, 
      id: result.insertId,
      message: 'Category added successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// Labels
router.get('/labels', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM material_label_list ORDER BY part_number
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Add label
router.post('/labels', async (req, res, next) => {
  try {
    const { part_number, nama_item, ukuran, finishing, isi } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO material_label_list (part_number, nama_item, ukuran, finishing, isi)
      VALUES (?, ?, ?, ?, ?)
    `, [part_number, nama_item, ukuran, finishing, isi]);

    res.json({ 
      success: true, 
      id: result.insertId,
      message: 'Label added successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// SPK
router.get('/spk', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM material_spk ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Create SPK
router.post('/spk', async (req, res, next) => {
  try {
    const {
      no_spk,
      part_number,
      nama_item,
      ukuran,
      finishing,
      isi,
      warna,
      customer,
      jumlah_order_pcs,
      jumlah_order_roll,
      jumlah_cetak_pcs,
      jumlah_kebutuhan,
      diameter_core,
      material_id
    } = req.body;

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check material stock
      const [materialRows] = await connection.execute(
        'SELECT * FROM material_stock WHERE id = ?',
        [material_id]
      );

      if (materialRows.length === 0) {
        throw new Error('Material not found');
      }

      const material = materialRows[0];
      
      // Extract needed roll from jumlah_kebutuhan
      const rollMatch = jumlah_kebutuhan.match(/(\d+(?:\.\d+)?)\s*ROLL/i);
      const neededRoll = rollMatch ? parseFloat(rollMatch[1]) : 0;

      if (material.jumlah_roll < neededRoll) {
        throw new Error('Insufficient material stock');
      }

      // Update material stock
      await connection.execute(
        'UPDATE material_stock SET jumlah_roll = jumlah_roll - ? WHERE id = ?',
        [neededRoll, material_id]
      );

      // Insert SPK
      const [spkResult] = await connection.execute(`
        INSERT INTO material_spk (
          no_spk, part_number, nama_item, ukuran, finishing, isi, warna, customer,
          jumlah_order_pcs, jumlah_order_roll, jumlah_cetak_pcs, jumlah_kebutuhan,
          diameter_core, material_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        no_spk, part_number, nama_item, ukuran, finishing, isi, warna, customer,
        jumlah_order_pcs, jumlah_order_roll, jumlah_cetak_pcs, jumlah_kebutuhan,
        diameter_core, material_id
      ]);

      await connection.commit();

      // Broadcast updates
      req.io.emit('spk_created', {
        id: spkResult.insertId,
        no_spk,
        part_number,
        nama_item,
        customer
      });

      req.io.emit('material_stock_updated', {
        action: 'update',
        data: { id: material_id, jumlah_roll: material.jumlah_roll - neededRoll }
      });

      res.json({ 
        success: true, 
        id: spkResult.insertId,
        message: 'SPK created successfully' 
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
});

// Reports
router.get('/reports', async (req, res, next) => {
  try {
    const { month, year } = req.query;
    
    let whereClause = '';
    let params = [];
    
    if (month && year) {
      whereClause = 'WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?';
      params = [month, year];
    }

    const [spkReport] = await pool.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as period,
        COUNT(*) as total_spk,
        SUM(jumlah_order_pcs) as total_pcs,
        SUM(jumlah_order_roll) as total_roll
      FROM material_spk 
      ${whereClause}
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY period DESC
    `, params);

    const [materialReport] = await pool.execute(`
      SELECT 
        mc.name as category,
        COUNT(ms.id) as total_items,
        SUM(ms.jumlah_roll) as total_rolls
      FROM material_categories mc
      LEFT JOIN material_stock ms ON mc.id = ms.kategori_id
      GROUP BY mc.id, mc.name
      ORDER BY total_rolls DESC
    `);

    res.json({
      spk: spkReport,
      material: materialReport
    });
  } catch (error) {
    next(error);
  }
});

// Users (admin only)
router.get('/users', requireRole(['admin']), async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, username, full_name, email, role, created_at
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// ============================================
// INTEGRATION ENDPOINTS
// ============================================

// Get LPS status for a specific SPK
router.get('/spk/:id/lps-status', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get SPK details
    const [spk] = await pool.execute(
      'SELECT * FROM material_spk WHERE id = ?',
      [id]
    );

    if (spk.length === 0) {
      return res.status(404).json({ error: 'SPK not found' });
    }

    // Get related LPS
    const [lps] = await pool.execute(
      'SELECT * FROM lps WHERE no_spk = ? ORDER BY created_at DESC',
      [spk[0].no_spk]
    );

    res.json({
      spk: spk[0],
      lps: lps,
      has_lps: lps.length > 0,
      lps_finished: lps.some(l => l.status === 'finish'),
      lps_pending: lps.some(l => l.status === 'pending')
    });
  } catch (error) {
    next(error);
  }
});

// Create LPS from SPK
router.post('/spk/:id/create-lps', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tanggal, papercore_pcs, papercore_size } = req.body;

    // Get SPK details
    const [spk] = await pool.execute(
      'SELECT * FROM material_spk WHERE id = ?',
      [id]
    );

    if (spk.length === 0) {
      return res.status(404).json({ error: 'SPK not found' });
    }

    const spkData = spk[0];

    // Generate LPS number
    const [lastLps] = await pool.execute(
      'SELECT no_lps FROM lps ORDER BY id DESC LIMIT 1'
    );
    
    let lpsNumber;
    if (lastLps.length > 0) {
      const lastNumber = parseInt(lastLps[0].no_lps.split('-')[1]);
      lpsNumber = `LPS-${String(lastNumber + 1).padStart(5, '0')}`;
    } else {
      lpsNumber = 'LPS-00001';
    }

    // Create LPS
    const [result] = await pool.execute(`
      INSERT INTO lps (
        tanggal, no_lps, papercore_pcs, papercore_size, nama_item,
        customer, part_number, no_spk, po, jumlah_pcs, material, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      tanggal,
      lpsNumber,
      papercore_pcs,
      papercore_size,
      spkData.nama_item,
      spkData.customer || '',
      spkData.part_number,
      spkData.no_spk,
      '', // PO can be added later
      spkData.jumlah_cetak_pcs,
      spkData.nama_item // Using nama_item as material reference
    ]);

    // Broadcast notification
    req.io.emit('lps_created_from_spk', {
      lps_id: result.insertId,
      no_lps: lpsNumber,
      no_spk: spkData.no_spk,
      nama_item: spkData.nama_item
    });

    res.json({
      success: true,
      lps_id: result.insertId,
      no_lps: lpsNumber,
      message: 'LPS created successfully from SPK'
    });
  } catch (error) {
    next(error);
  }
});

// Get SPK with full integration data
router.get('/spk/:id/full', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get SPK with material and label details
    const [spk] = await pool.execute(`
      SELECT 
        s.*,
        m.nama_material, m.ukuran as material_ukuran, m.supplier, m.jumlah_roll as material_stock,
        l.nama_item as label_nama, l.ukuran as label_ukuran
      FROM material_spk s
      LEFT JOIN material_stock m ON s.material_id = m.id
      LEFT JOIN material_label_list l ON s.label_id = l.id
      WHERE s.id = ?
    `, [id]);

    if (spk.length === 0) {
      return res.status(404).json({ error: 'SPK not found' });
    }

    // Get related LPS
    const [lps] = await pool.execute(
      'SELECT * FROM lps WHERE no_spk = ? ORDER BY created_at DESC',
      [spk[0].no_spk]
    );

    // Get stock label masuk
    const [stockMasuk] = await pool.execute(
      'SELECT * FROM stok_label_masuk WHERE no_spk = ? ORDER BY created_at DESC',
      [spk[0].no_spk]
    );

    res.json({
      spk: spk[0],
      lps: lps,
      stock_masuk: stockMasuk,
      integration_status: {
        has_lps: lps.length > 0,
        lps_finished: lps.filter(l => l.status === 'finish').length,
        lps_pending: lps.filter(l => l.status === 'pending').length,
        in_stock: stockMasuk.length > 0
      }
    });
  } catch (error) {
    next(error);
  }
});
