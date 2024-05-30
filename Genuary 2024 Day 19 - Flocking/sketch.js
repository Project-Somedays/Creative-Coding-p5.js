/*
Author: Project Somedays
Date: 2025-05-15
Title: Genuary 2024 Day 19 - Flocking

Building off the https://p5js.org/examples/simulate-flocking.html code from Dan Shiffman's Nature of Code

I quite like the idea of seeing the flocking behaviour purely through the forces that are involved


*/

const palettes = [
  "#26547c, #ef476f, #ffd166".split(","),
  "#edae49, #d1495b, #00798c".split(", "),
  "#fe4a49, #fed766, #009fb7".split(", "),
  "#ffbe0b, #fb5607, #ff006e".split(", "),
  "#fb8b24, #d90368, #820263".split(", "),
  "#386641, #6a994e, #a7c957".split(", "),
  "#002642, #840032, #e59500".split(", "),
  "#002642, #840032, #e59500".split(", "),
  "#db2b39, #29335c, #f3a712".split(", "),
  "#ff595e, #ffca3a, #8ac926".split(", ")

]

const noiseZoom = 200;
const captureMode = true;


let flock;
let r;
let los;
let desiredseparation;
let palette;
let sepCol;
let aliCol;
let cohCol;
let substeps;
let speedCycleFrames = 150;
let currentFrame;
let totalCycles = 5;
let totalFrames = speedCycleFrames*totalCycles;


var fps = 30;
var capturer = new CCapture({
  format: 'png',
  framerate: fps
});

function setup() {
  createCanvas(1080,1080);
  
  console.log(palettes);

  getColours();
  
  los = width/10;
  r = width/80;
  desiredseparation = width/25;
  strokeWeight(5);
  
  generateFlock();

  background(255);

}



function draw() {
  if(captureMode && frameCount===1) capturer.start();
  
  currentFrame = frameCount%speedCycleFrames;
  
  // substeps = 1+0.5*(sin(currentFrame*TAU/speedCycleFrames)+1)*10;
  substeps = (1-easeOutQuint(1/speedCycleFrames))*10;
  
  if(currentFrame === 0){
    background(255);
    getColours();
    generateFlock();
  }

  if (captureMode && frameCount > totalFrames) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  
  for(let i = 0; i < substeps; i++){
    flock.run();
  }

  if(captureMode) capturer.capture(document.getElementById('defaultCanvas0'));
  
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY));
}


function showForceVector(colour, position, vec){
  stroke(colour);
  let a = vec.heading();
  let r = vec.mag()*500;
  line(position.x, position.y, position.x + r*cos(a), position.y + r*sin(a));
}


function colorWithOpacity(hexColor, opacity) {
  // Parse the hex color string to get the RGB values
  let red = parseInt(hexColor.substring(1, 3), 16);
  let green = parseInt(hexColor.substring(3, 5), 16);
  let blue = parseInt(hexColor.substring(5, 7), 16);

  return color(red, green, blue, opacity);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getDesiredSeparation(x,y){
  return map(noise(x/noiseZoom, y/noiseZoom, frameCount/noiseZoom), 0,1,0.25,2);
}

function getColours(){
  palette = shuffleArray(random(palettes)).map(each => colorWithOpacity(each, 50));
  console.log(palette);
  sepCol = palette[0];
  aliCol = palette[1];
  cohCol = palette[2];
}

function generateFlock(){
  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 25; i++) {
    flock.addBoid(new Boid(width*0.5,height*0.25));
    flock.addBoid(new Boid(width*0.75, height*0.5));
    flock.addBoid(new Boid(width*0.5,height*0.75));
    flock.addBoid(new Boid(width*0.25, height*0.5));
  }
}

function easeOutQuint(x){
  return 1 - Math.pow(1 - x, 5);
  }



