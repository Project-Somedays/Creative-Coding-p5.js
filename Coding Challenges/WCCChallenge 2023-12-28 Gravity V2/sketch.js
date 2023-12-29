/*
Author: Project Somedays
Date: 2023-12-28

WCCChallenge Gravity: Entry 2

I wanted to visualise loads of possible trajectories for a body given a starting position and a velocity
Inspired by all those navigation scenes in The Expanse
And Gravity Sims which are fun

Interaction:
Press e to toggle editMode
In editMode:
 - Add Sun: Left Click
 - Remove Sun: Double Click
 - Increase Sun Size: UP_ARROW
 - Decrease Sun Size: DOWN_ARROW
Outside editMode:
 - Increase the spread of the initial velocities: UP_ARROW
 - Decrease the spread of the initial velocities: DOWN_ARROW
 - Rotate initial velocities anti-clockwise: LEFT_ARROW
 - Rotate intial velocities clockwise: RIGHT_ARROW

*/

let predictSteps = 10000;
let velStep = 1;
const G = 40;
let sunSize;
let m;
let traceShower;
let sliderTraceLength;

let defaultSunSize; // proportional to the screen
let initialAngle = 0;

const colours = ["#d9ed92","#b5e48c","#99d98c","#76c893","#52b69a","#34a0a4","#168aad","#1a759f","#1e6091","#184e77"];
let suns = [];
let velocities = [];


let editMode = false;



function setup() {
  createCanvas(windowWidth, windowHeight);
  m = createVector(mouseX, mouseY);
  defaultSunSize = max(width, height)/20;
  velocities = [];
  for(let i = 0; i < colours.length; i++){
    velocities.push(p5.Vector.fromAngle(initialAngle).setMag(i*velStep));
  }
  sunSize = defaultSunSize;
  suns.push(new Sun(width/2, height/2, defaultSunSize));
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);

  sliderTraceLength = createSlider(1,20000, 10000, 1).position(width/2 - 0.4*width, 60).size(0.8*width);
  
  
  
}

function draw() {
  background(0);
  sliderTraceLength.hide();
  predictSteps = sliderTraceLength.value();
  m.set(mouseX, mouseY);
  
  if(editMode){
    sliderTraceLength.show();
    text(`Trace trajectory ${predictSteps} steps out`, width/2, 100);
    fill(255, 255, 0);
    circle(m.x, m.y, sunSize);
    fill(255);
    text("EDIT MODE", width/2, 40);
    for(let sun of suns){
      sun.show();
    }
    return;
  }
  
  traceShower = new Predictor(m.x, m.y);
  traceShower.update();
  traceShower.show();

  for(let sun of suns){
    sun.show();
  }
  
  
}



function mousePressed(){
  if(!editMode){
    return;
  }
  
  // if in editMode
  if(mouseButton == LEFT){
    suns.push(new Sun(m.x, m.y, sunSize));
  }
  
}

function doubleClicked(){
  if(!editMode){
    return;
  }
  
  // if in editMode
  if(mouseButton == LEFT){
    for(let i = suns.length - 1; i >= 0; i--){
      if(p5.Vector.dist(suns[i].p, m) < suns[i].s/2){ // if m is within the sun
        suns.splice(i,1);
      }
    }
  }
 
  
}

function keyPressed(){
  if(key === 'e'){
    editMode = !editMode;
  }

  if(editMode){
    if(keyCode === UP_ARROW){
      sunSize += 0.01*min(width, height);
      console.log(`New Sun Size: ${sunSize}`);
    }
    if(keyCode === DOWN_ARROW){
      sunSize -= 0.01*min(width, height);
      console.log(`New Sun Size: ${sunSize}`);
    }
  } else{ // if NOT editMode
    if(keyCode === UP_ARROW){
      velStep += 0.5;
      console.log(`New Velocity Step: ${velStep}`);
    }
    if(keyCode === DOWN_ARROW){
      velStep -= 0.5;
      console.log(`Velocity Step: ${velStep}`);
    }
    if(keyCode === LEFT_ARROW){
      initialAngle -= radians(2)
      console.log(`New Initial Angle: ${degrees(initialAngle)}`);
    }
    if(keyCode == RIGHT_ARROW){
      initialAngle += radians(2)
      console.log(`New Initial Angle: ${degrees(initialAngle)}`);
    }
  }
  
}



