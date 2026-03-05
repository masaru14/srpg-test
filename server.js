const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const rooms = {};

io.on("connection", (socket) => {

  socket.on("joinRoom",(roomId)=>{

    socket.join(roomId);

    if(!rooms[roomId]){
      rooms[roomId]={
        players:[],
        turn:0
      };
    }

    rooms[roomId].players.push(socket.id);

    if(rooms[roomId].players.length===2){

      io.to(roomId).emit("startGame",{
        p1:{x:0,y:0},
        p2:{x:4,y:4},
        turn:0
      });

    }

  });

  socket.on("move",(data)=>{

    io.to(data.room).emit("update",data);

  });

});

server.listen(3000,()=>{
  console.log("server started");
});