const express = require("express");
const daysRoute = require('./routes/days');
const interviewsRoute = require('./routes/interviews');
const interviewersRoute = require('./routes/interviewers');
const cors = require('cors');
const http = require("http");
const socketIO = require("socket.io");
const { Pool } = require("pg");
const credentials = require('./shared/credentials');

const app = express();
const port = 8000;
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", 'POST']
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/days', daysRoute);
app.use('/interviews', interviewsRoute);
app.use('/interviewers', interviewersRoute);

io.on("connection", (socket) => {
  console.log("A client has connected");
  socket.on("create_interview", async (interview) => {
    const pool = new Pool(credentials);
    const response = await pool.query(
    `INSERT INTO interviews(interviewer_id, appointment_id, student) VALUES($1, $2, $3);
     `, [interview.interviewer.id, interview.appointment_id, interview.student]
    );
    socket.broadcast.emit("new_interview", interview);
  })
  socket.on("disconnect", () => {
    console.log("A client has disconnected");
  });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
