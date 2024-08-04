import http from "http";
// import WebSocket from "ws";
import express from "express";
import path from 'path';
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";


const __dirname = path.resolve();
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/public/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
})

instrument(io, {
  auth: false
})

function publicRooms() {
  const { sids, rooms } = io.sockets.adapter;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key)
    }
  })

  return publicRooms

}
function countRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  })
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  })
  socket.on("answer",(answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  })
  socket.on("ice",(ice,roomName)=>{
    socket.to(roomName).emit("ice",ice)
  })

})




httpServer.listen(3000, handleListen);
