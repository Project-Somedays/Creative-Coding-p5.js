/*
Author: Project Somedays
Date: 2024-03-05
Title: #WCCChallenge "Firefly"

Using a technique I've used a few times now to form the cast of firefly out of fireflies.
Fireflies move with perlin noise within a bounding box
To make the movement more naturalistic as they converge, rather than setting their position directly, we just make the bounding box smaller
Once an image is revealed, the fireflies are remapped to their new targets
*/


let globOffset = 0;
const framesPerCycle = 300;
const sampleEvery = 10;
const swarmProgressRate = 0.01;


let swarm;
let neighbourhood;

let imgReynolds, imgJayne, imgZoe, imgWash, imgSummer, imgKaylee, imgInara, imgSimon, imgShepherd, imgSerenity;
let darkestYellow; 
let yellow;
let convergeTracker = 0;
let a = 0;
let flashCycle = 0;
let flashCycleRate;
let chosenImg;
let cycleOrder;
let castIndex = 0;
let currentFrame = 0;
let firstCycle = true;


function preload(){
  imgReynolds = loadImage("imagesFinal/Nathan Fillion.png");
  imgJayne = loadImage("imagesFinal/Jayne Cobb.png");
  imgZoe = loadImage("imagesFinal/Zoe.png");
  imgSummer = loadImage("imagesFinal/summer.png");
  imgKaylee = loadImage("imagesFinal/Kaylee.png");
  imgInara = loadImage("imagesFinal/Inara.png");
  imgSimon = loadImage("imagesFinal/Simon.png");
  imgWash = loadImage("imagesFinal/Wash.png");
  imgShepherd = loadImage("imagesFinal/Shepherd.png");
  imgSerenity = loadImage("imagesFinal/Serenity.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight, P2D);
  noStroke();
  frameRate(30);
  yellow = color(255, 255, 0);
  darkestYellow = color(139, 128, 0);
  
  neighbourhood = 0.3*max(width, height); // the neighbourhood determines the default size of the bounding box for each firefly
  
  // testTargets = convertImageToTargets(imgReynolds);
  // console.log(testTargets);
  // swarm = new Swarm(testTargets);
  console.log(swarm);
  // // convert all the images to arrays of targets
  cycleOrderTargets = [imgReynolds, imgJayne, imgKaylee, imgZoe, imgWash, imgSummer, imgShepherd].map(convertImageToTargets);
  
  // console.log(cycleOrderTargets);
  // // make a swarm
  swarm = new Swarm(cycleOrderTargets[castIndex]);
  

  flashCycleRate = TAU/10;
  console.log(`castIndex: ${castIndex}`);

  
  
}

function draw() {
  background(0);
  image(imgSerenity, 0,0);

  currentFrame = frameCount % framesPerCycle; // tracker for how far we are through the cycle
  a = currentFrame*TWO_PI/framesPerCycle;

  convergeTracker = 0.5*(sin(a-HALF_PI) + 1); // sine easing function
  
  swarm.update();
  swarm.show();
 

  
  
  // // MOVE ON TO THE NEXT IMAGE
  if(currentFrame === 0 && !firstCycle){
    a = 0; // reset a
    castIndex = (castIndex + 1)%cycleOrderTargets.length; // loop the targets
    swarm.mapFireFliesToTargets(cycleOrderTargets[castIndex]); // remap
    console.log(`castIndex: ${castIndex}`);
  }
  
  // flashCycle += flashCycleRate;
  firstCycle = false;
  globOffset += swarmProgressRate;
  
}

// function convertToFireflyColours(imageToConvert){
//   // shift pixels in img to yellow colour space
//   imageToConvert.loadPixels();
//   for(let y = 0; y < imageToConvert.height; y++){
//     for(let x = 0; x < imageToConvert.width; x++){
//       let ix = (x + y*imageToConvert.width)*4;
//       let brightness = int((imageToConvert.pixels[ix] + imageToConvert.pixels[ix+1] + imageToConvert.pixels[ix+2])/3);
//       let cVal = map(brightness, 0, 255, 0, 1);
//       let c = lerpColor(darkestYellow, yellow, cVal);
//       imageToConvert.pixels[ix] = red(c);
//       imageToConvert.pixels[ix + 1] = green(c)
//       imageToConvert.pixels[ix + 2] = blue(c);
//     }
//   }
//   imageToConvert.updatePixels();
//   return imageToConvert;
// }

function convertImageToTargets(img){
  let targets = [];
  img.loadPixels(); // load the pixels (DON'T SKIP THIS STEP)
  for(let y = 0; y < img.height; y+= sampleEvery){
    for(let x = 0; x < img.width; x+= sampleEvery){
        let ix = (x + y*img.width)*4;
        if(img.pixels[ix+3] === 0) continue; // ignore transparent values
        let brightness = int((img.pixels[ix] + img.pixels[ix+1] + img.pixels[ix+2])/3); // get the greyscale brightness
        let cVal = map(brightness, 0, 255, 0, 1); // scale it between 0 and 1
        let c = lerpColor(darkestYellow, yellow, cVal); // lerp colour: yellow to dark yellow
        targets.push({'c': c, 'x': x, 'y': y}); // capture the x y position and the colour value
      }
  }
  return targets
}


// function convertImageToSwarm(imageToConvert, sampleEvery){
//   fireflies = [];
//   for(let y = 0; y < imageToConvert.height; y+= sampleEvery){
//     for(let x = 0; x < imageToConvert.width; x+= sampleEvery){
//       let ix = (x + y*imageToConvert.width)*4;
//       if(imageToConvert.pixels[ix+3] === 0) continue; // ignore transparent values
//       let c = color(imageToConvert.pixels[ix], imageToConvert.pixels[ix+1], imageToConvert.pixels[ix+2]);
//       fireflies.push(new FireFly(x,y,c));
//     }
//   }
//   return new Swarm(fireflies);
// }
