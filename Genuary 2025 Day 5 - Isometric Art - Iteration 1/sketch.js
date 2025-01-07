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

const n = 75;
let w;
let noiseZoom = 2700;
let noiseProgRate = 0.005;
let colourA;
let colourB;
let simplex;
let rotationRate = 300;
const thresholdRate = 0.03;
let rotateMode = true;
let exclusionUpper = 0.875;
let exclusionLower = 0.4;
let showLines = true;

let boxes = [];


function setup(){
  createCanvas(1080, 1080, WEBGL);
  noStroke();
  frameRate(30);
  pixelDensity(1);
  w = 0.75*min(width, height) / n;
  ortho();
  simplex = new SimplexNoise();
  colourB = color(100, 209, 0);
  colourA = color(0, 51, 102);

  for(let y = 0; y < n; y++){
    for(let x = 0; x < n; x++){
      for(let z = 0; z < n; z++){
        let p = createVector(-0.5*w*n + x*w, -0.5*w*n + y*w, -0.5*w*n + z*w);
        let normD = dist(p.x, p.y, p.z, 0, 0, 0)/(0.5*w*n); // normalise to between 0 and 1
        if(normD > 1 || (normD < exclusionUpper && normD > exclusionLower)) continue; // don't worry about storing the locations if it's not in the sphere
        let depth;
        if(normD >= exclusionUpper){
          colourB = color(100, 209, 0); // rgb(100, 209, 0);
          colourA = color(77, 54, 39); // rgb(77, 54, 39)
          depth = map(normD, exclusionUpper, 1, 0, 1); // how far into the current band are?
        } else {
          colourB = color(0, 51, 102); // rgb(0, 51, 102);
          colourA = color(255, 0, 0); // rgb(255, 0, 0);
          depth = map(normD, 0, exclusionLower, 0, 1);  // how far into the current band are?
          }
          let col = lerpColor(colourB, colourA, 1- depth**2); // get deep quicker
          boxes.push({p, col, normD});
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
  let noiseVal = 0.5*(simplex.noise4D(b.p.x*w/noiseZoom, b.p.y*w/noiseZoom, b.p.z*w/noiseZoom, frameCount*noiseProgRate)+1);
  let threshold = map(noise(frameCount * thresholdRate), 0, 1, 0.25, 0.4) * (b.normD < exclusionLower ? 1.5 : 1);
  if(noiseVal > threshold) continue;
  // if(noiseVal > 0.25) continue;
  
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