const express = require('express');
const { pool } = require('../config/database');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Dashboard stats
router.get('/dashboard/stats', async (req, res, next) => {
  try {
    const [lpsStats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalLps,
        COUNT(CASE WHEN status = 'finish' THEN 1 END) as finishedLps,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendingLps,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as lpsThisMonth
      FROM lps
    `);

    const [finishStats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalFinish,
        COUNT(CASE WHEN tanggal_finish >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as finishThisMonth
      FROM lps_label_finish
    `);

    const [productionStats] = await pool.execute(`
      SELECT 
        SUM(jumlah_pcs) as totalPcs,
        COUNT(DISTINCT customer) as uniqueCustomers
      FROM lps
    `);

    res.json({
      ...lpsStats[0],
      ...finishStats[0],
      ...productionStats[0]
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
        CONCAT('LPS ', no_lps, ' created') as title,
        CONCAT('Item: ', nama_item, ' - ', customer) as description,
        DATE_FORMAT(created_at, '%H:%i') as time,
        created_at
      FROM lps 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    res.json(activities);
  } catch (error) {
    next(error);
  }
});

// LPS list
router.get('/list', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        l.*,
        lf.tanggal_finish,
        u.full_name as verified_by_name
      FROM lps l
      LEFT JOIN lps_label_finish lf ON l.id = lf.lps_id
      LEFT JOIN users u ON lf.verified_by = u.id
      ORDER BY l.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Get single LPS
router.get('/list/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(`
      SELECT 
        l.*,
        lf.tanggal_finish,
        u.full_name as verified_by_name
      FROM lps l
      LEFT JOIN lps_label_finish lf ON l.id = lf.lps_id
      LEFT JOIN users u ON lf.verified_by = u.id
      WHERE l.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'LPS not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create LPS
router.post('/create', async (req, res, next) => {
  try {
    const {
      tanggal,
      no_lps,
      papercore_pcs,
      papercore_size,
      nama_item,
      customer,
      part_number,
      no_spk,
      po,
      jumlah_pcs,
      material
    } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO lps (
        tanggal, no_lps, papercore_pcs, papercore_size, nama_item, customer,
        part_number, no_spk, po, jumlah_pcs, material, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      tanggal, no_lps, papercore_pcs, papercore_size, nama_item, customer,
      part_number, no_spk, po, jumlah_pcs, material
    ]);

    // Broadcast update
    req.io.emit('lps_created', {
      id: result.insertId,
      no_lps,
      nama_item,
      customer,
      status: 'pending'
    });

    res.json({ 
      success: true, 
      id: result.insertId,
      message: 'LPS created successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// Update LPS
router.put('/list/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      tanggal,
      no_lps,
      papercore_pcs,
      papercore_size,
      nama_item,
      customer,
      part_number,
      no_spk,
      po,
      jumlah_pcs,
      material
    } = req.body;

    await pool.execute(`
      UPDATE lps SET
        tanggal = ?, no_lps = ?, papercore_pcs = ?, papercore_size = ?, nama_item = ?,
        customer = ?, part_number = ?, no_spk = ?, po = ?, jumlah_pcs = ?, material = ?
      WHERE id = ?
    `, [
      tanggal, no_lps, papercore_pcs, papercore_size, nama_item,
      customer, part_number, no_spk, po, jumlah_pcs, material, id
    ]);

    // Broadcast update
    req.io.emit('lps_updated', {
      id,
      no_lps,
      nama_item,
      customer
    });

    res.json({ success: true, message: 'LPS updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete LPS
router.delete('/list/:id', requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM lps WHERE id = ?', [id]);

    // Broadcast update
    req.io.emit('lps_deleted', { id });

    res.json({ success: true, message: 'LPS deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Label finish
router.get('/finish', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        lf.*,
        l.no_lps,
        l.nama_item,
        l.customer,
        u.full_name as verified_by_name
      FROM lps_label_finish lf
      JOIN lps l ON lf.lps_id = l.id
      LEFT JOIN users u ON lf.verified_by = u.id
      ORDER BY lf.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Mark LPS as finished
router.post('/finish', async (req, res, next) => {
  try {
    const { lps_id, tanggal_finish } = req.body;
    const userId = req.user.id;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check if already finished
      const [existing] = await connection.execute(
        'SELECT id FROM lps_label_finish WHERE lps_id = ?',
        [lps_id]
      );

      if (existing.length > 0) {
        throw new Error('LPS already marked as finished');
      }

      // Insert lps_label_finish record
      const [finishResult] = await connection.execute(`
        INSERT INTO lps_label_finish (lps_id, tanggal_finish, verified_by)
        VALUES (?, ?, ?)
      `, [lps_id, tanggal_finish, userId]);

      // Update LPS status
      await connection.execute(
        'UPDATE lps SET status = ? WHERE id = ?',
        ['finish', lps_id]
      );

      await connection.commit();

      // Broadcast update
      req.io.emit('lps_finished', {
        lps_id,
        finish_id: finishResult.insertId,
        tanggal_finish,
        verified_by: req.user.full_name
      });

      res.json({ 
        success: true, 
        id: finishResult.insertId,
        message: 'LPS marked as finished successfully' 
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

// Unmark LPS as finished (admin only)
router.delete('/finish/:id', requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get LPS ID from lps_label_finish
      const [finishRecord] = await connection.execute(
        'SELECT lps_id FROM lps_label_finish WHERE id = ?',
        [id]
      );

      if (finishRecord.length === 0) {
        throw new Error('Finish record not found');
      }

      const lpsId = finishRecord[0].lps_id;

      // Delete lps_label_finish record
      await connection.execute('DELETE FROM lps_label_finish WHERE id = ?', [id]);

      // Update LPS status back to pending
      await connection.execute(
        'UPDATE lps SET status = ? WHERE id = ?',
        ['pending', lpsId]
      );

      await connection.commit();

      // Broadcast update
      req.io.emit('lps_unfinished', { lps_id: lpsId });

      res.json({ success: true, message: 'LPS unmarked as finished successfully' });
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
      whereClause = 'WHERE MONTH(tanggal) = ? AND YEAR(tanggal) = ?';
      params = [month, year];
    }

    const [lpsReport] = await pool.execute(`
      SELECT 
        DATE_FORMAT(tanggal, '%Y-%m') as period,
        COUNT(*) as total_lps,
        COUNT(CASE WHEN status = 'finish' THEN 1 END) as finished_lps,
        SUM(jumlah_pcs) as total_pcs
      FROM lps 
      ${whereClause}
      GROUP BY DATE_FORMAT(tanggal, '%Y-%m')
      ORDER BY period DESC
    `, params);

    const [customerReport] = await pool.execute(`
      SELECT 
        customer,
        COUNT(*) as total_lps,
        SUM(jumlah_pcs) as total_pcs,
        COUNT(CASE WHEN status = 'finish' THEN 1 END) as finished_lps
      FROM lps
      ${whereClause}
      GROUP BY customer
      ORDER BY total_lps DESC
    `, params);

    const [materialReport] = await pool.execute(`
      SELECT 
        material,
        COUNT(*) as total_lps,
        SUM(jumlah_pcs) as total_pcs
      FROM lps
      ${whereClause}
      GROUP BY material
      ORDER BY total_lps DESC
    `, params);

    res.json({
      lps: lpsReport,
      customer: customerReport,
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
