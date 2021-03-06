const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

users = [];
connections = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(process.env.PORT || 3000);
console.log("Server running...");

io.sockets.on("connection", socket => {
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  socket.on("disconnect", data => {
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length);
  });

  //Send message
  socket.on("send message", data => {
    io.sockets.emit("new message", { msg: data, user: socket.username });
  });

  //new user
  socket.on("new user", (data, callback) => {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });
  function updateUsernames() {
    io.sockets.emit("get users", users);
  }
});
