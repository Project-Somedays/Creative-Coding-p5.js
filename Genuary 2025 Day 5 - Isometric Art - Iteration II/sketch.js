/*
Author: Project Somedays
Date: 2025-05-05
Title: Genuary 2025 Day 5 - Isomorphic Art - Iteration 1

Keeping it dead simple - simplex noise for an evolving landscape and perlin noise to set the threshold value
Trying hard to remember the get-it-done mantra: "A project is never truly finished, only released"

Opportunities:
- Map the globe on the outside
- lil-gui controls
*/

const n = 70;
let w;
let noiseZoom = 2700;
const noiseProgRate = 1;
let colourA;
let colourB;
let simplex;
let rotationRate = 300;
const thresholdRate = 0.03;
let rotateMode = true;
let cloudLimit = 0.925;
let landUpperLimit = 0.80;
let landLowerLimit = 0.65;

let oceanUpperLimit = 0.35;
let showLines = false;

let boxes = [];

const densityMultiplier = {
  "cloud" : 0.75,
  "land" : 1, 
  "ocean" : 1.5
}


function setup(){
  createCanvas(1080, 1080, WEBGL);
  noStroke();
  frameRate(30);
  pixelDensity(1);
  w = 0.75*min(width, height) / n;
  ortho();
  simplex = new SimplexNoise();

  for(let y = 0; y < n; y++){
    for(let x = 0; x < n; x++){
      for(let z = 0; z < n; z++){
        let p = createVector(-0.5*w*n + x*w, -0.5*w*n + y*w, -0.5*w*n + z*w);
        let normD = dist(p.x, p.y, p.z, 0, 0, 0)/(0.5*w*n); // normalise to between 0 and 1
        let terrain = classifyTerrain(normD);
        let depth;
        let colourA, colourB;
        if(terrain === "excluded") continue; // skip excluded zones
        switch(terrain){
          case "cloud":
            colourB = color(255, 255, 255); // rgb(255, 255, 255);
            colourA = color(225, 225, 225); // rgb(225, 225, 225);
            depth = map(normD, cloudLimit, 1, 0, 1);
            break;
          case "land":
            colourB = color(100, 209, 0); // rgb(100, 209, 0);
            colourA = color(77, 54, 39); // rgb(77, 54, 39)
            depth = map(normD, landLowerLimit, landUpperLimit, 0, 1); // how far into the current band are?
            break;
          case "ocean":
            colourB = color(0, 51, 70); // rgb(0, 51, 70);
            colourA = color(255, 0, 0); // rgb(255, 0, 0);
            depth = map(normD, 0, oceanUpperLimit, 0, 1);  // how far into the current band are?
            break;
          default:
            colourB = color(255);
            colourA = color(0);
            break;
        }
        
        
          let col = lerpColor(colourB, colourA, 1- depth**2); // get deep quicker
          if(terrain === "ocean") col = lerpTriColor(1-depth**2, 0.4);
          boxes.push({p, col, terrain});
        }
      }
    }

  noCursor();
 
}

function draw() {
  background(0);
  noStroke();
  if(showLines) stroke(0);

  if(rotateMode){
    rotateX(-frameCount*TWO_PI/rotationRate);
    rotateY(frameCount*TWO_PI/rotationRate);
    rotateZ(-frameCount*TWO_PI/rotationRate);
  }
  
 
  
 for(let b of boxes){
  // let noiseVal = noise(b.p.x*w/noiseZoom + frameCount*noiseProgRate, b.p.y*w/noiseZoom, b.p.z*w/noiseZoom);
  let noiseVal = 0.5*(simplex.noise4D(b.p.x*w/noiseZoom, b.p.y*w/noiseZoom, b.p.z*w/noiseZoom, frameCount*noiseProgRate + b.threshold === "cloud" ? 10000 : 0)+1);
  let threshold = map(noise(frameCount * thresholdRate), 0, 1, 0.25, 0.4) * densityMultiplier[b.terrain];
  if(noiseVal > threshold) continue;
  
  fill(b.col);
  push();
  translate(b.p.x, b.p.y, b.p.z);
  box(w, w, w);
  
  pop();
 }

  

  orbitControl();
}

function doubleClicked() {
  rotateMode = !rotateMode;
}

function keyPressed(){
  if(key === ' ') showLines = !showLines;
}

function classifyTerrain(normD) {
  // Check excluded conditions first
  if (normD > 1 || 
      (normD < cloudLimit && normD > landUpperLimit) || 
      (normD < landLowerLimit && normD > oceanUpperLimit)) {
      return "excluded";
  }
  
  // Check cloud condition
  if (normD <= 1 && normD >= cloudLimit) {
      return "cloud";
  }
  
  // Check land condition
  if (normD >= landLowerLimit && normD <= landUpperLimit) {
      return "land";
  }
  
  // Check ocean condition
  if (normD <= oceanUpperLimit) {
      return "ocean";
  }
  
  // If none of the above conditions are met
  return "excluded";
}

function lerpTriColor(value, transitionPoint) {
  // Ensure value is between 0 and 1
  value = Math.max(0, Math.min(1, value));
  
  // Define colors in RGB
  const colors = [
      { r: 0, g: 51, b: 102 },    // Starting blue RGB(0, 51, 102)
      { r: 255, g: 0, b: 0 },     // Red RGB(255, 0, 0)
      { r: 255, g: 255, b: 0 }    // Yellow RGB(255, 255, 0)
  ];
  
  
  
  // Determine which two colors to interpolate between
  let startColor, endColor;
  if (value < transitionPoint) {
      // Interpolate between custom blue and red
      startColor = colors[0];
      endColor = colors[1];
      // Adjust value to be between 0-1 for this segment
      value = value / transitionPoint;
  } else {
      // Interpolate between red and yellow
      startColor = colors[1];
      endColor = colors[2];
      // Adjust value to be between 0-1 for this segment
      value = (value - transitionPoint) / (1 - transitionPoint);
  }
  
  // Linear interpolation of RGB values
  const r = Math.round(startColor.r + (endColor.r - startColor.r) * value);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * value);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * value);
  
  return `rgb(${r}, ${g}, ${b})`;
}

