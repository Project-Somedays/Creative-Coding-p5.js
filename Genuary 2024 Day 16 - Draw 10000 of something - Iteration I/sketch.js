/*
Author: Project Somedays
Date: 2024-03-25
Title: Genuary 2024 Day 16 - Draw 10,000 of something

Spawning a grid of 10,000 particles inheriting from a 2D noise field and drawing the connections between a moving threshold of values

I wanted to experiment with Spatial Hashing.


Inspiration: Thomas Maria Helzle - https://www.youtube.com/watch?v=uydNW81NKp4, but also building off another project of mine: https://openprocessing.org/sketch/2118510
*/

let colours = ["#083d77", "#ebebd3"];

let n = 10000;
let noiseZoom = 300;
let particles = [];
let threshold = 0;
let bandwidth = 0.1;
let framesPerCycle = 150;

let capturer;
let fps = 30;
let captureFrames = 30*30;
let canvas;
const canvasID = 'canvas'

let spatialhash;
let res;
let rows;
let cols;
let landscapeEvolutionSpeed = 300;
let r;
let rate;

let isCapturing = true;

function setup() {
  rate = 1/framesPerCycle;
  canvas = createCanvas(1080, 1920);
  colours = colours.map(hexToRgb);
  canvas.id(canvasID);
  colorMode(RGB);
  colorMode(HSB,360,100,100, 75);
  
  capturer = new CCapture({
    format: 'png',
    framerate: fps
  });

  res = 0.1*width;
  r = res/3;
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
      // colour: lerpColor(colours[0], colours[1], nv),
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
  
  background(0);
}

function draw() {
  background(0,0,0,25);
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
  // threshold = 0.5*(1 + cos((TWO_PI/framesPerCycle)*frameCount));
  threshold = threshold - rate < 0 ? 1 : threshold - rate;
  // threshold = mouseY/height;
  

  for(let p of particles){
    if(abs(p.nVal - threshold) > bandwidth) continue;
    for(let other of spatialhash[p.row][p.column]){
       // if outside of the bandwidth, move on
      if(other === p) continue; // ignore selfchecks
      if(p5.Vector.dist(other.p, p.p) > 2*r) continue;
      if(abs(p.nVal - other.nVal) < bandwidth){
        // stroke(p.colour,100, 100, 100);
        stroke(p.colour, 100, 100, 100);
        showOverlapChord(p.p, other.p);
        // line(p.p.x, p.p.y, other.p.x, other.p.y);
    }
  }
}
  // for(let p of particles){
  //   // just check the surrounding cells
  //   for(let i = -1; i < 2; i++){
  //     for(let j = -1; j < 2; j++){
  //       // console.log(p);
  //       if(i + p.row < 0 || i + p.row >= rows || j + p.column < 0 || j + p.column >= cols) continue; // ignore invalid cell references
  //       // console.log(`{checking row: ${i + p.row},  col: ${j + p.column}`);
  //       for(let other of spatialhash[i + p.row][j + p.column]){
  //         if(abs(p.nVal - threshold) > bandwidth) continue; // if outside of the bandwidth, move on
  //         if(other === p) continue; // ignore selfchecks
  //         if(abs(p.nVal - other.nVal) < bandwidth){
  //           stroke(p.colour,100, 100, 100);
  //           showOverlapChord(p.p, other.p);
  //           // line(p.p.x, p.p.y, other.p.x, other.p.y);
  //         }
  //       }
  //     }
  //   }

  // }
  // noLoop();
  if(isCapturing) capturer.capture(document.getElementById(canvasID));
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
    // p.p.add(p.v);
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

function hexToRgb(hex) {
  // Remove '#' if present
  hex = hex.replace('#', '');
  
  // Convert to 3 separate values for red, green, and blue
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  // Return as an object with properties r, g, and b
  return color(r,g,b);
}
