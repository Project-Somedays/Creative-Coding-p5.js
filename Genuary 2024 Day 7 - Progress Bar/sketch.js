/*
Author: Project Somedays
Date: 2024-01-07
Title: Genuary 2024 Day 7

I guess I woke up and chose violence... Wanted to make the worst progress bar/loading screen...


Combining a few techniques for this one:
 - Perlin noise to get the mozzie movement
 - Getting a target array by looping over all the pink leg pixels in the image
 - Getting what I feel is a very natural progress to the target just be changing the bounding box dimensions
 - Bezier curves for the blood bellies
 - Lerping

Issues:
 - Had to brute force the positioning of the blood belly
 - I got lazy with the vector images and didn't make the bounding boxes the same for all of them so it was tricky to position other elements
 - The actual progress bar is very boring
 - Had myself triggered with the soundtrack hahhaa


*/
// targetcolour = rgb(255, 179, 146);

// leg biz
const legPropofHeight = 1;
let legScale;
let targets = [];


// mossie biz
const maxSpeed = 0.005; // noise progression rate
const minSpeed = 0.003; // noise progression rate
const swarmSize = 30;
let mozzieFlying1, mozzieFlying2, mL;
let mS; // standard scale
let flightPoses = [];
let mozzieDefaultXLimLower;
let mozzieDefaultXLimUpper;
let mozzieDefaultYLimLower;
let mozzieDefaultYLimUpper;
let swarm = [];
const landingDuration = 300;
const defaultFillDuration = 500;
const foregroundProportion = 0.66; // determines how many belong behind the legs
const mozzieShrinkSize = 0.05;
let foregroundMozzies = [];
let backgroundMozzies = [];

// drink cycle variables (multipliers of PI);
const startAngleFrac = 1.06;
const endAngleFrac = 1.3;

// timeline controls
let zoomCntrl = 0;
let loadingSequence = false;
let timelineFrame = 0;
let theChosenOne;
let landingCntrl = 0;
let chosenTarget;
const minFramesBetweenCycles = 300;
const maxFramesBetweenCycles = 800;

// testing
let testMozzie;
let testTarget;
let debugMode = false;

// soundtrack
let isPlaying = true;



// simplifying getting noise values
const getVal = (offset, min, max) => map(noise(offset),0,1,min,max);


function preload(){
  mozzieFlying1 = loadImage("F1.png");
  mozzieFlying2 = loadImage("F2.png");
  mL = loadImage("L1.png");
  legs = loadImage("Legs.png");
  soundtrack = loadSound("soundtrack.mp3");

  // d = mozzieLanding.width * 2;
  flightPoses = [mozzieFlying1, mozzieFlying2];
  
}


function setup() {
  createCanvas(windowHeight, windowHeight);
  
  // basic settings
  imageMode(CENTER);
  pixelDensity(1);
  textAlign(CENTER, CENTER);
  textSize(height/20);
  rectMode(CENTER);

 
   
  
  // setting the leg scale
  legScale = legPropofHeight*height/legs.height;

  // getting our targets
  image(legs, width/2, height/2, legs.width*legScale, legs.height*legScale);  
  getTargets();

  // init mozzie variables 
  mS = 0.5*max(width,height)/mozzieFlying1.width; // setting the scale of the mozzies at max scale
  mozzieDefaultXLimLower = 0;
  mozzieDefaultXLimUpper = width;
  mozzieDefaultYLimLower = 0.25*height; // 
  mozzieDefaultYLimUpper = 1.2*height; // this makes them float around the ankles a little more


  // fill the swarm
  for(let i = 0; i < swarmSize; i++){
    swarm.push(new Mozzie(defaultFillDuration));
  }

  foregroundMozzies = swarm.filter(m => m.isForeground);
  backgroundMozzies = swarm.filter(m => !m.isForeground);

  testMozzie = new Mozzie(width/2, height/2, defaultFillDuration);
  testMozzie.acquireTarget(random(targets));
  
  if(isPlaying) soundtrack.loop();

}

