const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const events = require("./config/events");

const app = express();
app.use(cors());

const server = http.Server(app);
const io = socket(server);

io.on("connection", (socket) => {
  socket.on(events.CONNECTED_ROOM, (box) => {
    console.log(events.CONNECTED_ROOM, box);
    socket.join(box);
  });

  socket.on(events.CONNECTED_USER, (data) => {
    console.log(events.CONNECTED_USER, data);
    io.sockets.in(data.room).emit(events.CONNECTED_USER, data);
  });

  socket.on(events.USER_VOTE, ({ id, name, vote, room }) => {
    console.log(events.USER_VOTE, { id, name });
    io.sockets.in(room).emit(events.USER_VOTE, { id, name, vote });
  });

  socket.on(events.START_VOTES, ({ name, room }) => {
    console.log(events.START_VOTES, name);
    io.sockets.in(room).emit(events.START_VOTES, { name });
  });
});

app.get("/", (req, res) => res.json({ status: "ok" }));

module.exports = server;
