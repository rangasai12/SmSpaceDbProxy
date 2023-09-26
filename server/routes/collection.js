const express = require('express');
const { db } = require('../database');

const router = express.Router();

// Create
router.post('/:collection', (req, res) => {
  const { collection } = req.params;
  console.log(req.params)
  const data = req.body;
  const columns = Object.keys(data);
  const placeholders = columns.map(() => '?').join(', ');
  const values = columns.map((col) => data[col]);

  const insertQuery = `INSERT INTO ${collection} (${columns.join(', ')}) VALUES (${placeholders})`;

  db.run(insertQuery, values, function (err) {
    if (err) {
        console.log("collection name: " + collection)
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// Read
router.get('/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const selectQuery = `SELECT * FROM ${collection} WHERE id = ?`;

  db.get(selectQuery, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(row);
  });
});

// Update
router.post('/:collection/:id', (req, res) => {
    const { collection, id } = req.params;
    const data = req.body;
    const columns = Object.keys(data);
    const values = columns.map((col) => data[col]);
    columns.push('id');
    values.push(id);
  
    // Check if the record with the specified ID exists
    const selectQuery = `SELECT * FROM ${collection} WHERE id = ?`;
    db.get(selectQuery, [id], (err, existingRecord) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!existingRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }
  
      // The record with the specified ID exists; proceed with the update
      const updateQuery = `UPDATE ${collection} SET ${columns.map((col) => `${col} = ?`).join(', ')} WHERE id = ${id}`;
  
      db.run(updateQuery, values, function (err) {
        if (err) {
            console.log(err);
          return res.status(500).json({ error: err.message });
        }
        console.log(this)
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }
        res.json({ message: 'Record updated' });
      });
    });
  });
  

// Delete
router.delete('/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const deleteQuery = `DELETE FROM ${collection} WHERE id = ?`;

  db.run(deleteQuery, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted' });
  });
});

module.exports = router;

