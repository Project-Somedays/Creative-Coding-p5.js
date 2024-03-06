/*
Author: Project Somedays
Date: 2024-03-05
Title: #WCCChallenge "Firefly"

Using a technique I've used a few times now to form the cast of firefly out of fireflies.
Fireflies move with perlin noise within a bounding box
To make the movement more naturalistic as they converge, rather than setting their position directly, we just make the bounding box smaller
*/
let globOffset = 0.00005;
let sampleRate = 1000;
let sampleCount = 1000;
let swarm;
let neighbourhood;
const swarmProgressRate = 0.01;
let img;
let darkestYellow; 
let yellow;
let convergeTracker = 0;
let a = 0;


function preload(){
  img = loadImage("Nathan Fillion.png");
}

function setup() {
  createCanvas(1080, 1080, P2D);
  darkestYellow = color(139, 128, 0);
  yellow = color(255, 255, 0);
  neighbourhood = 0.5*max(width, height);
  swarm = new Swarm(sampleCount);
  console.log(swarm.swarm.length);
  noStroke();
  frameRate(30);
  img = convertToFireflyColours(img);
  swarm = convertImageToSwarm(img, 10);
  
}

function draw() {
  background(0);
  // image(img, 0, 0);
  swarm.update();
  swarm.show();
  convergeTracker = 0.5*(sin(a) + 1);
  fill(255);
  text(convergeTracker, 10,10);
  a += TWO_PI/300;
  

  globOffset += swarmProgressRate;
}

function convertToFireflyColours(imageToConvert){
  // shift pixels in img to yellow colour space
  imageToConvert.loadPixels();
  for(let y = 0; y < imageToConvert.height; y++){
    for(let x = 0; x < imageToConvert.width; x++){
      let ix = (x + y*imageToConvert.width)*4;
      let brightness = int((imageToConvert.pixels[ix] + imageToConvert.pixels[ix+1] + imageToConvert.pixels[ix+2])/3);
      let cVal = map(brightness, 0, 255, 0, 1);
      let c = lerpColor(darkestYellow, yellow, cVal);
      imageToConvert.pixels[ix] = red(c);
      imageToConvert.pixels[ix + 1] = green(c)
      imageToConvert.pixels[ix + 2] = blue(c);
    }
  }
  imageToConvert.updatePixels();
  return imageToConvert;
}

function convertImageToSwarm(imageToConvert, sampleEvery){
  fireflies = [];
  for(let y = 0; y < imageToConvert.height; y+= sampleEvery){
    for(let x = 0; x < imageToConvert.width; x+= sampleEvery){
      let ix = (x + y*imageToConvert.width)*4;
      if(imageToConvert.pixels[ix+3] === 0) continue; // ignore transparent values
      let c = color(imageToConvert.pixels[ix], imageToConvert.pixels[ix+1], imageToConvert.pixels[ix+2]);
      fireflies.push(new FireFly(x,y,c, sampleEvery));
    }
  }
  return new Swarm(fireflies);
}
