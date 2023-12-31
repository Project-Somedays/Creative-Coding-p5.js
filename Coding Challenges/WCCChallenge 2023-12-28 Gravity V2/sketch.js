/*
Author: Project Somedays
Date: 2023-12-28

WCCChallenge Gravity: Entry 2

Visualising lots of possible trajectories depending on initial velocities and relative masses of suns

Interaction:
Press e to toggle editMode
In editMode:
 - Toggle between config settings and placing suns: 's'
 - Add Sun: Left Click
 - Remove Sun: Double Click
Outside editMode:
 - Press t to cycle through all the different traces/all

Stretch goals
 - 3D implementation
 - Set the initial velocities and angles with a slider. Tried, but Grav forces massively outweighed any effect.
 - Toggle between different paths one at a time and THEN all?
*/

const G = 40; // Gravitational constant
let predictSteps = 10000;
let textSizeDefault; // set to a proportion of the screen
let velStep = 1;

let sunSize;
let sunMass;
let m;
let traceShower;
let sliderTraceLength;
let sliderSunSize;
let sliderSunMass;
let sliderStart;

let defaultSunSize; // proportional to the screen
let initialAngle = 0;

const colours = ["#d9ed92","#b5e48c","#99d98c","#76c893","#52b69a","#34a0a4","#168aad","#1a759f","#1e6091","#184e77"].reverse();
let suns = [];
let velocities = [];
let defaultSunMass = 1;


let editMode = false;
let placeSunMode = true;
let configMode = true;
let currentTrace = colours.length;



function setup() {
  createCanvas(windowWidth, windowHeight);
  m = createVector(mouseX, mouseY);
  sliderXPos = 0.05*width;
  defaultSunSize = max(width, height)/20;
  textSizeDefault = max(10, height/40);
  velocities = [];
  for(let i = 0; i < colours.length; i++){
    velocities.push(p5.Vector.fromAngle(initialAngle).setMag(i*velStep));
  }
  sunSize = defaultSunSize;
  sunMass = defaultSunMass;
  suns.push(new Sun(width/2, height/2, defaultSunSize, defaultSunMass));
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(textSizeDefault);

  // making sliders
  sliderTraceLength = createSlider(1,20000, 10000, 1).position(sliderXPos, 0.25*height).size(0.8*width);
  sliderSunSize = createSlider(0.01, 2, 1, 0).position(sliderXPos, 0.4*height).size(width/2);
  sliderSunMass = createSlider(0.01, 2, 1, 0).position(sliderXPos, 0.6*height).size(width/2);


}

function draw() {
  background(0);
  // hide the sliders
  sliderTraceLength.hide();
  sliderSunSize.hide();
  sliderSunMass.hide();
  
  // set the values based on the sliders
  predictSteps = sliderTraceLength.value();
  sunSize = sliderSunSize.value();
  sunMass = sliderSunMass.value();

  // update mousePos
  m.set(mouseX, mouseY);
  
  if(editMode){
    fill(255);
    text("EDIT MODE\nPress 's' to switch between placing suns/changing config settings.\nLeft Click to place sun with current config.\nDouble-click to remove.",sliderXPos, 0.1*height);
    
    if(!placeSunMode){
      // show the 
      sliderTraceLength.show();
      sliderSunSize.show();
      sliderSunMass.show();

      text(`Trace trajectory ${predictSteps} steps out`,sliderXPos, 0.25*height-textSizeDefault);
      text(`Current Sun Size: ${sunSize*defaultSunSize}`,sliderXPos, 0.4*height-textSizeDefault);
      text(`Current Sun Mass Multiplier: ${sunMass}`, sliderXPos, 0.6*height-textSizeDefault);
    } else {
      for(let sun of suns){
        sun.show();
        fill(255);
        textAlign(LEFT);
        text(`Mass: ${sun.mass}\nRadius: ${sun.s/2}`, sun.p.x + sun.s/2, sun.p.y);
      }

    }
    
    // showing a preview of the new sun
    fill(255, 255, 0);
    circle(m.x, m.y, sunSize*defaultSunSize);
  
    return;
  }
  
  traceShower = new Predictor(m.x, m.y);
  traceShower.update();
  traceShower.show(currentTrace);

  for(let sun of suns){
    sun.show();
  }
}



function mousePressed(){
  if(!editMode){
    return;
  }
  
  // if in editMode
  if(mouseButton == LEFT && placeSunMode){
    suns.push(new Sun(m.x, m.y, sunSize*defaultSunSize, sunMass));
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
  if(key === 's'){
    placeSunMode = !placeSunMode;
  }
  if(key == 't'){
    currentTrace = (currentTrace + 1)%(colours.length + 1); // 0 to colours.length + 1
    console.log(`Current trace: ${currentTrace}`);
  }
  
}



