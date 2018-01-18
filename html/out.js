/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const nn = __webpack_require__(1);
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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

function matrix(rows,cols){
  this.rows = rows;
  this.cols = cols;
  this.data = new Float64Array(rows*cols);
  this.get = function(i,j){
    if(i<this.rows && j <this.cols){
      return this.data[j*this.rows+i];
    }
  }
  this.set = function(i,j,val){
    if(i<this.rows && j < this.cols){
      this.data[j*this.rows+i] = val;
    }
  }
}

function dot(m1,m2){
  if(m1.cols != m2.rows){
    return null;
  }
  let mtx = new matrix(m1.rows,m2.cols);
  for(let i = 0;i<m1.rows;i++){
    for(let j=0;j<m2.cols;j++){
      for (let k=0;k<m1.cols;k++){
        mtx.set(i,j,mtx.get(i,j)+m1.get(i,k)*m2.get(k,j));
      }
    }
  }
  return mtx;
}

function matprint(mtx){
  for(let i = 0;i<mtx.rows;i++){
    let row = "";
    for(let j = 0;j<mtx.cols;j++){
      row += "|" + mtx.get(i,j)+ "|" + " ";
    }
    console.log(row);
  }
  console.log();
}

function add(m1,m2){
  if(typeof(m2) == "object"){
    if(m2.rows == 1 && m1.cols == m2.cols){
      let mtx = new matrix(m1.rows,m1.cols);
      for(let i=0;i<m1.rows;i++){
        for(let j=0;j<m1.cols;j++){
          mtx.set(i,j,m1.get(i,j)+m2.get(0,j));
        }
      }
      return mtx;
    }else if(m2.rows == m1.rows && m2.cols == 1){
      let mtx = new matrix(m1.rows,m1.cols);
      for(let i=0;i<m1.rows;i++){
        for(let j=0;j<m1.cols;j++){
          mtx.set(i,j,m1.get(i,j)+m2.get(i,0));
        }
      }
      return mtx;
    }else if(m1.rows == m2.rows && m1.cols == m2.cols){
      let mtx = new matrix(m1.rows,m1.cols);
      for(let i=0;i<m1.rows;i++){
        for(let j=0;j<m1.cols;j++){
          mtx.set(i,j,m1.get(i,j)+m2.get(i,j));
        }
      }
      return mtx;
    }
  }else if(typeof(m2) == "number"){
    let mtx = new matrix(m1.rows,m1.cols);
    for(let i=0;i<m1.rows;i++){
      for(let j=0;j<m1.cols;j++){
        mtx.set(i,j,m1.get(i,j)+m2);
      }
    }
    return mtx;
  }
}

function sub(m1,m2){
  if(typeof(m2) == "object"){
    if(m2.rows == 1 && m1.cols == m2.cols){
      let mtx = new matrix(m1.rows,m1.cols);
      for(let i=0;i<m1.rows;i++){
        for(let j=0;j<m1.cols;j++){
          mtx.set(i,j,m1.get(i,j)-m2.get(0,j));
        }
      }
      return mtx;
    }else if(m2.rows == m1.rows && m2.cols == 1){
      let mtx = new matrix(m1.rows,m1.cols);
      for(let i=0;i<m1.rows;i++){
        for(let j=0;j<m1.cols;j++){
          mtx.set(i,j,m1.get(i,j)-m2.get(i,0));
        }
      }
      return mtx;
    }else if(m1.rows == m2.rows && m1.cols == m2.cols){
      let mtx = new matrix(m1.rows,m1.cols);
      for(let i=0;i<m1.rows;i++){
        for(let j=0;j<m1.cols;j++){
          mtx.set(i,j,m1.get(i,j)-m2.get(i,j));
        }
      }
      return mtx;
    }
  }else if(typeof(m2) == "number"){
    let mtx = new matrix(m1.rows,m1.cols);
    for(let i=0;i<m1.rows;i++){
      for(let j=0;j<m1.cols;j++){
        mtx.set(i,j,m1.get(i,j)-m2);
      }
    }
    return mtx;
  }
}

