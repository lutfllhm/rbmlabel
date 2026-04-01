const express = require('express');
const { pool } = require('../config/database');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Dashboard stats
router.get('/dashboard/stats', async (req, res, next) => {
  try {
    const [labelStats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalLabels,
        SUM(jumlah_roll) as totalRolls
      FROM stok_label
    `);

    const [masukStats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalMasuk,
        COUNT(CASE WHEN tanggal >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as masukThisMonth
      FROM stok_label_masuk
    `);

    const [keluarStats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalKeluar,
        COUNT(CASE WHEN tanggal >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as keluarThisMonth
      FROM stok_label_keluar
    `);

    const [lowStockItems] = await pool.execute(`
      SELECT COUNT(*) as lowStockItems
      FROM stok_label 
      WHERE jumlah_roll < 5
    `);

    res.json({
      ...labelStats[0],
      ...masukStats[0],
      ...keluarStats[0],
      ...lowStockItems[0]
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
        CONCAT('Label masuk: ', part_number) as title,
        CONCAT('SPK: ', no_spk, ' - ', nama_item) as description,
        DATE_FORMAT(created_at, '%H:%i') as time,
        created_at
      FROM stok_label_masuk 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    res.json(activities);
  } catch (error) {
    next(error);
  }
});

// Stock label
router.get('/stock', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM stok_label ORDER BY part_number
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Add stock label
router.post('/stock', async (req, res, next) => {
  try {
    const { part_number, nama_item, ukuran, finishing, isi, jumlah_roll } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO stok_label (part_number, nama_item, ukuran, finishing, isi, jumlah_roll)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [part_number, nama_item, ukuran, finishing, isi, jumlah_roll]);

    // Broadcast update
    req.io.emit('stok_label_updated', {
      action: 'create',
      data: { id: result.insertId, ...req.body }
    });

    res.json({ 
      success: true, 
      id: result.insertId,
      message: 'Stock label added successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// Update stock label
router.put('/stock/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { part_number, nama_item, ukuran, finishing, isi, jumlah_roll } = req.body;

    await pool.execute(`
      UPDATE stok_label 
      SET part_number = ?, nama_item = ?, ukuran = ?, finishing = ?, isi = ?, jumlah_roll = ?
      WHERE id = ?
    `, [part_number, nama_item, ukuran, finishing, isi, jumlah_roll, id]);

    // Broadcast update
    req.io.emit('stok_label_updated', {
      action: 'update',
      data: { id, ...req.body }
    });

    res.json({ success: true, message: 'Stock label updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete stock label
router.delete('/stock/:id', requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM stok_label WHERE id = ?', [id]);

    // Broadcast update
    req.io.emit('stok_label_updated', {
      action: 'delete',
      data: { id }
    });

    res.json({ success: true, message: 'Stock label deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Label masuk
router.get('/masuk', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM stok_label_masuk ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Add label masuk
router.post('/masuk', async (req, res, next) => {
  try {
    const { tanggal, no_spk, no_lps, part_number, nama_item, jumlah_order, customer } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO stok_label_masuk (tanggal, no_spk, no_lps, part_number, nama_item, jumlah_order, customer)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [tanggal, no_spk, no_lps, part_number, nama_item, jumlah_order, customer]);

    // Update stock label if exists
    const rollMatch = jumlah_order.match(/(\d+(?:\.\d+)?)\s*ROLL/i);
    const rollToAdd = rollMatch ? parseFloat(rollMatch[1]) : 0;

    if (rollToAdd > 0) {
      const [existing] = await pool.execute(
        'SELECT * FROM stok_label WHERE part_number = ?',
        [part_number]
      );

      if (existing.length > 0) {
        await pool.execute(
          'UPDATE stok_label SET jumlah_roll = jumlah_roll + ? WHERE part_number = ?',
          [rollToAdd, part_number]
        );
      } else {
        // Create new stock entry
        await pool.execute(`
          INSERT INTO stok_label (part_number, nama_item, ukuran, finishing, isi, jumlah_roll)
          VALUES (?, ?, '', '', 0, ?)
        `, [part_number, nama_item, rollToAdd]);
      }

      // Broadcast stock update
      req.io.emit('stok_label_updated', {
        action: 'update',
        data: { part_number, jumlah_roll: rollToAdd }
      });
    }

    // Broadcast label masuk
    req.io.emit('label_masuk_created', {
      id: result.insertId,
      no_spk,
      part_number,
      nama_item
    });

    res.json({ 
      success: true, 
      id: result.insertId,
      message: 'Label masuk added successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// Label keluar
router.get('/keluar', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM stok_label_keluar ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Add label keluar
router.post('/keluar', async (req, res, next) => {
  try {
    const { tanggal, part_number, nama_item, customer, jumlah, keterangan } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO stok_label_keluar (tanggal, part_number, nama_item, customer, jumlah, keterangan)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [tanggal, part_number, nama_item, customer, jumlah, keterangan]);

    // Update stock label
    const rollMatch = jumlah.match(/(\d+(?:\.\d+)?)\s*ROLL/i);
    const rollToSubtract = rollMatch ? parseFloat(rollMatch[1]) : 0;

    if (rollToSubtract > 0) {
      await pool.execute(
        'UPDATE stok_label SET jumlah_roll = jumlah_roll - ? WHERE part_number = ?',
        [rollToSubtract, part_number]
      );

      // Broadcast stock update
      req.io.emit('stok_label_updated', {
        action: 'update',
        data: { part_number, jumlah_roll: -rollToSubtract }
      });
    }

    res.json({ 
      success: true, 
      id: result.insertId,
      message: 'Label keluar added successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// Surat jalan
router.get('/surat-jalan', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        sj.*,
        COUNT(sji.id) as total_items
      FROM stok_surat_jalan sj
      LEFT JOIN stok_surat_jalan_items sji ON sj.id = sji.surat_jalan_id
      GROUP BY sj.id
      ORDER BY sj.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Get surat jalan detail
router.get('/surat-jalan/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [suratJalan] = await pool.execute(
      'SELECT * FROM stok_surat_jalan WHERE id = ?',
      [id]
    );

    const [items] = await pool.execute(`
      SELECT * FROM stok_surat_jalan_items WHERE surat_jalan_id = ?
    `, [id]);

    if (suratJalan.length === 0) {
      return res.status(404).json({ error: 'Surat jalan not found' });
    }

    res.json({
      ...suratJalan[0],
      items
    });
  } catch (error) {
    next(error);
  }
});

// Create surat jalan
router.post('/surat-jalan', async (req, res, next) => {
  try {
    const { no_delivery, customer, tanggal, items } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert surat jalan
      const [suratJalanResult] = await connection.execute(`
        INSERT INTO stok_surat_jalan (no_delivery, customer, tanggal)
        VALUES (?, ?, ?)
      `, [no_delivery, customer, tanggal]);

      const suratJalanId = suratJalanResult.insertId;

      // Insert items
      for (const item of items) {
        await connection.execute(`
          INSERT INTO stok_surat_jalan_items (surat_jalan_id, label_keluar_id, part_number, nama_item, jumlah)
          VALUES (?, ?, ?, ?, ?)
        `, [suratJalanId, item.label_keluar_id, item.part_number, item.nama_item, item.jumlah]);
      }

      await connection.commit();

      res.json({ 
        success: true, 
        id: suratJalanId,
        message: 'Surat jalan created successfully' 
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
      whereClause = 'WHERE MONTH(tanggal) = ? AND YEAR(tanggal) = ?';
      params = [month, year];
    }

    const [masukReport] = await pool.execute(`
      SELECT 
        DATE_FORMAT(tanggal, '%Y-%m') as period,
        COUNT(*) as total_masuk,
        COUNT(DISTINCT part_number) as unique_parts
      FROM stok_label_masuk 
      ${whereClause}
      GROUP BY DATE_FORMAT(tanggal, '%Y-%m')
      ORDER BY period DESC
    `, params);

    const [keluarReport] = await pool.execute(`
      SELECT 
        DATE_FORMAT(tanggal, '%Y-%m') as period,
        COUNT(*) as total_keluar,
        COUNT(DISTINCT customer) as unique_customers
      FROM stok_label_keluar 
      ${whereClause}
      GROUP BY DATE_FORMAT(tanggal, '%Y-%m')
      ORDER BY period DESC
    `, params);

    const [stockReport] = await pool.execute(`
      SELECT 
        part_number,
        nama_item,
        jumlah_roll,
        CASE 
          WHEN jumlah_roll < 5 THEN 'Low'
          WHEN jumlah_roll < 20 THEN 'Medium'
          ELSE 'High'
        END as stock_level
      FROM stok_label
      ORDER BY jumlah_roll ASC
    `);

    res.json({
      masuk: masukReport,
      keluar: keluarReport,
      stock: stockReport
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

// Get LPS details for label masuk
router.get('/masuk/:id/lps-details', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get label masuk
    const [labelMasuk] = await pool.execute(
      'SELECT * FROM stok_label_masuk WHERE id = ?',
      [id]
    );

    if (labelMasuk.length === 0) {
      return res.status(404).json({ error: 'Label masuk not found' });
    }

    const masuk = labelMasuk[0];

    // Get LPS if exists
    let lpsData = null;
    if (masuk.no_lps) {
      const [lps] = await pool.execute(`
        SELECT 
          l.*,
          lf.tanggal_finish,
          u.full_name as verified_by_name
        FROM lps l
        LEFT JOIN lps_label_finish lf ON l.id = lf.lps_id
        LEFT JOIN users u ON lf.verified_by = u.id
        WHERE l.no_lps = ?
      `, [masuk.no_lps]);
      lpsData = lps[0] || null;
    }

    res.json({
      label_masuk: masuk,
      lps: lpsData,
      has_lps: lpsData !== null
    });
  } catch (error) {
    next(error);
  }
});

// Get SPK details for label masuk
router.get('/masuk/:id/spk-details', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get label masuk
    const [labelMasuk] = await pool.execute(
      'SELECT * FROM stok_label_masuk WHERE id = ?',
      [id]
    );

    if (labelMasuk.length === 0) {
      return res.status(404).json({ error: 'Label masuk not found' });
    }

    const masuk = labelMasuk[0];

    // Get SPK if exists
    let spkData = null;
    if (masuk.no_spk) {
      const [spk] = await pool.execute(`
        SELECT 
          s.*,
          m.nama_material, m.ukuran as material_ukuran, m.supplier
        FROM material_spk s
        LEFT JOIN material_stock m ON s.material_id = m.id
        WHERE s.no_spk = ?
      `, [masuk.no_spk]);
      spkData = spk[0] || null;
    }

    res.json({
      label_masuk: masuk,
      spk: spkData,
      has_spk: spkData !== null
    });
  } catch (error) {
    next(error);
  }
});

// Get full integration data for label masuk
router.get('/masuk/:id/full', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get label masuk
    const [labelMasuk] = await pool.execute(
      'SELECT * FROM stok_label_masuk WHERE id = ?',
      [id]
    );

    if (labelMasuk.length === 0) {
      return res.status(404).json({ error: 'Label masuk not found' });
    }

    const masuk = labelMasuk[0];

    // Get SPK if exists
    let spkData = null;
    if (masuk.no_spk) {
      const [spk] = await pool.execute(`
        SELECT 
          s.*,
          m.nama_material, m.ukuran as material_ukuran, m.supplier
        FROM material_spk s
        LEFT JOIN material_stock m ON s.material_id = m.id
        WHERE s.no_spk = ?
      `, [masuk.no_spk]);
      spkData = spk[0] || null;
    }

    // Get LPS if exists
    let lpsData = null;
    if (masuk.no_lps) {
      const [lps] = await pool.execute(`
        SELECT 
          l.*,
          lf.tanggal_finish,
          u.full_name as verified_by_name
        FROM lps l
        LEFT JOIN lps_label_finish lf ON l.id = lf.lps_id
        LEFT JOIN users u ON lf.verified_by = u.id
        WHERE l.no_lps = ?
      `, [masuk.no_lps]);
      lpsData = lps[0] || null;
    }

    // Get current stock
    const [currentStock] = await pool.execute(
      'SELECT * FROM stok_label WHERE part_number = ?',
      [masuk.part_number]
    );

    // Get label keluar for this part
    const [labelKeluar] = await pool.execute(
      'SELECT * FROM stok_label_keluar WHERE part_number = ? ORDER BY created_at DESC LIMIT 5',
      [masuk.part_number]
    );

    res.json({
      label_masuk: masuk,
      spk: spkData,
      lps: lpsData,
      current_stock: currentStock[0] || null,
      recent_keluar: labelKeluar,
      integration_status: {
        has_spk: spkData !== null,
        has_lps: lpsData !== null,
        in_stock: currentStock.length > 0,
        has_shipments: labelKeluar.length > 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get shipment history for a part number
router.get('/part/:part_number/history', async (req, res, next) => {
  try {
    const { part_number } = req.params;

    // Get all label masuk
    const [masuk] = await pool.execute(
      'SELECT * FROM stok_label_masuk WHERE part_number = ? ORDER BY tanggal DESC',
      [part_number]
    );

    // Get all label keluar
    const [keluar] = await pool.execute(
      'SELECT * FROM stok_label_keluar WHERE part_number = ? ORDER BY tanggal DESC',
      [part_number]
    );

    // Get current stock
    const [stock] = await pool.execute(
      'SELECT * FROM stok_label WHERE part_number = ?',
      [part_number]
    );

    // Calculate totals
    const totalMasuk = masuk.length;
    const totalKeluar = keluar.length;
    const currentRoll = stock[0]?.jumlah_roll || 0;

    res.json({
      part_number,
      current_stock: stock[0] || null,
      masuk_history: masuk,
      keluar_history: keluar,
      statistics: {
        total_masuk: totalMasuk,
        total_keluar: totalKeluar,
        current_roll: currentRoll
      }
    });
  } catch (error) {
    next(error);
  }
});
