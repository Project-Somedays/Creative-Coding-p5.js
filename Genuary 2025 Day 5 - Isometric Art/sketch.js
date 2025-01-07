/*
Author: Project Somedays
Date: 2025-05-05
Title: Genuary 2025 Day 5 - Isomorphic Art

Keeping it dead simple - simplex noise for an evolving landscape and perlin noise to set the threshold value
Trying hard to remember the get-it-done mantra: "A project is never truly finished, only released"

Opportunities:
- Map the globe on the outside
- lil-gui controls
*/

const n = 50;
let w;
let noiseZoom = 2400;
let noiseProgRate = 0.005;
let colourA;
let colourB;
let simplex;
let rotationRate = 300;
const thresholdRate = 0.03;
let rotateMode = true;

let boxes = [];


function setup(){
  createCanvas(1080, 1080, WEBGL);
  frameRate(30);
  pixelDensity(1);
  w = 0.75*min(width, height) / n;
  ortho();
  simplex = new SimplexNoise();
  colourB = color(0,0,255);
  colourA = color(255,0,0);

  for(let y = 0; y < n; y++){
    for(let x = 0; x < n; x++){
      for(let z = 0; z < n; z++){
        let p = createVector(-0.5*w*n + x*w, -0.5*w*n + y*w, -0.5*w*n + z*w);
        let d = dist(p.x, p.y, p.z, 0, 0, 0);
        let col = lerpColor(colourA, colourB, d/(0.5*w*n));
        if(d > 0.5*w*n) continue; // don't worry about storing the locations if it's not in the sphere
        boxes.push({p, col});
      }
    }
  }

  noCursor();
  
  
  
  // noiseDetail(8, 0.5);

 
}

function draw() {
  background(0);

  if(rotateMode){
    rotateX(-frameCount*TWO_PI/rotationRate);
    rotateY(frameCount*TWO_PI/rotationRate);
    rotateZ(-frameCount*TWO_PI/rotationRate);
  }
  
 
  
 for(let b of boxes){
  // let noiseVal = noise(b.p.x*w/noiseZoom + frameCount*noiseProgRate, b.p.y*w/noiseZoom, b.p.z*w/noiseZoom);
  let noiseVal = 0.5*(simplex.noise4D(b.p.x*w/noiseZoom, b.p.y*w/noiseZoom, b.p.z*w/noiseZoom, frameCount*noiseProgRate)+1);
  let threshold = map(noise(frameCount * thresholdRate), 0, 1, 0.25, 0.45);
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