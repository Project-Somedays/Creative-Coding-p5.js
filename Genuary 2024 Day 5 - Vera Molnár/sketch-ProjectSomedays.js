/*
Author: Project Somedays
Date: 2024-01-05
Title: Genuary 2024 Day 5 - In the style of Vera Molnár

I want to convert a picture of Vera Molnár into a grid of Vera Molnár recursive squares
Need a map of pixel darkness to recursion level and line thickness
Brighter pixels should have
 - larger average steps
 - lighter line weights

At first, I was just randomly varying these but I needed more control so they needed to be tied together
Scaled lineWeight by stepSize
*/

const n = 75;
let res;
let cw, cy;
let recursionLevels = 1;
let minStep;
const minSizeFrac = 1/150;
let debugMode = true;
let endGraphic;
let scaleFactor;

// const getStep = (brightness, minStep) => constrain((map(brightness, 0, 255,1, 6) + randomGaussian())*minStep, minStep, 5*minStep); // no more than 50% steps
// const getStrokeWeight = (brightness, minStep, stepSize) => constrain(map(brightness, 0, 255, minStep, 0.1)*(randomGaussian()+1),0.1,minStep); // never less than 1, never more than 



// function getStrokeWeight(brightness, stepSize){
//   let b = map(brightness, 0, 255, minStep, 0.1);
//   let maxThick = map(brightness, 0, 255, stepSize, 0.1);
//   // add some randomness
//   let bRand = b*(randomGaussian() + 1);
//   // constrain between 0.1 and maxThick
//   return constrain(bRand,0.1, maxThick);
// }

function preload(){
  if(debugMode) console.log("Loading base image");
  // img = loadImage("burbs.png");
  // img = loadImage("vera-molnar-portrait.jpg");
  img = loadImage("vera200w.jpg");
  // res = windowWidth / n;
  // canvasW = windowWidth * res;
  // canvasH = windowHeight * res;
}

function setup() {
  // createCanvas(windowWidth*10, windowHeight*10);
  createCanvas(windowWidth*10, windowHeight*10);
  res = windowWidth / n;
  pixelDensity(1);
  minStep = res*0.1;
  rectMode(CENTER);

  // test();


  if(debugMode) console.log(`For drawing ${n} pixels across the screen, resolution = ${res} i.e. minStep = ${minStep}`);

  img.loadPixels();
  if(debugMode) console.log(`Loading pixels. Length: ${img.pixels.length} for ${img.pixels.length/4} pixels`);  

  if(debugMode) console.log("Creating graphic to draw to");
  endGraphic = createGraphics(img.width * res, img.height * res); // the end result should be the res*[x,y] of the base image
  
  endGraphic.stroke(0);
  endGraphic.fill(255);
  endGraphic.rectMode(CENTER);
  if(debugMode) console.log(`Base image dimensions: (${img.width}, ${img.height} --> (${endGraphic.width}, ${endGraphic.height})`);
  
  if(debugMode) console.log("Drawing pixel squares to the graphic");
  
  for(let y = 0; y < img.height; y++){
    for(let x = 0; x < img.width; x++){
      let p = img.get(x,y);
      // endGraphic.fill(brightness(p)); // for testing
      endGraphic.square(res*(0.5 + x), res*(0.5+y), res);
      drawPixelSquare(res*(0.5 + x), res*(0.5+y), brightness(p), res);
    }
  }
  save(endGraphic, "Molnar Burb2.png");

  if(debugMode) console.log("Image complete");  
 
  image(endGraphic,0, 0);
  if(debugMode) console.log("Image shown"); 
}

function draw() {
  // image(endGraphic, 0, 0, endGraphic.width*scaleFactor, endGraphic.height*scaleFactor);
}


function drawPixelSquare(x,y, pixelBrightness, currentSize){
  // let newSize = currentSize - constrain(randomGaussian()*2,1, 6)*avStep; // 
  let step = getStep(pixelBrightness);
  let newSize = currentSize - step;
  if(newSize < res*minSizeFrac){
    return;
  }
  
  let lineThickness = getStrokeWeight(pixelBrightness);
  endGraphic.strokeWeight(lineThickness)
  endGraphic.square(x,y, newSize);
  // strokeWeight(lineThickness);
  // square(x,y, newSize);
  drawPixelSquare(x,y,pixelBrightness, newSize)
  // console.log(`Recursion level: ${level}, inputSize: ${currentSize}, new size: ${newSize}, line thickness: ${lineThickness}`);
}

function getStep(brightness){
  let mappedVal = map(brightness, 0, 255,0.5, 10); // when darkest, take the smallest step, when brightest, take a 30% step in
  let permutation = constrain((abs(randomGaussian() + 1)),0,2); // av 1, max 2
  // return minStep*(mappedVal + permutation);
  return minStep * (mappedVal + permutation);
}

function getStrokeWeight(brightness){
  let b = map(brightness, 0, 255, minStep/2, 0.1);
  let permutation = constrain(abs(randomGaussian() + 1),0,2);
  // scale permutation depending on brightness to sure it's heavier at the darker end
  // let scaledPermutation = map(brightness, 0, 255, 1,0.1)*permutation;
  // return b + scaledPermutation;
  return b + permutation*map(brightness, 0, 255, 1, 0.25);
}


function test(){
  for(let y = 0; y < height/res; y++){
    for(let x = 0; x < width/res; x++){
      
      // draw the base outline
      let xCoord = res*(x + 0.5);
      let yCoord = res*(y + 0.5);
      let brightness = map(dist(xCoord,yCoord,width/2, height/2), 0, width*sqrt(2), 0, 255);
      strokeWeight(getStrokeWeight(brightness));
      square(xCoord, yCoord, res);
      
      drawPixelSquare(xCoord, yCoord, brightness, res); 
    }
  }
}
