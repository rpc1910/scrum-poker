const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const routes = require("./routes");
const events = require("../../frontend/src/config/events");

const app = express();
app.use(cors());

const server = http.Server(app);
const io = socket(server);

io.on("connection", (socket) => {
  socket.on(events.CONNECTED_ROOM, (box) => {
    console.log("Connected", box);
    socket.join(box);
  });

  socket.on(events.CONNECTED_USER, (data) => {
    io.sockets.in(data.room).emit(events.CONNECTED_USER, data);
  });

  socket.on(events.USER_VOTE, ({ name, vote, room }) => {
    io.sockets.in(room).emit(events.USER_VOTE, { name, vote });
  });

  socket.on(events.START_VOTES, ({ name, room }) => {
    io.sockets.in(room).emit(events.START_VOTES, { name });
  });
});

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// app.use(express.json());
// app.use(routes);
app.get("/", (req, res) => res.json({ status: "ok" }));

module.exports = server;
