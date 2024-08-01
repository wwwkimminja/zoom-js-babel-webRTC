import http from "http";
// import WebSocket from "ws";
import express from "express";
import path from 'path';
import { Server } from "socket.io";

const __dirname = path.resolve();
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/public/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const io = new Server(httpServer)

io.on("connection", socket => {
  socket['nickname'] = "Anonymous";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, userName,done) => {
    socket.join(roomName);
    socket.nickname = userName;
    done();
    socket.to(roomName).emit("welcome",socket.nickname)
  })
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}:${msg}`);
    done();

  })
  socket.on("nickname", (name) => {
    socket.nickname = name
  })
  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname))
  })
})

// const wss = new WebSocket.Server({ server });

// const sockets = []

// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log("Connected to Browser ✅")
//   socket.on("close", () => console.log("Disconnected from the Browser ❌"))
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}:${message.payload}`))
//       case "nickname":
//         socket["nickname"] = message.payload
//     }
//   })

// });

httpServer.listen(3000, handleListen);
