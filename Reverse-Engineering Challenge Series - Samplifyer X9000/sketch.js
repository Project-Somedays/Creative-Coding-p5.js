/*
Author: Project Somedays
Date: 2024-04-17
Title: The Samplifier X9000

Saw it here first: https://www.youtube.com/watch?v=U1KiC0AXhHg
Was a great usecase for the p5.js copy() function

*/

let sandboxMode = false;

// animation mode
let boxSOffset, xOffset, yOffset;

let pics = []; // src images
let currentPicIndex = 0;
let currentPic;
let sclF; // to draw the final image
let dst; // final target image
let targeting; // debug view
let boxS;
let samples = 8;
let xOff = 0;
let yOff = 0;
let step = 10;
let zoomStep = 5;
let spacing;
let cycleFrames = 600;
function preload(){
  // pics.push(loadImage("images/george_washington.jpg"));
  // pics.push(loadImage("images/Mona_Lisa.jpg"));
  // pics.push(loadImage("images/van_Gogh.jpg"));
  // pics.push(loadImage("images/American_Gothic.jpg"));
  // pics.push(loadImage("images/Girl_with_a_Pearl_Earring.jpg"))
  // pics.push(loadImage("images/Che_Guevara.jpg"));
  pics.push(loadImage("images/Ghandi.jpg"));
  pics.push(loadImage("images/Nelson_Mandela.jpg"));
  pics.push(loadImage("images/Beethoven.jpg"));
  pics.push(loadImage("images/Churchill.jpg"));
  pics.push(loadImage("images/Dali.jpg"));
  pics.push(loadImage("images/Ducreux1.jpg"));
  pics.push(loadImage("images/Einstein.jpg"));
  pics.push(loadImage("images/Marx.jpg"));
  
}

function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(1920, 1080);
  boxSOffset = random(1000);
  xOffset = random(1000);
  yOffset = random(1000);

  currentPic = pics[currentPicIndex];
 
  imageMode(CENTER);
  noFill();
  refreshGraphics();

  sclF = min(height/currentPic.height, 0.5*width/currentPic.width);
  dst = createGraphics(currentPic.width, currentPic.height);
  
  setBoxSizeAndSpacing();
}

function draw() {
  background(0);
  dst.clear();

  if(!sandboxMode){
    // xOff = int(map(noise(xOffset + frameCount/500), 0, 1, -spacing/2, spacing/2));
    // yOff = int(map(noise(yOffset + frameCount/500), 0, 1, -spacing/2, spacing/2));
    xOff = 0;
    yOff = 0;
    let boxDefault = int(currentPic.width / (samples*2+ 1));
    // boxS = int(map(noise(boxSOffset + frameCount/100), 0, 1, boxDefault*0.1, 5*boxDefault));
    boxS = map(sin(-frameCount*TWO_PI/cycleFrames),-1, 1, 1.5,3)*boxDefault;
    if(frameCount%cycleFrames === 0) refreshGraphics();
  }
  
 
  for(let i = 0; i < currentPic.width/spacing; i ++){
    for(let j = 0; j < currentPic.height/spacing; j ++){
      let tlx = i*2*spacing + xOff - boxS/2;
      let tly = j*2*spacing + yOff - boxS/2;
      targeting.rect(tlx, tly, boxS, boxS);
      dst.copy(currentPic, tlx, tly, boxS, boxS, i*currentPic.width/samples, j*currentPic.width/samples, currentPic.width/samples, currentPic.width/samples);
    }
  }
  
  // drawing final images and overlays
  let debugScl = 0.5;
  let masterScl = 1.5;
  push();
  translate(width/2,height/2);
  rotate(-HALF_PI);
  image(dst, 0, 0, dst.width*sclF*masterScl, dst.height*sclF*masterScl);
  image(currentPic, -width*0.2, -height*0.7, currentPic.width*sclF*debugScl, currentPic.height*sclF*debugScl);
  image(targeting, -width*0.2, -height*0.7, currentPic.width*sclF*debugScl, currentPic.height*sclF*debugScl);
  
  pop();
 
  // for(let s of samples){
  targeting.clear();  
  // }
}


function keyPressed(){
  if(sandboxMode){
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
        if(samples - 1 > 0) samples --;
        setBoxSizeAndSpacing();
        break;
      case " ":
        save("Sampler.png");
        break;
      case "s":
        sandboxMode = !sandboxMode;
        break;
      default:
        break;
    }
  } else{
    switch(key){
      case ",":
        if(samples - 1 > 0) samples --;
        setBoxSizeAndSpacing();
        break;
      case " ":
        save("Sampler.png");
        break;
      case " ":
        save("Sampler.png");
        break;
      case "s":
        sandboxMode = !sandboxMode;
        break;
      default:
        break;
  }
  

  // console.log(`margin: ${margin}, xOff: ${xOff}, yOff: ${yOff}`);
}
}

function mousePressed(){
  if(mouseButton === LEFT){
    refreshGraphics();
  }
}

function refreshGraphics(){
  currentPic = pics[currentPicIndex];
  sclF = min(height/currentPic.height, width/currentPic.width);
  dst = createGraphics(currentPic.width, currentPic.height);
  setBoxSizeAndSpacing();
  targeting = createGraphics(currentPic.width, currentPic.height)
  targeting.stroke(255);
  targeting.strokeWeight(5);
  targeting.noFill();
  currentPicIndex = (currentPicIndex + 1)%pics.length;
}

function setBoxSizeAndSpacing(){
  boxS = int(currentPic.width / (samples*2+ 1));
  spacing = int(currentPic.width / (samples*2+ 1));
}