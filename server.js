const express = require("express");
const daysRoute = require('./routes/days');
const interviewsRoute = require('./routes/interviews');
const interviewersRoute = require('./routes/interviewers');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/days', daysRoute);
app.use('/interviews', interviewsRoute);
app.use('/interviewers', interviewersRoute);

app.listen(port, () => console.log(`Server is running on port ${port}`));
