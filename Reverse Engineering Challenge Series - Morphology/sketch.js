/*
Author: Project Somedays
Date: 2024-04-20
Title: Morphology

To morph in a cycle, we look at the current number of vertices

Using feedback from 

https://editor.p5js.org/jnsjknn/sketches/B1O8DOqZV
*/
let captureMode = true;


const morphCycleDuration = 60;
let r;
let endLim = 12;
let isIncreasing = true;
let startAngles = []; 
let endAngles = [];
let startSides = 3;
let endSides = 4;
let t;
let readyToMorph = true;
let morphFrame = 0;
let shadowSize = 0;
let rotisseryRate = 150;

let totalFrames = morphCycleDuration * 17;
let fps = 30;
let capturer = new CCapture({
  format: 'png',
  framerate: fps
});

function setup(){
  createCanvas(1080, 1920);
  pixelDensity(1);
  r = width/5;
  morph(startSides, endSides);
  colorMode(HSB, 360, 255, 255, 255);
  noStroke();
  stroke(1,0,255,255);
  strokeWeight(5);
  noFill();
  
  console.log(`startAngles: ${startAngles}`);
  console.log(`endAngles: ${endAngles}`);
  imageMode(CENTER);

  background(0);
}

function draw(){

  if(frameCount === 1 && captureMode) capturer.start();

  fill(frameCount%360, 255, 255, 200);
  if(t < 0.01 && readyToMorph){
      morphFrame = frameCount;
      if(isIncreasing && endSides <= endLim) endSides ++;
      if(!isIncreasing && endSides >= startSides) endSides --;
      if(endSides === endLim) isIncreasing = false;
      if(endSides === startSides) isIncreasing = true;
      morph(startSides, endSides);
  }

  readyToMorph = (frameCount - morphFrame > 0.1*morphCycleDuration)

  shadowSize = 0.5*sin(frameCount*TWO_PI/(sqrt(2)*morphCycleDuration) + 1)*0.035 + 1;

  t = 0.5*(sin(frameCount*TWO_PI/morphCycleDuration) + 1);

  push();
  
  translate(width/2, height/8);
  beginShape();
  for(let i = 0; i < startAngles.length; i++){
    let a = lerp(startAngles[i], endAngles[i], t);
    vertex(r*cos(a + frameCount/rotisseryRate), 0.25*r*sin(a + frameCount/rotisseryRate));
  }
  endShape(CLOSE);
  pop();

  let g = get();
  let xShift = noise(frameCount, 0, 1, -width/4, width/4);
  image(g, width/2 + xShift , height/2 + height/100, width*shadowSize, height*shadowSize);

  if (frameCount === totalFrames && captureMode) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  if(captureMode) capturer.capture(document.getElementById('defaultCanvas0'));
}

function morph(startSides, endSides){

    startAngles = [];
    for(let i = 0; i < startSides; i++){
      startAngles.push(i*TWO_PI/startSides);
    }

    endAngles = [];
    for(let i = 0; i < endSides; i++){
      endAngles.push(i*TWO_PI/endSides);
    }

      for(i = 0; i < abs(endSides - startSides); i++){
        if(endSides > startSides){
          startAngles.unshift(0);
        }  else {
          endAngles.unshift(0);

        }
        
      }
  }
  