const express = require('express');
const { Pool } = require("pg");
const credentials = require('../shared/credentials');

const router = express.Router();

router.get('/:dayId', async (req, res) => {
    const { dayId } = req.params;

    const pool = new Pool(credentials);
    const response = await pool.query(
        `SELECT appointments.id, appointments.time, interviews.id as interview_id, interviews.student,
        interviewers.id as interviewer_id, interviewers.name as interviewer_name,
        interviewers.avatar as interviewer_avatar
        FROM appointments LEFT JOIN interviews ON appointments.id = interviews.appointment_id
        LEFT JOIN interviewers ON interviews.interviewer_id = interviewers.id
        WHERE day_id = $1`,
        [dayId]
    );

    const data = response
        .rows
        .map(r => ({
            id: r.id,
            time: r.time,
            interview: r.interview_id ? {
                id: r.interview_id,
                student: r.student,
                interviewer: {
                    id: r.interviewer_id,
                    name: r.interviewer_name,
                    avatar: r.interviewer_avatar,
                }
            } : undefined,
        }))
        .reduce((dataObj, r) => ({ ...dataObj, [r.id]: r }), {});

    res.json(data);
    pool.end();
});

module.exports = router;