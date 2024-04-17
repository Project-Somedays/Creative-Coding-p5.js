/*
Author: Project Somedays
Date: 2024-04-17
Title: The Samplifier X9000

Saw it here first: https://www.youtube.com/watch?v=U1KiC0AXhHg
Was a great usecase of the p5.js copy() function
*/

let pic; // src image
let sclF; // to draw the final image
let dst; // final target image
let targeting; // debug view
let boxS;
let samples = 20;
let xOff = 0;
let yOff = 0;
let step = 5;
let zoomStep = 5;
let spacing;
function preload(){
  // pic = loadImage("images/george_washington.jpg");
  // pic = loadImage("images/Mona_Lisa.jpg");
  pic = loadImage("images/van_Gogh.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
 
  imageMode(CENTER);
  noFill();
  targeting = createGraphics(pic.width, pic.height);
  targeting.stroke(255);
  targeting.strokeWeight(2);
  targeting.noFill();

  sclF = min(height/pic.height, 0.5*width/pic.width);
  dst = createGraphics(pic.width, pic.height);
  
  setBoxSizeAndSpacing();
}

function draw() {
  background(0);
  
  for(let i = 0; i < pic.width; i += 2*spacing){
    for(let j = 0; j < pic.height; j += 2*spacing){
      targeting.rect(i + xOff - boxS/2, j + yOff - boxS/2, boxS, boxS);
      dst.copy(pic, i + xOff - boxS/2, j + yOff - boxS/2, boxS, boxS, i, j, 2*boxS, 2*boxS);
    }
  }
  
  // drawing final images and overlays
  image(pic, width/4, height/2, pic.width*sclF, pic.height*sclF);
  image(targeting, width/4, height/2, pic.width*sclF, pic.height*sclF);
  image(dst, 3*width/4, height/2, dst.width*sclF, dst.height*sclF);
  
  // for(let s of samples){
  targeting.clear();  
  // }
}


function keyPressed(){
  switch(keyCode){
    case LEFT_ARROW:
      xOff -= step;
      break;
    case RIGHT_ARROW:
      xOff += step;
      break;
    case UP_ARROW:
      yOff -= step;
      break;
    case DOWN_ARROW:
      yOff += step;
      break;
    default:
      break;
  }

  switch(key){
    case "=":
      boxS += zoomStep;
      break;
    case "-":
      boxS -= zoomStep;
      break;
    case ".":
      samples ++;
      setBoxSizeAndSpacing();
      break;
    case ",":
      samples --;
      setBoxSizeAndSpacing();
      break;
    case " ":
      save("Sampler.png");
    default:
      break;
  }
}

function setBoxSizeAndSpacing(){
  boxS = int(pic.width / (samples*2+ 1));
  spacing = int(pic.width / (samples*2+ 1));
}