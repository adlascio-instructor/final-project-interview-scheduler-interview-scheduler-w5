const express = require('express');
const { Pool } = require("pg");
const credentials = require('../shared/credentials');

const router = express.Router();

router.get('/available/:day', async (req, res) => {
    const { day } = req.params;

    const pool = new Pool(credentials);
    const response = await pool.query(
        `SELECT interviewers.*
        FROM interviewers INNER JOIN available_interviewers
        ON interviewers.id = available_interviewers.interviewer_id
        INNER JOIN days ON days.id = available_interviewers.day_id
        WHERE days.name = $1`,
        [day]
    );

    res.json(response.rows);
    pool.end();
});

module.exports = router;