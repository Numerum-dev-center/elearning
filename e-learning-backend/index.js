// e-learning-backend/index.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Nouvel utilisateur connecté :", socket.id);

  socket.on("join-room", (roomID) => {
    socket.join(roomID);
    socket.to(roomID).emit("user-joined", socket.id);
  });

  socket.on("signal", ({ roomID, signalData, from }) => {
    socket.to(roomID).emit("signal", { signalData, from });
  });

  socket.on("chat-message", ({ text }) => {
  socket.broadcast.emit("chat-message", {
    text,
    from: socket.id
  });
});

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté :", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Serveur Socket.io actif sur http://localhost:5000");
});
