
let portrait, dorian;

let captureMode = true;

let tiles = [];
let cycleFrames = 120;
let n = 500;
let step = 5;
let noiseZoom = 300;
let noiseProgRate = 0.01;

let fps = 30;
let capturer;

function preload(){
  portrait = loadImage("Portrait.png");
  dorian = loadImage("Dorian.png");
}


function setup() {
  createCanvas(1080, 1080);
  for(let i = 0; i < width; i+= step){
    for(let j = 0; j < height; j+= step){
      tiles.push(new Tile(i, j, step, step));
    }
  }

  capturer = new CCapture({
    format: 'png',
    framerate: fps
  });
  stroke(255);
  noFill();
}

function draw() {
  background(0);
  if(captureMode && frameCount === 1) capturer.start();

  for(let t of tiles){
    t.update();
    t.show();
  }
  
  if (captureMode && frameCount === 30*40) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  if(captureMode) capturer.capture(document.getElementById('defaultCanvas0'));
  
}


class Tile{
  constructor(x,y,ix, iy){
    this.p = createVector(x,y);
    this.ix = ix;
    this.iy = iy;
    this.noiseVal;
  }
  
  update(){
    this.noiseVal = noise(this.p.x/noiseZoom, this.p.y/noiseZoom, frameCount*noiseProgRate);
  
  }

  show(){
    if(this.noiseVal < 0.5){
      image(dorian,this.p.x, this.p.y, this.ix, this.iy,this.p.x, this.p.y, this.ix, this.iy) 
    } else{
      image(portrait,this.p.x, this.p.y, this.ix, this.iy,this.p.x, this.p.y, this.ix, this.iy);
    };

  }
}
