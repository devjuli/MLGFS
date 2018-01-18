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
  this.toJson = () =>{
    let json = {};
    json.w = asArray(this.w);
    json.b = asArray(this.b);
    json.eta = this.eta;
    json.activation = this.activation.toString();
    json.activation_deriv = this.activation_deriv.toString();
    return json;
  }

  this.fromJson = (json)=>{
    this.w = exports.from_array(json.w);
    this.b = exports.from_array(json.b);
    this.eta = json.eta;
    eval("this.activation="+json.activation);
    eval("this.activation_deriv="+json.activation_deriv);
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
