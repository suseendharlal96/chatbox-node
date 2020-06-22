const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const { addUsers, removeUsers, getUsers, getUsersInRoom } = require("./users");

const port = process.env.PORT || 5000;
const router = require("./router");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  console.log("we have new connection ");
  socket.on("join", ({ name, room }, callback) => {
    const { error, newUser } = addUsers({ id: socket.id, name, room });
    console.log(newUser);
    if (error) {
      return callback(error);
    }

    // emitting data to the front end
    socket.emit("message", {
      user: "admin",
      text: `${newUser.name} welcome to ${newUser.room}`,
    });
    socket.broadcast.to(newUser.room).emit("message", {
      user: "admin",
      text: `${newUser.name} has joined the chat`,
    });
    socket.join(newUser.room);

    io.to(newUser.room).emit("roomData", {
      room: newUser.room,
      users: getUsersInRoom(newUser.room),
    });
    callback();
  });

  // expecting data from frontend
  socket.on("sendMsg", (message, callback) => {
    const user = getUsers(socket.id);
    console.log(user);
    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("user left");
  });
});

app.use(router);

server.listen(port, () => console.log("server", port));
