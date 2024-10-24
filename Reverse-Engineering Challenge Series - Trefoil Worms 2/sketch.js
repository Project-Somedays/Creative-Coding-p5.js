/*
Author: Project Somedays
Date: 2024-10-25
Title: Reverse-Engineering Challenge Series - Trefoil Worms 2

Still riffing on this neat tweet: https://x.com/Yann_LeGall/status/1834456897602060428
*/

let gui, params;
let segments = [];
let palette  = "#f72585, #b5179e, #7209b7, #560bad, #480ca8, #3a0ca3, #3f37c9, #4361ee, #4895ef, #4cc9f0".split(", ");

function setup() {
  // createCanvas(600, 600, WEBGL);
  createCanvas(min(windowWidth, windowHeight),min(windowWidth, windowHeight), WEBGL);
  frameRate(60);
  noStroke();

  gui = new lil.GUI();
  params = {
    scl: width/10,
    aDiff: PI/3,
    transitionFrames: 120,
    rotationFrames: 600,
    rotateMode: true,
    segRMin : width/50,
    segRMax : width/3
  }

  gui.add(params, 'scl', width/100, width);
	gui.add(params, 'aDiff', PI/12, HALF_PI);
  gui.add(params, 'transitionFrames', 30, 300, 1);
  gui.add(params, 'rotationFrames', 30, 1200, 1);
  gui.add(params, 'rotateMode');
  gui.add(params, 'segRMin', width/100, width/25);
  gui.add(params, 'segRMax', width/25, width);

  //set up worms
  for(let i = 0; i < 10; i++){ // per worm, setting up angular position and timing offsets
    let aOffset = i*PI/5;
    let tOffset = 2*i;
    for(let j = 0; j < palette.length; j++){ // per segment, setting colour and internal worm timing offsets
      segments.push(new Segment(-j*0.25*(PI/3)/10 + aOffset, j + tOffset, palette[j]));
    }
  }
  
}

function draw() {
  background(0);
  
  
  pointLight(255, 255, 255, 0, 0, 0);
  directionalLight(255, 255, 255, 0.5, 0.5, 0);
  directionalLight(255, 255, 255, 0.5, -0.5, 0);
  directionalLight(255, 255, 255, -0.5, 0.5, 0);
  directionalLight(255, 255, 255, -0.5, -0.5, 0);
  directionalLight(255, 255, 255, 0,0,1);

  push();
  if(params.rotateMode) rotateY(frameCount * TWO_PI/params.rotationFrames);
  for(let segment of segments){
    segment.update();
    segment.show();
  }
  pop();
  
  orbitControl();

}

class Segment{
  constructor(aStart, delay, colour){
    this.aStart = aStart;
    this.delay = delay;
    this.aEnd = aStart+params.aDiff;
    this.progress = 0;
    this.a = 0;
    this.r = 0;
    this.colour = colour;
    this.p = createVector();
  }
  
  update(){
    // this.progress = max(frameCount%(transitionFrames+1) - this.delay, 0)/transitionFrames;
    this.progress = max((frameCount - this.delay)%(params.transitionFrames+1) / params.transitionFrames,0 );
    this.a = map(easeInOutElastic(this.progress), 0, 1, this.aStart, this.aEnd);
    
    if(this.progress >= 1){
      this.aStart += params.aDiff;
      this.aEnd += params.aDiff;
      this.progress = 0;
    }
    
    this.r = map((this.progress-0.5)**4, 0, 0.5, params.segRMin, params.segRMax);
    this.p = trefoil(this.a).mult(params.scl);
  }
  
  show(){
    push();
    translate(this.p.x, this.p.y, this.p.z);
    fill(this.colour);
    sphere(this.r);
    pop();
  }
  
  
}

function easeInOutElastic(x){
const c5 = TWO_PI / 4.5;

return x === 0
  ? 0
  : x === 1
  ? 1
  : x < 0.5
  ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
  : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
}

function trefoil(t){
        let x = sin(t) + 2*sin(2*t);
        let y = cos(t) - 2*cos(2*t);
        let z = -sin(3*t);
        return createVector(x,y,z);
    }