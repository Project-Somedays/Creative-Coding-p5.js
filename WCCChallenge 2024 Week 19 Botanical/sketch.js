/*
Author: Project Somedays
Date: 2024-05-04
Title: #WCCChallenge "Botanical"

Made for Sableraph's weekly creative coding challenges, reviewed Sundays on https://www.twitch.tv/sableraph
Join The Birb's Nest Discord community! https://discord.gg/S8c7qcjw2b

Building off Dan Shiffman's excellent Inverse Kinematics code: https://www.youtube.com/watch?v=hbgDqyy8bIw

Someone mentioned in the stream last week something along the lines of "let's see how the arms are shoe-horned into this next week's topic...". Challenge accepted.

Took the opportunity to learn how to draw splines to get the wibbly-wobbly arms. Kind of hacked my way through though...

*/

const captureMode = false;

const figureeight  = (x, y, a, t, globA) => createVector(x + a*sin(t), y + a*sin(t)*cos(t)).rotate(globA);

const n = 2;

let t;
let handMode = true;
let arm;
let maxLength;
const armSegments = 6;
let arms = [];
let startP, endP, restP;


let phases = {
  MOVE_IN :       {phaseName: "MOVE_IN",        frames: 30},
  ENGAGE_ARMS:    {phaseName: "ENGAGE_ARMS",    frames: 30},
  SIMPLIFY:       {phaseName: "SIMPLIFY",       frames: 60},
  DISENGAGE_ARMS: {phaseName: "DISENGAGE_ARMS", frames: 30},
  MOVE_OUT:       {phaseName: "MOVE_OUT",       frames: 30}
}
let avR;

let phaseOrder; 

// --------------- PUPPETS ------------------ //
let car; 
let head;
let glove;
let gloveSclFactor;
let carSclFactor;
let headSclFactor;
let catInTheHat;

// ---------- CONTROL -------------//
let moveShapeLerpCntrl = 0;
let engageArmsLerpCntrl = 0;
let simplifyLerpCntrl = 0;
let currentFrame = 0;
let currentPhase;
let totalFrames;



let handSize;


// ---------- RECORDING BIZ ------------- //
const fps = 30;
let capturer;
let m;



function preload(){
  glove = loadImage("glove.png");
  head = loadImage("Head.png");
  car = loadImage("Vehicle.png"); 
}


function setup() {
  // createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
   createCanvas(1080, 1080);

  imageMode(CENTER);
  noFill();
  stroke(255);

  maxLength = width/10;
  gloveSclFactor = 0.1*width/glove.width;
  carSclFactor = 0.5*width/car.width;
  headSclFactor = 0.5*width/head.width;
  m = createVector(mouseX, mouseY);
  catInTheHat = new Car(width/2, height/2, carSclFactor, headSclFactor);

  capturer = new CCapture({
    format: 'png',
    framerate: fps
  });

 

	describe("The Cat in the Hat Mobile moves around the canvas planting seeds as it goes");
	
  stroke("#1f6cfe");
  strokeWeight(10);
  



	
}

function draw() {
  background(0);

  if(captureMode && frameCount === 1) capturer.start()
  
  catInTheHat.update();
  catInTheHat.trackArmsToPoints(0);
  catInTheHat.show();
  catInTheHat.trackArmsToPoints([m,m],1);
  
  

  m.set(mouseX-width/2, mouseY-height/2);
  // trackArmsToPoints([m]);

  

	

  if (captureMode && frameCount > 5*totalFrames) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  if(captureMode) capturer.capture(document.getElementById('defaultCanvas0'));
}


class Car{
  constructor(x,y, carScl, headScl){
    this.p = createVector(x,y);
    this.currentP = this.p.copy();
    this.currentRot = 0;
    this.currentHeadRot = 0;
    this.headScl = headScl;
    this.carScl = carScl;
    this.carWidth = car.width*this.carScl;
    this.carHeight = car.height*this.carScl;
    this.headWidth = head.width*this.headScl;
    this.headHeight = head.height*this.headScl;
    this.arms = [];
    
    // place the arms
    this.arms[0] = {layer: 1, arm: new Arm(this.carWidth*-0.3, this.carHeight*0.08, createVector(0,this.carHeight*0.3))};
    this.arms[1] = {layer: 0, arm: new Arm(this.carWidth*0.4, this.carHeight*0.2, createVector(this.carWidth*0.4,this.carHeight*0.2))};
  }

  trackArmsToPoints(){
    // if(targetArr.length !== n) throw Error("Mismatched lengths of arm array and target array");
    push();
    translate(this.p.x, this.p.y);
    for(let i = 0; i < this.arms.length; i++){
      this.arms[i].arm.setTarget(figureeight(0, 0, width/5, frameCount * TWO_PI/120, radians(45)));
      this.arms[i].arm.update();
    }
    pop();
  }

  update(){
    this.currentP.y = this.p.y + map(noise(frameCount/25),0,1,-height/50, height/50);
    this.currentRot =  map(noise(frameCount/50),0,1,0, PI/50);
    this.secRot = map(noise(1000 + frameCount/100),0,1,-PI/12, PI/12);
  }

  showArms(layer){
    let currentArms = this.arms.filter(a => a.layer === layer);
    for(let a of currentArms){
      a.arm.show();
    }
  }
 

  show(){
    push();
    translate(this.currentP.x, this.currentP.y);
    
    
    rotate(this.currentRot);
    push();
    translate(-this.carWidth*.08, - this.carHeight/4); // locate the head
    rotate(this.secRot); // draw rthe head
    image(head, 0, 0, this.headWidth, this.headHeight);
    
    pop();
    this.showArms(0);
    image(car, 0, 0, this.carWidth, this.carHeight);
    
    this.showArms(1);
    pop();
  }
}



  // ------------------- RETARGET ALL ARMS --------------------- //

  


// ----------- WHICH PHASE WE IN? --------------- //
function getCurrentPhase(currentFrame){
  // gets the smallest phase greater than currentFrame
  let cumulativeFrames = phaseOrder.map(e => e.cumulativeFrames);
  for(let i = 0; i < cumulativeFrames.length; i++){
    if(currentFrame < cumulativeFrames[i]) return phaseOrder[i];
  }
}

// ----------- GET CUMULATIVE FRAMES --------------- //
function calculateCumulativeFrames(phaseOrder){
  for(let i = 0; i < phaseOrder.length; i++){
    // console.log
    let frameArray = phaseOrder.map(e => e.frames).slice(0,i+1);
    let total = frameArray.length > 0 ? frameArray.reduce((a,b) => a + b) : phaseOrder[0].frames;
    
    phaseOrder[i]["cumulativeFrames"] = total;
    // console.log(`frameArray: ${frameArray}, total: ${total}`);
    // phaseOrder[i]["cumulativeFrames"] = phaseOrder.slice(0,i).reduce((accumulator, currentValue) => a + b.frames);
  }
  // console.log(phaseOrder);
}



function easeInOutSine(x) {
  return 0.5*(cos(PI*x) + 1);
  }

function keyPressed(){
  if(key === ' ') handMode = !handMode;
}