function mul(m1,m2){
  if(typeof(m2) == "object"){
    if(m2.rows == 1 && m1.cols == m2.cols){
      let mtx = new matrix(m1.rows,m1.cols);
      for(let i=0;i<m1.rows;i++){
        for(let j=0;j<m1.cols;j++){
          mtx.set(i,j,m1.get(i,j)*m2.get(0,j));
        }
      }
      return mtx;
    }else if(m2.rows == m1.rows && m2.cols == 1){
      let mtx = new matrix(m1.rows,m1.cols);
      for(let i=0;i<m1.rows;i++){
        for(let j=0;j<m1.cols;j++){
          mtx.set(i,j,m1.get(i,j)*m2.get(i,0));
        }
      }
      return mtx;
    }else if(m1.rows == m2.rows && m1.cols == m2.cols){
      let mtx = new matrix(m1.rows,m1.cols);
      for(let i=0;i<m1.rows;i++){
        for(let j=0;j<m1.cols;j++){
          mtx.set(i,j,m1.get(i,j)*m2.get(i,j));
        }
      }
      return mtx;
    }
  }else if(typeof(m2) == "number"){
    let mtx = new matrix(m1.rows,m1.cols);
    for(let i=0;i<m1.rows;i++){
      for(let j=0;j<m1.cols;j++){
        mtx.set(i,j,m1.get(i,j)*m2);
      }
    }
    return mtx;
  }
}

function elementwise(mtx,f){
  fmtx = new matrix(mtx.rows,mtx.cols);
  for(let i = 0;i<mtx.rows;i++){
    for(let j = 0;j<mtx.cols;j++){
      fmtx.set(i,j,f(mtx.get(i,j)));
    }
  }
  return fmtx;
}

function sum(mtx,axis){
  if(axis == 0){
    let summed = 0;
    for(let i = 0;i<mtx.rows;i++){
      for(let j = 0;j<mtx.cols;j++){
        summed += mtx.get(i,j);
      }
    }
    return summed;
  }else if(axis == 1){
    let summed = new matrix(1,mtx.rows);
    for(let i = 0;i<mtx.rows;i++){
      for(let j = 0;j<mtx.cols;j++){
        summed.set(0,i,summed.get(0,i)+mtx.get(i,j));
      }
    }
    return summed;
  }
}

function transpose(mtx){
  let tmtx = new matrix(mtx.cols,mtx.rows);
  for(let i = 0;i<mtx.rows;i++){
    for(let j = 0;j<mtx.cols;j++){
      tmtx.set(j,i,mtx.get(i,j));
    }
  }
  return tmtx;
}


exports.from_array = function(amtx){
  let mtx = new matrix(amtx.length,amtx[0].length);
  for(let i = 0;i<mtx.rows;i++){
    for(let j = 0;j<mtx.cols;j++){
      mtx.set(i,j,amtx[i][j]);
    }
  }
  return mtx;
} 

let from_array = function(amtx){
  let mtx = new matrix(amtx.length,amtx[0].length);
  for(let i = 0;i<mtx.rows;i++){
    for(let j = 0;j<mtx.cols;j++){
      mtx.set(i,j,amtx[i][j]);
    }
  }
  return mtx;
}

exports.rand = function (rows,cols){
  let mtx = new matrix(rows,cols);
  for(let i = 0;i<rows;i++){
    for(let j = 0;j<cols;j++){
      mtx.set(i,j,Math.random()*2-1);
    }
  }
  return mtx;
}


