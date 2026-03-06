const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let rooms = {};

io.on("connection",(socket)=>{

 console.log("connected");

 socket.on("joinRoom",(room)=>{

  socket.join(room);

  if(!rooms[room]){
   rooms[room] = {
    players:0,
    p1:{x:0,y:0},
    p2:{x:4,y:4},
    turn:1
   };
  }

  rooms[room].players++;

  // プレイヤー番号決定
  const player = rooms[room].players;

  socket.emit("startGame",{
   player:player,
   p1:rooms[room].p1,
   p2:rooms[room].p2,
   turn:rooms[room].turn
  });

 });

 socket.on("move",(data)=>{

  const r = rooms[data.room];
  if(!r) return;

  if(data.player===1){
   r.p1 = data.pos;
  }else{
   r.p2 = data.pos;
  }

  r.turn = data.turn;

  io.to(data.room).emit("update",data);

 });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>console.log("server started"));