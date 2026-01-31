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