exports.Dense = function (input_size,output_size,eta,activation,activation_deriv){
  this.activation = activation;
  this.activation_deriv = activation_deriv;
  this.w = exports.rand(input_size,output_size);
  this.b = exports.rand(1,output_size);
  this.wgrad = new matrix(input_size,output_size);
  this.eta = eta;
  this.forward = (x) => {
    this.x = x;
    this.a = elementwise(add(dot(this.x,this.w),this.b),this.activation);
  };
  this.backward = (grad) =>{
    this.sigma = dot(this.w,grad);
    this.grad = mul(grad,transpose(elementwise(this.a,this.activation_deriv)));
    this.wgrad = dot(transpose(this.x),transpose(this.grad));
    this.w = add(this.w,mul(this.wgrad,this.eta));
    this.b = add(this.b,mul(sum((this.grad),1),this.eta));
  }
}
exports.random_permutation = function(arrlen,batch_size){
  let idx = new Array();
  while(batch_size){
    rand = Math.floor(Math.random()*arrlen);
    if(!(rand in idx)){
      idx.push(rand);
      batch_size--;
    }
  }
  return idx;
} 

let random_permutation = function(arrlen,batch_size){
  let idx = new Array();
  while(batch_size){
    rand = Math.floor(Math.random()*arrlen);
    if(!(rand in idx)){
      idx.push(rand);
      batch_size--;
    }
  }
  return idx;
}

exports.from_idx = function (arr,idx){
  let batch = new Array(idx.length);
  for(let i = 0;i<idx.length;i++){
    batch[i] = arr[idx[i]];
  }
  return (batch);
}

let from_idx = function (arr,idx){
  let batch = new Array(idx.length);
  for(let i = 0;i<idx.length;i++){
    batch[i] = arr[idx[i]];
  }
  return (batch);
}

exports.asArray = (mtx) => {
  let arr = new Array();
  for(let i = 0;i<mtx.rows;i++){
    arr.push(new Array());
    for(let j = 0;j<mtx.cols;j++){
      arr[i].push(mtx.get(i,j));
    }
  }
  return arr;
}

let asArray = (mtx) => {
  let arr = new Array();
  for(let i = 0;i<mtx.rows;i++){
    arr.push(new Array());
    for(let j = 0;j<mtx.cols;j++){
      arr[i].push(mtx.get(i,j));
    }
  }
  return arr;
}

exports.Sequential = function (log){
  this.layers = new Array();
  this.log = log;
  this.add = function(layer){
    this.layers.push(layer)
  };
  this.fit = function(x,y,epochs,batch_size){
    for(let epoch = 0;epoch<epochs;epoch++){
      let idx = random_permutation(x.length,batch_size);
      let xbatch = from_array(from_idx(x,idx));
      let ybatch = from_array(from_idx(y,idx));
      for(let i = 0;i < this.layers.length;i++){
        this.layers[i].forward(xbatch);
        xbatch = this.layers[i].a;
      }
      let sigma = transpose(sub(ybatch,xbatch));
      if (this.log == true && (epoch+1) % 100 == 0) console.log(sum(elementwise(sigma,(x)=>{return x**2}),0));
      for(let i = this.layers.length-1;i>-1;i--){
        this.layers[i].backward(sigma);
        sigma = this.layers[i].sigma;
      } 
    }
  };
  this.train_on_batch = function(xbatch,ybatch){
    xbatch = from_array(xbatch);
    ybatch = from_array(ybatch);
    this.layers[0].forward(xbatch);
    for(let i = 1;i < this.layers.length;i++){
        this.layers[i].forward(this.layers[i-1].a);
        xbatch = this.layers[i].a;
    }
    let sigma = transpose(sub(ybatch,this.layers[this.layers.length-1].a));
    for(let i = this.layers.length-1;i>-1;i--){
      this.layers[i].backward(sigma);
      sigma = this.layers[i].sigma;
    }
  };
  this.predict = function(x){
    x = from_array(x);
    for(let i = 0;i<this.layers.length;i++){
      this.layers[i].forward(x);
      x = this.layers[i].a;
    }
    return x;
  };
};


/***/ })
/******/ ]);