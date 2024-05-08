
let portrait, dorian;

let movers = [];
let cycleFrames = 120;
let n = 500;

function preload(){
  portrait = loadImage("Portrait.png");
  dorian = loadImage("Dorian.png");
}


function setup() {
  createCanvas(1080, 1080);
  for(let i = 0; i < n; i++){
    // movers.push(new Mover(0,i*height/n, 0.5*width*((sin(i*PI/n)+ 1)), 5*height/n, i*TWO_PI/n, 'sine'));
    movers.push(new Mover(0,i*height/n, width/4, 10*height/n, i*TWO_PI/n, 'sine'));
    // movers.push(new Mover(0,i*height/n, width/4, 5*height/n, i*TWO_PI/n, 'cos'));
  }
  stroke(255);
  noFill();
}

function draw() {
  background(0);

  for(let m of movers){
    m.update();
    m.show();
  }
  
  
  
}


class Mover{
  constructor(x,y,ix, iy, offset, cycleFunction){
    this.p = createVector(x,y);
    // this.v = createVector(5,0);//p5.Vector.random2D();
    this.ix = ix;
    this.iy = iy;
    this.offset = offset;
    this.prevx = 0;
    this.cycleFunction = cycleFunction;
  }
  
  update(){
    this.prevx = this.p.x;
    this.p.x = this.cycleFunction === 'sine' ? sinecycle(this.offset) : reversecycle(this.offset);//width/2 + 0.5*width*sin(this.offset + TWO_PI/cycleFrames*frameCount);
    
    // this.p.add(this.v);
    // if(this.p.x >= width - this.ix || this.p.x <= 0) this.v.x = -this.v.x;
    // if(this.p.y >= height - this.ix || this.p.x <= 0) this.v.y = -this.v.y;
  }

  show(){
    // if(this.v.x > 0) image(dorian,this.p.x, this.p.y, this.ix, this.iy,this.p.x, this.p.y, this.ix, this.iy);
    // if(this.v.x < 0) image(portrait,this.p.x, this.p.y, this.ix, this.iy,this.p.x, this.p.y, this.ix, this.iy);
    if(this.p.x < this.prevx){
      image(dorian,this.p.x, this.p.y, this.ix, this.iy,this.p.x, this.p.y, this.ix, this.iy) 
    } else{
      image(portrait,this.p.x, this.p.y, this.ix, this.iy,this.p.x, this.p.y, this.ix, this.iy);
    };

    // square(this.p.x, this.p.y, this.s);
  }
}

const sinecycle = (offset) =>  width/2 + 0.5*width*sin(offset + TWO_PI/cycleFrames*frameCount);
const reversecycle = (offset) => width/2 + 0.5*width*sin(2*offset + TWO_PI/cycleFrames*frameCount);
