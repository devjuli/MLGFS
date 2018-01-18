const nn = require("./NeuralNet");
let c = document.getElementById("canvas")
c.addEventListener("click",onclickfunc,false);
let tanh = Math.tanh;
let tanh_d = (x)=>{return 1-Math.pow(Math.tanh(x),2)};
let modebtn = document.getElementById("modebtn");
modebtn.onclick = ()=>{mode*=-1};
let plotbutton = document.getElementById("plotbtn");
plotbutton.onclick=plotDecisionBoundaries;

let mode = 1;

let X = new Array();
let Y = new Array();

function onclickfunc(event){
  event = event || window.event;
  addPoint(event.pageX-c.offsetLeft,event.pageY-c.offsetTop,mode);
  plot();
}

function addPoint(x1,x2,y){
  X.push([x1/500,x2/500]);
  Y.push([y]);
}

function plot(){
  let ctx = c.getContext("2d");
  for(let i = 0;i<X.length;i++){
    ctx.beginPath();
    if(Y[i][0] == 1)
      ctx.rect(X[i][0]*500,X[i][1]*500,10,10);
    else ctx.arc(X[i][0]*500,X[i][1]*500,5,0,Math.PI*2);
    ctx.stroke();
    ctx.closePath();
  }
}

function plotDecisionBoundaries(){
  let model = new nn.Sequential(true);
  model.add(new nn.Dense(2,10,1e-2,tanh,tanh_d));
  model.add(new nn.Dense(10,10,1e-2,tanh,tanh_d));
  model.add(new nn.Dense(10,1,1e-2,tanh,tanh_d));
  model.fit(X,Y,10000,X.length);
  let ctx = c.getContext("2d");
  ctx.fillStyle = "ffffff";
  ctx.fillRect(0,0,500,500);
  for(let i = 0;i<500;i++){
    for(let j = 0;j<500;j++){
      let x = [[i/500,j/500]];
      let pred = model.predict(x);
      if(pred.get(0,0) > 0){
        ctx.fillStyle="#ff0000";
      }else{
        ctx.fillStyle="#00ff00";
      }
      ctx.fillRect(i,j,1,1);
    }
  }
  plot();
}
