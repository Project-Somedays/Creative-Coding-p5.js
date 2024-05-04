/*
Author: Project Somedays
Date: 2024-04-23
Title: Morphology 2.0

Experiments in morphing between regular shapes.

WIP. Pretty hacky at the moment.

Leaping off from a great feedback tutorial from Aaron Reuland (a_ soluble_fish): https://openprocessing.org/sketch/2239520
Check out his profile! He has really cool stuff: https://openprocessing.org/user/183691?view=sketches&o=48

In this iteration, we spawn new points on the sides of initial shape and lerp to them

Scalar projection code: https://editor.p5js.org/codingtrain/sketches/c4jmHLFQI

CCapture tutorial: https://editor.p5js.org/jnsjknn/sketches/B1O8DOqZV
*/
let captureMode = false;

const morphCycleDuration = 60;
let r;
let endLim = 12;
let isIncreasing = true;
let startAngles = []; 
let endAngles = [];
let startVertices = [];
let endVertices = [];
let transitionVertices = [];
let startSides = 3;
let endSides = 4;
let c;
let origin;

let rotisseryRate = 150;

// capture stuff
let totalFrames = morphCycleDuration * 17;
let fps = 30;
let capturer = new CCapture({
  format: 'png',
  framerate: fps
});

function setup(){
  createCanvas(1080, 1080);
  c = createVector(width/2, height/2);
  origin = createVector(0,0);
  pixelDensity(1);
  r = width/3;
  // morphFromTriangles(startSides, endSides);
  // colorMode(HSB, 360, 255, 255, 255);
  // noStroke();
  // stroke(1,0,255,255);
  strokeWeight(1);
  noFill();
  
  // console.log(`startAngles: ${startAngles}`);
  // console.log(`endAngles: ${endAngles}`);
  imageMode(CENTER);


  // startSides
  for(let i = 0; i < startSides; i++){
    let a = (i*TWO_PI/startSides);
    startAngles[i] = a;
    startVertices[i] = createVector(r*cos(a), r*sin(a));
  }

  //endSides
  for(let i = 0; i < endSides; i++){
    let a = (i*TWO_PI/endSides);
    endAngles[i] = a;
    endVertices[i] = createVector(r*cos(a), r*sin(a));
  }


  all_vertices = startVertices.concat(endVertices);
  console.log(all_vertices);
  // order them in polar order
  all_vertices.sort((a,b) => p5.Vector.sub(origin,a).heading() - p5.Vector.sub(origin,b).heading());
  console.log(all_vertices);


  
}



function draw(){

  background(0);

  
  push();
  stroke(255,0,0);
  translate(width/2, height/2);
  showShape(startAngles);

  stroke(0,255,0);
  showShape(endAngles);

  stroke(255);
  for(let i =0; i < all_vertices.length; i++){
    let v = all_vertices[i];
    circle(v.x, v.y, 5);
    text(i, v.x, v.y - 10);
  }

  pop();

  



  


  // if(frameCount === 1 && captureMode) capturer.start();

  // fill(frameCount%360, 255, 255, 200);
  // if(t < 0.01 && readyToMorph){
  //     morphFrame = frameCount;
  //     if(isIncreasing && endSides <= endLim) endSides ++;
  //     if(!isIncreasing && endSides >= startSides) endSides --;
  //     if(endSides === endLim) isIncreasing = false;
  //     if(endSides === startSides) isIncreasing = true;
  //     morphFromTriangles(startSides, endSides);
  // }

  // readyToMorph = (frameCount - morphFrame > 0.1*morphCycleDuration)

  // shadowSize = 0.5*sin(frameCount*TWO_PI/(sqrt(2)*morphCycleDuration) + 1)*0.035 + 1;

  // t = 0.5*(sin(frameCount*TWO_PI/morphCycleDuration) + 1);

  // push();
  
  // translate(width/2, height/8);
  // beginShape();
  // for(let i = 0; i < startAngles.length; i++){
  //   let a = lerp(startAngles[i], endAngles[i], t);
  //   vertex(r*cos(a + frameCount/rotisseryRate), 0.25*r*sin(a + frameCount/rotisseryRate));
  // }
  // endShape(CLOSE);
  // pop();

  // let g = get();
  // let xShift = noise(frameCount, 0, 1, -width/4, width/4);
  // image(g, width/2 + xShift , height/2 + height/100, width*shadowSize, height*shadowSize);

  // if (frameCount === totalFrames && captureMode) {
  //   noLoop();
  //   console.log('finished recording.');
  //   capturer.stop();
  //   capturer.save();
  //   return;
  // }

  // if(captureMode) capturer.capture(document.getElementById('defaultCanvas0'));
}

function showShape(angles){
  beginShape();
  for(let i = 0; i < angles.length; i++){
    vertex(r*cos(angles[i]), r*sin(angles[i]));
  }
  endShape(CLOSE);
}

// morph from 
function morphFromTriangles(startSides, endSides){

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

class MorphShape{
  constructor(startSides){
    this.startSides = startSides;
    this.endSides = endSides;
  }

  setTargets(){
    this.startVertices = [];
    for(let i = 0; i < this.startSides; i++){
      let a = i*TWO_PI/this.startSides;
      this.startVertices[i] = createVector(r*cos(a), r*sin(a));
    }

    this.endVertices = [];
    for(let i = 0; i < this.endSides; i++){
      let a = i*TWO_PI/this.endSides;
      this.startVertices[i] = createVector(r*cos(a), r*sin(a));
    }

    if(this.startSides < this.endSides){
      
    }



  }

  show(){
    beginShape();
    
    endShape(CLOSE);
  }
}
  

function vectorProjection(a, b) {
  let bCopy = b.copy().normalize();
  let sp = a.dot(bCopy);
  bCopy.mult(sp);
  return bCopy;
}