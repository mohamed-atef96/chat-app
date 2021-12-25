const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const getMessage = require("./helpers/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./helpers/users");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
//create static folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    const user = userJoin(socket.id, data.username, data.room);
    console.log(user);

    socket.join(user.room);
    socket.emit("message", getMessage("chat app", `welcome ${user.username}`));

    socket.broadcast
      .to(user.room)
      .emit("message", getMessage("chat app", `${data.username} has joind`));

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (data) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", getMessage(data.username, data.message));
  });
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        getMessage("chat app", `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
const port = 3000;
server.listen(port, () => console.log(`app is running on port: ${port} `));
