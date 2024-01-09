/*
Author: Project Somedays
Date: 2024-01-06
Title: Genuary 2024 Day 6 - Screensaver

I wanted to 
*/

// butterfly stuff
const colours = ['#f72585', '#b5179e', '#7209b7', '#560bad', '#480ca8', '#3a0ca3', '#3f37c9', '#4361ee',' #4895ef', '#4cc9f0'];
const rStep = 0.01;
const aStep = 0.003;
const sStep = 0.005;
const sizeMinScale = 0.5;
const sizeMaxScale = 1.5;
const rMin = -2;
const rMax = 2;
const headingBufferSize = 50;
const swarmSize = 1;

let swarm = [];
let rAv; // set proportional to the screen
let bf1a, bf1b, bf1c, bf2a, bf2b, bf2c, bf3a, bf3b, bf3c, bf4a, bf4b, bf4c, bf5a, bf5b, bf5c, bf6a, bf6b, bf6c, bf7a, bf7b, bf7c, bf8a, bf8b, bf8c, bf9a, bf9b, bf9c;
let set1 = [];
let set2 = [];
let set3 = [];
let set4 = [];
let set5 = [];
let set6 = [];
let set7 = [];
let set8 = [];
let set9 = [];
let butterflyAnimationSets = [];

// spotlight stuff
let spotlight;
const spotlightSpeed = 0.01;
const spotlightPropOfScreen = 1/4;

// flower stuff
const flowerLifeFrames = 100;
const flowerSpawnProbability = 0.6;
const flowerDeathThreshold = 50;
const flowerLerpSpeed = 1/30;
const flowerPropofScreen = 0.03;
const flowerPossibleSpawnPerFrame = 1;
const easeInOutQuad = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; // https://easings.net/#easeInOutCubic

let f1, f2, f3, f4, f5, f6, f7, f8;
let flowerScale;
let flowerImages = [];
let flowers = [];


///testing variables
let test;
let bfTestIx = 0;

// helper function for mapping noise values
const getVal = (noiseOff, minVal, maxVal) => map(noise(noiseOff),0,1,minVal, maxVal); 


function preload(){
  bf1a = loadImage('BF1A@2x.png');
  bf1b = loadImage('BF1B@2x.png');
  bf1c = loadImage('BF1C@2x.png');
  bf2a = loadImage('BF2A@2x.png');
  bf2b = loadImage('BF2B@2x.png');
  bf2c = loadImage('BF2C@2x.png');
  bf3a = loadImage('BF3A@2x.png');
  bf3b = loadImage('BF3B@2x.png');
  bf3c = loadImage('BF3C@2x.png');
  bf4a = loadImage('BF4A@2x.png');
  bf4b = loadImage('BF4B@2x.png');
  bf4c = loadImage('BF4C@2x.png');
  bf5a = loadImage('BF5A@2x.png');
  bf5b = loadImage('BF5B@2x.png');
  bf5c = loadImage('BF5C@2x.png');
  bf6a = loadImage('BF6A@2x.png');
  bf6b = loadImage('BF6B@2x.png');
  bf6c = loadImage('BF6C@2x.png');
  bf7a = loadImage('BF7A@2x.png');
  bf7b = loadImage('BF7B@2x.png');
  bf7c = loadImage('BF7C@2x.png');
  bf8a = loadImage('BF8A@2x.png');
  bf8b = loadImage('BF8B@2x.png');
  bf8c = loadImage('BF8C@2x.png');
  bf9a = loadImage('BF9A@2x.png');
  bf9b = loadImage('BF9B@2x.png');
  bf9c = loadImage('BF9C@2x.png');
  f1 = loadImage("f1@2x.png");
  f2 = loadImage("f2@2x.png");
  f3 = loadImage("f3@2x.png");
  f4 = loadImage("f4@2x.png");
  f5 = loadImage("f5@2x.png");
  f6 = loadImage("f6@2x.png");
  f7 = loadImage("f7@2x.png");
  f8 = loadImage("f8@2x.png");
}


let testFlower;

function setup() {
  createCanvas(windowWidth, windowHeight);
  flowerImages = [f1, f2, f3, f4, f5, f6, f7, f8];
  set1 = [bf1a, bf1b, bf1c, bf1b];
  set2 = [bf2a, bf2b, bf2c, bf2b];
  set3 = [bf3a, bf3b, bf3c, bf3b];
  set4 = [bf4a, bf4b, bf4c, bf4b];
  set5 = [bf5a, bf5b, bf5c, bf5b];
  set6 = [bf6a, bf6b, bf6c, bf6b];
  set7 = [bf7a, bf7b, bf7c, bf7b];
  set8 = [bf8a, bf8b, bf8c, bf8b];
  set9 = [bf9a, bf9b, bf9c, bf9b];
  butterflyAnimationSets = [set1,set2,set3,set4,set5,set6,set7,set8,set9];
    
  rAv = max(width, height)/6; // 
  fill(255);
  test = new Butterfly();

  // making spotlight
  spotlight = new Spotlight();

  // init swarm
  for(let i = 0; i < swarmSize; i++){
    swarm.push(new Butterfly(random(butterflyAnimationSets)));
  }
  imageMode(CENTER);
  // testFlower = new Flower(width/2, height/2, f1);
  flowerScale = flowerPropofScreen*width/f1.width; // scale to 5% of the width of the image;

}

function draw() {
  background(0);
  
  // moving the spotlight around the screen
  spotlight.update();
  // spotlight.show();

  // dealing with flowers
  spawnFlowers(spotlight.p.x, spotlight.p.y);
  for(let f of flowers){ // showing oldest flowers first  
    f.update();
    f.show();
  }
  cleanUpDeadFlowers();

  // dealing with the butterflies
  for(let b of swarm){
    b.update(spotlight.p);
    b.show();
  }

  test.update(spotlight.p);
  test.show();

  
  
  
  
  // image(BUTTERFLY_AMIMATION_SETS[0][0], width/2, height/2);

  // image(BUTTERFLY_AMIMATION_SETS[0][bfTestIx],width/2, height/2);
  // if(frameCount%2 === 0){
  //   bfTestIx = (bfTestIx + 1)%4;
  // }
  

  

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