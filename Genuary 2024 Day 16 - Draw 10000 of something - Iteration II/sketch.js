/*
Author: Project Somedays
Date: 2024-03-25
Title: Genuary 2024 Day 16 - Draw 10,000 of something

Spawning a grid of 10,000 particles inheriting from a 2D noise field and drawing the connections between a moving threshold of values

in this iteration, particles moves about the space and the threshold value doesn't dip all the way to zero


Inspiration: Thomas Maria Helzle - https://www.youtube.com/watch?v=uydNW81NKp4, but also building off another project of mine: https://openprocessing.org/sketch/2118510
*/

let n = 10000;
let noiseZoom = 300;
let particles = [];
let threshold = 0;
let bandwidth = 0.2;
let framesPerCycle = 300;

let capturer;
let fps = 30;
let captureFrames = framesPerCycle*4;
let canvas;
const canvasID = 'canvas'

let spatialhash = {};
let res;
let rows;
let cols;
let landscapeEvolutionSpeed = 200;
let r, D;
let rate;

let isCapturing = true;

function setup() {
  rate = 1/framesPerCycle;
  canvas = createCanvas(1080, 1920);
  canvas.id(canvasID);
  colorMode(HSB,360,100,100, 100);
  strokeWeight(5);
  
  capturer = new CCapture({
    format: 'png',
    framerate: fps
  });

  res = 0.2*width;
  r = res/6;
  D = 2*r;
  console.log(`res: ${res}`);

  particles = [];
  for(let i = 0; i < n; i++){
    let x = random(width);
    let y = random(height);
    let nv = noise(x/noiseZoom, y/noiseZoom);

    particles[i] = {
      p : createVector(x, y),
      nVal : nv,
      v : p5.Vector.random2D(),
      colour: map(nv, 0, 1, 150, 360)
    }
  }

  cols = int(width/res)+1;
  rows = int(height/res)+1;
  console.log(`rows: ${rows}, cols: ${cols}`);
    
  storeParticlesInHash();
  
  background(0);
}

function draw() {
  background(0,0,0,50);
  // background(0);

  // CAPTURE BIZ
  if(frameCount === 1 && isCapturing){
    capturer.start();
  }

  if (frameCount > captureFrames && isCapturing) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  // background(0);
  updateParticles();
  storeParticlesInHash();
  // threshold = 0.5*(1 + cos((TWO_PI/framesPerCycle)*frameCount));
  threshold = threshold - rate < 0 ? 1 : threshold - rate;
  // threshold = mouseY/height;
  

  for(let cell in spatialhash){
    let movers = spatialhash[cell]; // grab all the movers in each cell
    for(let i = 0; i < movers.length; i++){
      for(let j = i + 1; j < movers.length; j++){
        if(p5.Vector.dist(movers[i].p, movers[j].p) > 2*r) continue;
        if(abs(movers[i].nVal - threshold) > bandwidth || movers[j].nVal - threshold > bandwidth) continue;
        if(abs(movers[i].nVal - movers[j].nVal) < bandwidth/2){
          // stroke(p.colour,100, 100, 100);
          stroke(movers[i].colour, 100, 100, 25);
          showOverlapChord(movers[i].p, movers[j].p);
          // circle(p.p.x, p.p.y, res);
          // line(p.p.x, p.p.y, other.p.x, other.p.y);
      }
      }
    }
  }

  
  if(isCapturing) capturer.capture(document.getElementById(canvasID));
}

function storeParticlesInHash(){
  spatialhash = {}

  for(let p of particles){
    let row = int(p.p.y/res);
    let col = int(p.p.x/res);
    let index = `(${row}, ${col})`;
    if(!spatialhash[index]){ // if the hash doesn't exist yet, chuck it in
      spatialhash[index] = [];
    }
    spatialhash[index].push(p)
  }
}

function updateParticles(){
  for(let p of particles){
    p.p.add(p.v);
    if(p.p.x < 0 || p.p.x > width) p.v.x = -p.v.x; // bounce
    if(p.p.y < 0 || p.p.y > height) p.v.y = -p.v.y; // bounce
    p.nVal = noise(p.p.x/noiseZoom, p.p.y/noiseZoom, frameCount/landscapeEvolutionSpeed);
    p.colour = map(p.nVal, 0, 1, 150, 360)
  }
}

function showOverlapChord(posA, posB){
	let d = p5.Vector.dist(posA,  posB);
	let aSys = p5.Vector.sub(posB, posA).heading(); // get the heading from A to B
	let a = acos(d/D);
	push();
	translate(posA.x, posA.y);
	rotate(aSys); // for simplicity, rotate the system so that posB is always to the right of posA
	line(r*cos(a), r*sin(a), r*cos(a), r*sin(-a)); // drawing a line between the points of intersection
	pop();
}
