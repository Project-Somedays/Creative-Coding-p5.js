let hWord = "ASCII";
let vWord = "A\nS\nC\nI\nI";
let src;
let letters = [];
let sampleEvery;
let bang;
let g;
let tSize;
const G = 10;
let locs = [];
let F = 100;
const tProgress = 0.1;
let isExplosion = false
const timeStep = 0.1;
let triggerPoint;
const margin = 0.1;
const maxDelay = 100;
let startFrame = 0;
const framesToAppear = 200;
// bit of trial and error to get this to appear properly on the screen
const robotSpeed = 20;
let robot;
const standardTextSizeProportion = 1/30;
let progress = 0;
const closeEnough = 0.01;
let robotString = String.raw` 
   ____          ____
  |oooo|        |oooo|
  |oooo| .----. |oooo|
  |Oooo|/\_||_/\|oooO|
  '----' / __ \ '----'
   ,/ |#|/\/__\/\|#| \,
   /  \|#|| |/\| ||#|/  \
  / \_/|_|| |/\| ||_|\_/ \
 |_\/    o\=----=/o    \/_|
 <_>      |=\__/=|      <_>
 <_>      |------|      <_>
 | |   ___|======|___   | |
 //\\  / |O|======|O| \  //\\
 |  |  | |O+------+O| |  |  |
 |\/|  \_+/        \+_/  |\/|
 \__/  _|||        |||_  \__/
  | ||        || |
  [==|]        [|==]
  [===]        [===]
  >_<          >_<
  || ||        || ||
  || ||        || ||
      || ||        || ||    
   _|\_/|__    __|\_/|__
   /___n_n___\  /___n_n___\
`



function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  // setting gravity
  g = createVector(0, G);

  // make a new trigger point to set the offsets for all the
  triggerPoint = createVector(random(margin*width, (1-margin)*width), random(margin*height, (1-margin)*height));
  
  // generating image
  src = createGraphics(width, height);
  src.background(0);
  src.fill(255);
  src.noStroke();
  src.textAlign(CENTER, CENTER);
  tSize = width > height ? height/1.75 : height/6; // changing the vertical/horizontal text
  textFont('Courier New', tSize*2);
  src.textSize(tSize);
  src.textLeading(tSize);
  sampleEvery = int(tSize / 50);
  if(width > height){
    src.text(hWord, width/2, height/2);
  } else{
    src.text(vWord, width/2, height/2);
  }

  // sampling from src
  src.loadPixels();
  sampleSource();

fill(255);

// choose target thing
robot = new Robot(-robotSpeed*framesToAppear*1.5, height/2);
// robot.start();
  
}

function draw() {
  background(0);
  
  // textSize(sampleEvery*8);


  // spawn in letters
  // for(let l of letters){
  //   l.applyForce(g)
  //   l.update();
  //   l.show();
  // }

 
  
  // background(0);
  
  // textSize(sampleEvery);
  
  textSize(tSize*standardTextSizeProportion);
  for(let l of letters){
    l.applyForce(g)
    l.update();
    l.show();
  }

  robot.update();
  robot.show();

  for(let l of letters){
    if(abs(l.p.x - robot.p.x) < closeEnough*width){
      l.applyForce(p5.Vector.fromAngle(-PI/6, 0).setMag(100));;
    }
  }
  
  
  // image(src, 0,0);
}

class Robot{
  constructor(x,y){
    this.p = createVector(x,y);
    this.v = createVector(robotSpeed,0);
  }
  
  restart(x,y){
    this.p.set(x,y);
  }

  update(){
    this.p.add(this.v);
  }

  show(){
    textSize(tSize*standardTextSizeProportion);
    text(robotString, this.p.x, this.p.y);
  }
}

class Letter{
  constructor(x,y,t){
    let a = random(TAU);
    this.target = createVector(x,y);
    // this.start = createVector(sqrt(2)*max(width, height)*cos(a),sqrt(2)*max(width,height)*sin(a)); // a randomPoint outside the screen
    this.start = createVector(random(width), random(height));
    this.p = createVector(x,y);
    this.v = createVector(0,0);
    this.a = createVector(0,0);
    this.t = t;
    this.cntrl = 0;
    this.progress = 0;
    this.isFixed = true;
    this.fixForce = G*1.1;
    this.d = p5.Vector.dist(triggerPoint, this.p);
    // this.delay = map(this.d, 0, max(width, height)*sqrt(2),0,maxDelay);
    this.delay = random(maxDelay);
   
  }

  applyForce(f){
    if(this.isFixed){
      if(f.mag() < this.fixForce) return;
      this.isFixed = false;
    }
    this.isFixed = false;
    this.a.add(f);

  }

  update(){
    
    if(frameCount - startFrame > this.delay){
      this.cntrl = min((frameCount + this.delay - startFrame)/framesToAppear,1); // limits x to between 0 and 1
      this.progress = easeInOutSine(this.cntrl);
      this.p.x = lerp(this.start.x, this.target.x, this.progress);
      this.p.y = lerp(this.start.y, this.target.y, this.progress);
    }
    if(this.isFixed) return;
    // else
    this.v.add(this.a);
    this.p.add(this.v);
    this.a.set(0,0);
  }

  show(){
    // things cloests to the trigger point get delayed the least
    push();
      translate(this.p.x, this.p.y);
      scale(this.size);
      textSize(tSize*standardTextSizeProportion);
      text(this.t, 0, 0);
    pop();
    
  }
}

// source: https://easings.net/#easeOutBack
function easeOutBack(x){
  const c1 = 1.70158;
  const c3 = c1 + 1;
  
  return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
}

// source: https://easings.net/#easeInOutSine
function easeInOutSine(x){
  return -(Math.cos(Math.PI * x) - 1) / 2;
  }


function sampleSource(){
  for(let y = 0; y < src.height; y += sampleEvery){
    for(let x = 0; x < src.width; x += sampleEvery){
      let index = (x + y*src.width)*4;
      if(src.pixels[index] === 255 && src.pixels[index+1] === 255 && src.pixels[index+2] === 255){
        letters.push(new Letter(x,y,random(["A","S","C","I","I"])));
        locs.push(createVector(x,y));
      }
    }
  }
}


/*
First version: I was going to explode the things

function mousePressed(){
  if(mouseButton === LEFT){
    isExplosion = true;
    console.log(`Explosion = ${isExplosion}`);
    bang = new Explosion(frameCount, mouseX, mouseY, 4, 0.2);
    // applyBangForce(mouseX, mouseY);
  }
}

function applyBangForce(x,y, extF){
  let epicentre = createVector(x,y);
  for(let l of letters){
    let f = p5.Vector.sub(l.p, epicentre);
    let d = p5.Vector.dist(l.p, epicentre);
    let magnitude = extF/d;//map(d, 0, width, 10, G);
    l.applyForce(f.setMag(magnitude));
  }
}

class Explosion{
  constructor(initFrame, x,y, peak, decay){
    this.t_0 = initFrame
    this.p = createVector(x,y);
    this.peak = peak;
    this.decay = decay;
    
  }

  getForce(){
    let t = (frameCount - this.t_0)*timeStep;
    return this.peak*(1-t*this.decayRate)*exp(-this.decayRate*t);
  }


}

*/