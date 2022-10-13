const express = require('express');
const { Pool } = require("pg");
const credentials = require('../shared/credentials');

const router = express.Router();
router.get('/', async (req, res) => {
    const pool = new Pool(credentials);
    const days = await pool.query(
    `SELECT days.*, COUNT(appointments.time) - COUNT(interviews.id) AS spots FROM days
     INNER JOIN appointments
     ON days.id = appointments.day_id
     LEFT JOIN interviews
     ON appointments.id = interviews.appointment_id
     GROUP BY days.id
     ORDER BY days.id;
     `
    );
    let daysObj = {};
    days.rows.map((day) => {
        day['spots'] = day.spots;
        daysObj[day.name] = day;
    })
    res.json(daysObj);
    pool.end();
});

module.exports = router;