function draw() {
  background(220);

  // always update the swarm
  for(let m of swarm){
    m.update();
  }

  if(debugMode) showTestDebubInfo();
  showScene();
  // normal mode
  if(!loadingSequence){
    // show scene as normal
    
    if(frameCount%(int(random(minFramesBetweenCycles,maxFramesBetweenCycles))) === 0){
      if(debugMode) console.log(`Starting landing sequence`);
      // switch modes
      loadingSequence = true;
      // reset landingCntrl
      landingCntrl = 0; 
      // mark start of timeline
      timelineFrame = 0; 
      // select a foreground mozzie that hasn't already been selected
      theChosenOne = random(foregroundMozzies.filter(m => m.fillProgress < 1));
      // select a target
      chosenTarget = random(targets);
      // feed the chosen mozzie the target
      theChosenOne.acquireTarget(chosenTarget);
      // mark as landing
      theChosenOne.isLanding = true;
    }
  }
  // the timeline
  // start the feeding process at some random frame
 
  if(loadingSequence ){
    // phase 1: landing
    if(timelineFrame <= landingDuration){
      if(landingCntrl <= 1) landingCntrl += 1/landingDuration;
      highlightChosenOne()
    
    // phase 2: filling up
    } else if(timelineFrame <= landingDuration + defaultFillDuration){
      if(debugMode) console.log("Filling up");
      theChosenOne.isFlying = false; // stop the flight
      // hold the zoom in
   
      highlightChosenOne()
      fill(255);
      rect(width/2, height*0.2, mL.width*mS, mL.height*mS);
      theChosenOne.show(mS*10, createVector(width/2, height*0.2)); // draw the enlarged version
      noStroke();
      fill(255,0,0);
      text(str(int(100*theChosenOne.fillProgress)) + "%", width/2, height*0.30);


      // phase 3: taking off again i.e. growing the bounding box to normal size again
    } else if(timelineFrame <= landingDuration + defaultFillDuration + landingDuration){
      if(debugMode) console.log("Taking flight");
      landingCntrl -= 1/landingDuration;
      theChosenOne.isFlying = true;
   
      // exit loading sequence
    } else{
      if(debugMode) console.log("Exiting loading sequence");
      loadingSequence = false;
    }
    
    // advancing the timeline
    timelineFrame ++;
  } 


    // if we've run out of mozzies to fill, reset all the mozzies
    if(foregroundMozzies.filter(m => m.fillProgress < 1).length === 0){
      for(let s of swarm){
        s.fillProgress = 0;
      }
    }
}

function highlightChosenOne(){
  stroke(255, 0, 0);
  noFill();
  strokeWeight(2);
  circle(theChosenOne.p.x, theChosenOne.p.y, width/20);
}

function mousePressed(){
  if(mouseButton === LEFT){
    if(isPlaying){
      soundtrack.stop();
      isPlaying = false;
    } else{
      isPlaying = true;
      soundtrack.loop();
    }

  }
}

function getTargets(){
  loadPixels();
  for(let y = 0; y < height; y++){
    for(let x = 0; x < width; x++){
      let ix = (x + y*width)*4;
      let r = pixels[ix];
      let g = pixels[ix+1];
      let b = pixels[ix+2];
      if(r === 255 && g === 179 && b === 146){
        targets.push(createVector(x,y));
      }
    }
  }
}

function keyPressed(){
  if(key === 'l' || key === 'L'){
    testMozzie.isLanding = !testMozzie.isLanding;
    console.log(`IsLanding = ${testMozzie.isLanding}`);
  }
  if(keyCode === TAB){
    debugMode = !debugMode;
  }
}

function showScene(){
  // background swarm
  for(let m of backgroundMozzies){
    m.show(mozzieShrinkSize);
  }
  
  image(legs, width/2, height/2, legs.width*legScale, legs.height*legScale);

  // foreground swarm
  for(let m of foregroundMozzies){
    m.show(mozzieShrinkSize);
  }

}



