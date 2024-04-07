/*
Author: Project Somedays
Date: 2024-04-07
Title: Reverse-Engineering Challenge Series

@gandyworks did it live with a plotter, but I loved the effect: https://www.instagram.com/reel/C4v8j2NR41s/?igsh=ZnhheTVhNGVlM2M3

Substeps necessary to account for the increasing radius. I guess I could make this dynamic, but that's for another iteration.


SPIRAL FUNCTIONS: https://www.wolframalpha.com/input?i=spiral
Note: some spiral functions don't use the b parameter, but I'm trying to set it up so that I can choose a random one
Doesn't hurt? Not sure how this *should* be done in javascript...
Basically what I want is a generic/abstract callable in python


TODO/Opportunities:
- Make a sandbox mode with a nice UI to set variables
- Speedramping?
*/

const circleInvolute = (a,b,t) => createVector(a * (t * sin(t) + cos(t)), a * (sin(t) - t * cos(t)));

const archimedesSpiral = (a,b,t) => createVector(a*cos(t)*(t)**(1/b),a*sin(t)*(t)**(1/b));

const dopplerSpiral = (a,b,t) => createVector(a*(b * t + t * cos(t)), a * t * sin(t));

const fermatSpiral = (a, b, t) => createVector(a * sqrt(t) * cos(t), a * sqrt(t) * sin(t));

const logarithmicSpiral = (a, b, t) => createVector(a*exp(b * t)*cos(t), a * exp(b * t) * sin(t));

const cycleFrames = 1500;
let centrePoint;
let r, R;
let t;

// for changing the biz
let xOff, yOff;
let noiseR;
let dl;
// let transitionLayer;
let a;
let chosenSpiral;
let globalZoom;
const opacity = 100; // set out of 100 for HSB mode
const substeps = 10; // could be effectively speed ramped? Something to try

let axisNoiseProgressionRate
let rotationNoiseProgressionRate;
let zoomCycleRate = 5; // relative to overall progression, larger = slower


let ix = 0; // for manually overriding spiral choice
let profileGrowMode;
let coloursMode;
let colourOffsetMultiplier; // should colour changes lead or lag?

let focalPt;

function setup() {
  createCanvas(1080, 1080);
  // createCanvas(windowWidth, windowHeight);
  background(0);
  focalPt = createVector(0,0);
 
  // not all spirals work with the same parameters so I mucked around until I found ones that kind of worked
  spiralChoices = [{ 
    fn : circleInvolute,
    a : 15,
    b : 2,
    name: "Circle involute: something to do with profiles of gears"
  }, 
  {
    fn: archimedesSpiral,
    a: 10,
    b: 1,
    name: "Archimedes Spiral: Constant spacing"
  }, 
  {
    fn: dopplerSpiral,
    a: 10,
    b: 0.5,
    name: "Doppler Spiral: moves across the screen over time"
  }, {
    fn: fermatSpiral,
    a: 50,
    b: 1,
    name: "Fermat Spiral: converges over time"
  }, 
  {
    fn: logarithmicSpiral,
    a: 5,
    b: 0.2,
    name: "Logarithmic Spiral: diverges over time"
  }];
  
  chosenSpiral = {
    fn: dopplerSpiral,
    a: 10,
    b: 0.5,
    name: "Doppler Spiral: moves across the screen over time"
  };//random(spiralChoices);
  console.log(chosenSpiral.name);
  
  // choosing modes
  colourOffsetMultiplier = random(0.8,1.2); // should the colour cycle lead or lag?
  profileGrowMode = false; //random() < 0.5;
  coloursMode = random() < 0.5;
  console.log(`Profile Grow Mode: ${profileGrowMode}`);

  // setting up the draw layer
  dl = createGraphics(2*width, 2*height);
  dl.colorMode(HSB, 360, 100, 100, 100)
  dl.background(0);
  dl.rectMode(CENTER);
  dl.noFill();
  dl.stroke(255);

  // preparing to draw the drawLayer to the canvas
  centrePoint = createVector(width/2, height/2);
  imageMode(CENTER);

  // setting r by profileGrowMode
  r = profileGrowMode ? 1 : min(width,height)/random(5,20);
  
  // noiseValues
  xOff = random(1000);
  yOff = random(1000);
  
  t = 0; // why use t instead of frameCount? I find it easier to think of frameCount as a continual progression and a user-made variable to denote looping
  
  // noise settings
  axisNoiseProgressionRate = random(100, 300);
  rotationNoiseProgressionRate = random(50, 150 );
  noiseR = random(0,2); // if you want repeating noise, determines the roughness
  
  

  describe("A spiral erupts out of the end point over time. Randomly selected type of spiral: some converge, some diverge, some precesss... Rotating square profile to add a bit of variability. Global zoom in and out sinusoidally.");
  
}

function draw() {
  if(coloursMode){
    dl.stroke(0,0,100, opacity/3);
  } else{
    dl.stroke(degrees(colourOffsetMultiplier*t%TWO_PI), 100, 100, opacity);
  }
  
  for(let i = 0; i < substeps; i++){
    // in case you want a perfect loop...
    // let yAxis = r*noise(yOff + noiseR*cos(t), yOff + noiseR*sin(t));
    // let xAxis = r*noise(xOff + noiseR*cos(t), xOff + noiseR*sin(t));
    let xAxis = r*noise(xOff + frameCount/axisNoiseProgressionRate);
    let yAxis = r*noise(yOff + frameCount/axisNoiseProgressionRate);
    let rotA = map(noise(frameCount/rotationNoiseProgressionRate),0,1,-TWO_PI, TWO_PI);

    focalPt = drawSpiralStep(dl, chosenSpiral, 0.5*dl.width, 0.5*dl.height, xAxis, yAxis, rotA, t);
    // what is the difference between 
    focalPt.add(p5.Vector.sub(centrePoint, focalPt));
    // drawSpiralStep(dl, chosenSpiral, 0.55*dl.width, 0.55*dl.height, xAxis, yAxis, rotA, t + HALF_PI);

    
    t += TWO_PI/cycleFrames;
    if(profileGrowMode){
      r += 1/(0.05*cycleFrames);
    }
    
  }
  
  // draw the drawlayer
  push();
    translate(focalPt.x, focalPt.y)
    // scale(globalZoom);
    // rotate(-t*0.25);
    image(dl,0,0);
  pop();
  
  
  // globalZoom = 0.75 + 0.25*(1+cos(HALF_PI + t/zoomCycleRate));
}

function drawSpiralStep(layer, spiralObject, cx, cy, xAxis, yAxis, rotA, t){
  layer.push();
  let drawPoint = spiralObject.fn(spiralObject.a,spiralObject.b, t, xAxis, yAxis, rotA);
  layer.translate(cx + drawPoint.x, cy + drawPoint.y);
  layer.rotate(t + rotA);
  layer.rect(0,0,xAxis, yAxis);  
  layer.pop();
  return drawPoint;
}


function mousePressed(){
  if(mouseButton === LEFT){
    setup();
  }
}

function keyPressed(){
  if(keyCode === UP_ARROW){
    dl.background(0);
    ix = (ix + 1)%spiralChoices.length;
    chosenSpiral = spiralChoices[ix];
    t = 0;
    console.log(chosenSpiral.name);
  }
}