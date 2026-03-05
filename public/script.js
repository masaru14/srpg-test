const socket = io();

const board = document.getElementById("board");

let room="";
let player=1;

let p1={x:0,y:0};
let p2={x:4,y:4};

let turn=0;

function join(){

 room=document.getElementById("room").value;

 socket.emit("joinRoom",room);

}

socket.on("startGame",(data)=>{

 p1=data.p1;
 p2=data.p2;
 turn=data.turn;

 draw();

});

socket.on("update",(data)=>{

 if(data.player===1){
  p1=data.pos;
 }else{
  p2=data.pos;
 }

 turn=data.turn;

 draw();

});

function draw(){

 board.innerHTML="";

 for(let y=0;y<5;y++){
  for(let x=0;x<5;x++){

   const cell=document.createElement("div");
   cell.className="cell";

   if(p1.x===x && p1.y===y) cell.innerText="A";
   if(p2.x===x && p2.y===y) cell.innerText="B";

   cell.onclick=()=>move(x,y);

   board.appendChild(cell);

  }
 }

}

function move(x,y){

 let me = player===1 ? p1 : p2;

 if(turn!==player) return;

 if(Math.abs(me.x-x)+Math.abs(me.y-y)!==1) return;

 me.x=x;
 me.y=y;

 turn = player===1 ? 2 : 1;

 socket.emit("move",{
  room:room,
  player:player,
  pos:me,
  turn:turn
 });

 draw();

}