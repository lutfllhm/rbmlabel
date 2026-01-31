const express = require('express');
const { materialPool, stoklabelPool, lpsPool } = require('../config/database');

const router = express.Router();

// Webhook from Material app to Stock Label app
router.post('/label-masuk', async (req, res, next) => {
  try {
    const { no_spk, part_number, nama_item, jumlah_order, customer, tanggal } = req.body;

    // Verify webhook secret
    const webhookSecret = req.headers['x-webhook-secret'];
    if (webhookSecret !== process.env.WEBHOOK_SECRET_STOKLABEL) {
      return res.status(401).json({ error: 'Invalid webhook secret' });
    }

    // Check if record already exists
    const [existing] = await stoklabelPool.execute(`
      SELECT id FROM label_masuk 
      WHERE part_number = ? AND tanggal = ? AND no_spk = ?
    `, [part_number, tanggal || new Date().toISOString().split('T')[0], no_spk]);

    let labelMasukId;

    if (existing.length > 0) {
      labelMasukId = existing[0].id;
    } else {
      // Insert new label_masuk record
      const [result] = await stoklabelPool.execute(`
        INSERT INTO label_masuk (tanggal, no_spk, part_number, nama_item, jumlah_order, customer)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        tanggal || new Date().toISOString().split('T')[0],
        no_spk,
        part_number,
        nama_item || '',
        jumlah_order || '',
        customer || ''
      ]);

      labelMasukId = result.insertId;
    }

    // Update or insert into stok_label
    const rollMatch = (jumlah_order || '').match(/(\d+(?:\.\d+)?)\s*ROLL/i);
    const rollToAdd = rollMatch ? parseFloat(rollMatch[1]) : 0;

    if (rollToAdd > 0) {
      const [stockExists] = await stoklabelPool.execute(
        'SELECT * FROM stok_label WHERE part_number = ?',
        [part_number]
      );

      if (stockExists.length > 0) {
        // Update existing stock
        await stoklabelPool.execute(
          'UPDATE stok_label SET jumlah_roll = jumlah_roll + ? WHERE part_number = ?',
          [rollToAdd, part_number]
        );
      } else {
        // Create new stock entry
        await stoklabelPool.execute(`
          INSERT INTO stok_label (part_number, nama_item, ukuran, finishing, isi, jumlah_roll)
          VALUES (?, ?, '', '', 0, ?)
        `, [part_number, nama_item || '', rollToAdd]);
      }
    }

    res.json({ 
      success: true, 
      label_masuk_id: labelMasukId,
      message: 'Label masuk processed successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// Webhook from LPS app to Stock Label app (update no_lps)
router.post('/update-no-lps', async (req, res, next) => {
  try {
    const { no_spk, no_lps } = req.body;

    // Verify webhook secret
    const webhookSecret = req.headers['x-webhook-secret'];
    if (webhookSecret !== process.env.WEBHOOK_SECRET_LPS) {
      return res.status(401).json({ error: 'Invalid webhook secret' });
    }

    // Update label_masuk with no_lps
    const [result] = await stoklabelPool.execute(
      'UPDATE label_masuk SET no_lps = ? WHERE no_spk = ?',
      [no_lps, no_spk]
    );

    res.json({ 
      success: true, 
      affected_rows: result.affectedRows,
      message: 'No LPS updated successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// Webhook from Stock Label app to Material app (update no_spk)
router.post('/update-no-spk', async (req, res, next) => {
  try {
    const { part_number, no_spk } = req.body;

    // Verify webhook secret
    const webhookSecret = req.headers['x-webhook-secret'];
    if (webhookSecret !== process.env.WEBHOOK_SECRET_MATERIAL) {
      return res.status(401).json({ error: 'Invalid webhook secret' });
    }

    // Update SPK if needed (fallback mechanism)
    const [result] = await materialPool.execute(
      'UPDATE spk SET updated_at = NOW() WHERE part_number = ? AND no_spk = ?',
      [part_number, no_spk]
    );

    res.json({ 
      success: true, 
      affected_rows: result.affectedRows,
      message: 'SPK updated successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// Generic notification webhook
router.post('/notification', async (req, res, next) => {
  try {
    const { app, type, message, entity, item, data } = req.body;

    // Verify webhook secret
    const webhookSecret = req.headers['x-webhook-secret'];
    const validSecrets = [
      process.env.WEBHOOK_SECRET_MATERIAL,
      process.env.WEBHOOK_SECRET_STOKLABEL,
      process.env.WEBHOOK_SECRET_LPS
    ];

    if (!validSecrets.includes(webhookSecret)) {
      return res.status(401).json({ error: 'Invalid webhook secret' });
    }

    // Broadcast notification via socket
    req.io.emit('notification', {
      app,
      type,
      message,
      entity,
      item,
      data,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      success: true, 
      message: 'Notification broadcasted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// Data sync webhook
router.post('/sync-data', async (req, res, next) => {
  try {
    const { app, table, action, data } = req.body;

    // Verify webhook secret
    const webhookSecret = req.headers['x-webhook-secret'];
    const validSecrets = [
      process.env.WEBHOOK_SECRET_MATERIAL,
      process.env.WEBHOOK_SECRET_STOKLABEL,
      process.env.WEBHOOK_SECRET_LPS
    ];

    if (!validSecrets.includes(webhookSecret)) {
      return res.status(401).json({ error: 'Invalid webhook secret' });
    }

    // Broadcast data change via socket
    req.io.emit('data_change', {
      app,
      table,
      action,
      data,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      success: true, 
      message: 'Data sync broadcasted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;