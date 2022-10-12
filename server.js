const express = require("express");
const daysRoute = require('./routes/days');
const interviewsRoute = require('./routes/interviews');
const interviewersRoute = require('./routes/interviewers');

const app = express();
const port = 8000;

app.use('/days', daysRoute);
app.use('/interviews', interviewsRoute);
app.use('/interviewers', interviewersRoute);

app.listen(port, () => console.log(`Server is running on port ${port}`));
