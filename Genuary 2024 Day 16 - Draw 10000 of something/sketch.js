/*
Author: Project Somedays
Date: 2024-03-25
Title: Genuary 2024 Day 16 - Draw 10,000 of something

Spawning a grid of 10,000 particles inheriting from a 2D noise field and drawing the connections between a moving threshold of values

I wanted to experiment with Spatial Hashing.


Inspiration: Thomas Maria Helzle - https://www.youtube.com/watch?v=uydNW81NKp4, but also building off another project of mine: https://openprocessing.org/sketch/2118510
*/

let n = 10000;
let noiseZoom = 300;
let particles = [];
let threshold = null;
let bandwidth = 0.15;
let framesPerCycle = 300;

let capturer;
let fps = 30;
let captureFrames = 30*30;
let canvas;
const canvasID = 'canvas'

let spatialhash;
let res;
let rows;
let cols;
let landscapeEvolutionSpeed = 900;

function setup() {
  canvas = createCanvas(1080, 1920);
  canvas.id(canvasID);
  colorMode(HSB,360,100,100, 100);
  
  capturer = new CCapture({
    format: 'png',
    framerate: fps
  });

  res = 0.02*width;
  console.log(`res: ${res}`);

  particles = [];
  for(let i = 0; i < n; i++){
    let x = random(width);
    let y = random(height);
    let nv = noise(x/noiseZoom, y/noiseZoom);

    particles[i] = {
      p : createVector(x, y),
      nVal : nv,
      colour: 360*nv,
      row: int(y / res),
      column: int(x / res)
    }
  }

  cols = int(width/res)+1;
  rows = int(height/res)+1;
  console.log(`rows: ${rows}, cols: ${cols}`);

  // for each row, push a new array
  spatialhash = new Array(rows)
  for (let i = 0; i < rows; i++) {
    spatialhash[i] = new Array(cols);
    for (let j = 0; j < cols; j++) {
      spatialhash[i][j] = []; // Initialize each element as an empty array
    }
  }
  
  storeParticlesInHash();
  
  
  // console.log(spatialhash); 
  
  

}

function draw() {

  // CAPTURE BIZ
  if(frameCount === 1){
    capturer.start();
  }

  if (frameCount > captureFrames) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  background(0);
  updateParticles();
  threshold = 0.5*(1 + sin((TWO_PI/framesPerCycle)*frameCount));
  // threshold = mouseY/height;
  
  for(let p of particles){
    // just check the surrounding cells
    for(let i = -1; i < 2; i++){
      for(let j = -1; j < 2; j++){
        // console.log(p);
        if(i + p.row < 0 || i + p.row >= rows || j + p.column < 0 || j + p.column >= cols) continue; // ignore invalid cell references
        // console.log(`{checking row: ${i + p.row},  col: ${j + p.column}`);
        for(let other of spatialhash[i + p.row][j + p.column]){
          if(abs(p.nVal - threshold) > bandwidth) continue; // if outside of the bandwidth, move on
          if(other === p) continue; // ignore selfchecks
          if(abs(p.nVal - other.nVal) < bandwidth){
            stroke(p.colour,100, 100, 100);
            showOverlapChord(p.p, other.p);
            // line(p.p.x, p.p.y, other.p.x, other.p.y);
          }
        }
      }
    }

  }
  // noLoop();
  capturer.capture(document.getElementById(canvasID));
}

function storeParticlesInHash(){
  for(let p of particles){
    let row = int(p.p.y/res);
    let col = int(p.p.x/res);
    spatialhash[row][col].push(p)
  }
}

function updateParticles(){
  for(let p of particles){
    p.nVal = noise(p.p.x/noiseZoom, p.p.y/noiseZoom, frameCount/landscapeEvolutionSpeed);
    p.colour = int(360*p.nVal);
  }
}

function showOverlapChord(posA, posB){
	let d = p5.Vector.dist(posA,  posB);
	let aSys = p5.Vector.sub(posB, posA).heading(); // get the heading from A to B
	let a = acos(d/res);
  let r = res/2;
	push();
	translate(posA.x, posA.y);
	rotate(aSys); // for simplicity, rotate the system so that posB is always to the right of posA
	// if(debugMode){
	// 	layer.line(0, 0, r*cos(a), r*sin(a));
	// 	layer.line(0, 0, r*cos(a), r*sin(-a));
	// }
	line(r*cos(a), r*sin(a), r*cos(a), r*sin(-a)); // drawing a line between the points of intersection
	pop();
}
