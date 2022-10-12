const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Days route is on!');
});

module.exports = router;