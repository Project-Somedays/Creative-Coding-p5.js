/*
Author: Project Somedays
Date: 2024-01-22
Title: Genuary 2024 Day 12 - Lava Lamp

Trying a novel way of doing lava lamp sims
Chalkin Smoothing on a blob set of points where you eliminate all the points inside to just show things
Blobs exert a small force against each other
*/
let testBlob;
let gravity;
const G = 0.01;
let blobs = [];
const n = 10;
const heatingFunction = (y) => 1-Math.pow(1-y,3); // close to  

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for(let i = 0; i < n; i++){
    blobs.push(new LavaBlob(random(width/2, 0.8*width), random(0,height), random(min(width,height)/16, min(width,height)/8), 0));
  }
  strokeWeight(10);
  gravity = createVector(0,G);
  textAlign(CENTER, CENTER);
  textSize(100);
}

function draw() {
  background(0);
  for(let b of blobs){
    b.applyForce(gravity);
    b.applyHeat();
    b.applyBuoyancyForce();
    b.update();
    b.show();
  }
  
  
  
  //show temp gradient
  for(let i = 0; i < 10; i++){
    text(round(heatingFunction(i/10),2), width/20, i*height/10);
  }
  
}


