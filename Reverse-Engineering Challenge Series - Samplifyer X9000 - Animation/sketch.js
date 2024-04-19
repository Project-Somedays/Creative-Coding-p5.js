/*
Author: Project Somedays
Date: 2024-04-17
Title: The Samplifier X9000

Saw it here first: https://www.youtube.com/watch?v=U1KiC0AXhHg
Was a great usecase for the p5.js copy() function

*/

let pic; // src image
let sclF; // to draw the final image
let dst; // final target image
let targeting; // debug view
let boxS;
let samples = 20;
let xOff = 0;
let yOff = 0;
let step = 10;
let zoomStep = 5;
let spacing;
function preload(){
  // pic = loadImage("images/george_washington.jpg");
  // pic = loadImage("images/Mona_Lisa.jpg");
  // pic = loadImage("images/van_Gogh.jpg");
  // pic = loadImage("images/American_Gothic.jpg");
  // pic = loadImage("images/Girl_with_a_Pearl_Earring.jpg")
  pic = loadImage("images/Che_Guevara.jpg");
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
  dst.clear();
 
  for(let i = 0; i < pic.width/spacing; i ++){
    for(let j = 0; j < pic.height/spacing; j ++){
      let tlx = i*2*spacing + xOff - boxS/2;
      let tly = j*2*spacing + yOff - boxS/2;
      targeting.rect(tlx, tly, boxS, boxS);
      dst.copy(pic, tlx, tly, boxS, boxS, i*pic.width/samples, j*pic.width/samples, pic.width/samples, pic.width/samples);
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
      if(abs(xOff - step) < spacing) xOff -= step;
      break;
    case RIGHT_ARROW:
      if(abs(xOff + step) < spacing) xOff += step;
      break;
    case UP_ARROW:
      if(abs(yOff - step) < spacing) yOff -= step;
      break;
    case DOWN_ARROW:
      if(abs(yOff + step) < spacing) yOff += step;
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

  // console.log(`margin: ${margin}, xOff: ${xOff}, yOff: ${yOff}`);
}

function setBoxSizeAndSpacing(){
  boxS = int(pic.width / (samples*2+ 1));
  spacing = int(pic.width / (samples*2+ 1));
}