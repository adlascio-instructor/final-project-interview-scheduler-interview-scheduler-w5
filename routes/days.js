const express = require('express');
const { Pool } = require("pg");
const credentials = require('../shared/credentials');

const router = express.Router();
// Days route (Get all days and quantity of appointments available)
router.get('/', async (req, res) => {
    const pool = new Pool(credentials);
    const response = await pool.query('SELECT * FROM days');
    res.json(response.rows);
    pool.end();
});

module.exports = router;