const express = require('express');
const { Pool } = require("pg");
const credentials = require('../shared/credentials');

const router = express.Router();

router.get('/available/:dayId', async (req, res) => {
    const { dayId } = req.params;

    const pool = new Pool(credentials);
    const response = await pool.query(
        `SELECT interviewers.*
        FROM interviewers INNER JOIN available_interviewers
        ON interviewers.id = available_interviewers.interviewer_id
        WHERE available_interviewers.day_id = $1`,
        [dayId]
    );

    res.json(response.rows);
    pool.end();
});

module.exports = router;