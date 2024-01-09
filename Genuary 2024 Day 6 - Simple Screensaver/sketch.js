/*
Author: Project Somedays
Date: 2024-01-06
Title: Genuary 2024 Day 6 - Screensaver

Flowers grow and die in the spotlight
*/


// spotlight stuff
let spotlights = [];
const spotlightCount = 5;
const spotlightSpeed = 0.003;
const spotlightPropOfScreen = 1/4;

// flower stuff
const flowerLifeFrames = 120;
const flowerSpawnProbability = 0.6;
const flowerDeathThreshold = 50;
const flowerLerpSpeed = 1/50;
const flowerPropofScreen = 0.03;
const flowerPossibleSpawnPerFrame = 1;
const easeInOutQuad = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; // https://easings.net/#easeInOutCubic

let f1, f2, f3, f4, f5, f6, f7, f8;
let flowerScale;
let flowerImages = [];
let flowers = [];

// helper function for mapping noise values
const getVal = (noiseOff, minVal, maxVal) => map(noise(noiseOff),0,1,minVal, maxVal); 


function preload(){
  f1 = loadImage("f1@2x.png");
  f2 = loadImage("f2@2x.png");
  f3 = loadImage("f3@2x.png");
  f4 = loadImage("f4@2x.png");
  f5 = loadImage("f5@2x.png");
  f6 = loadImage("f6@2x.png");
  f7 = loadImage("f7@2x.png");
  f8 = loadImage("f8@2x.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // making spotlights
  for(let i = 0; i < spotlightCount; i++){
    spotlights.push(new Spotlight())
  }

  // setting config for flowers
  imageMode(CENTER);
  flowerScale = flowerPropofScreen*width/f1.width; // scale to 5% of the width of the image;
  flowerImages = [f1, f2, f3, f4, f5, f6, f7, f8];

}

function draw() {
  background(0);
  
  // moving the spotlight around the screen and spawning flowers as we go
  for(let s of spotlights){
    s.update();
    spawnFlowers(s.p.x, s.p.y);
  }

  // updating flowers
  for(let f of flowers){  
    f.update();
    f.show();
  }
  cleanUpDeadFlowers();

}



function spawnFlowers(x,y){
  for(let i = 0; i < flowerPossibleSpawnPerFrame; i++){
    if(random() >= flowerSpawnProbability){
      break;
    }
    let img = random(flowerImages);
    let rPerm = randomGaussian()*spotlightPropOfScreen*width/6;
    let a = random(TAU);
    flowers.push(new Flower(x + rPerm*cos(a),y + rPerm*sin(a), img));
  }
}

function cleanUpDeadFlowers(){
  // remove dead flowers from flowers
  for(let i = flowers.length - 1; i >= 0; i --){
    if(flowers[i].isDead) flowers.splice(i,1);
  }
}

function calculateAverage(arr) {
  if (arr.length === 0) {
    // Handle the case where the array is empty to avoid division by zero
    console.error("Array is empty. Cannot calculate average.");
    return undefined;
  }

  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }

  let average = sum / arr.length;
  return average;
}