/*
Author: Project Somedays
Date: 2024-09-04
Title: Boxes all the way down

Paving the way for some fun inverse kinematics gif loops

TODO:
 - Add user controls

*/


let corners = [];
let boxes = [];
let nBoxes = 32;
let s;
let stageFrames = 120;
let currentCornerIndex = 0;
let palette = "#f94144, #f3722c, #f8961e, #f9c74f, #90be6d, #43aa8b, #4d908e, #577590".split(", ")
let palettes = [
  "#f94144, #f3722c, #f8961e, #f9c74f, #90be6d, #43aa8b, #4d908e, #577590".split(", "),
  "#ffe9a9, #ffc518, #ff8528, #b52dc8, #6817c5, #3c1596, #2d0983, #210b56".split(", "),
  "#60b6fb, #1e96fc, #1360e2, #072ac8, #fcf300, #fedd00, #ffc600, #f6bf00".split(", "),
  "#004b23, #006400, #007200, #008000, #38b000, #70e000, #9ef01a, #ccff33".split(", "),
  "#5e60ce, #5390d9, #4ea8de, #48bfe3, #56cfe1, #64dfdf, #72efdd, #80ffdb".split(", "),
  "#f4f1de, #eab69f, #e07a5f, #8f5d5d, #3d405b, #5f797b, #81b29a, #f2cc8f".split(", "),
  "#ffbe0b, #fd8a09, #fb5607, #ff006e, #c11cad, #8338ec, #5f5ff6, #3a86ff".split(", "),
]

let cam;
let layers = 8;
let globalRotationRate = 600;

function setup() {
  // createCanvas(min(windowWidth, windowHeight) , min(windowWidth, windowHeight),  WEBGL);
  createCanvas(1080, 1080, WEBGL);
  s = width/2;
  cam = createCamera();

  corners.push(createVector(-s, s, -s)); // left top back
  corners.push(createVector(-s, s, s)); // left top front
  corners.push(createVector(s, s, s)); // right top front
  corners.push(createVector(s, -s, s)); // right bottom front
  corners.push(createVector(-s, -s, s)); // left bottom front
  corners.push(createVector(-s, -s, -s)); // left bottom back
  corners.push(createVector(s, -s, -s)); // right bottom back
  corners.push(createVector(s, s, -s)); // right top back

  let boxesPerSide = nBoxes/corners.length;
  for(let i = 0; i < corners.length; i++){
    for(let j = 0; j < boxesPerSide; j++){
      boxes.push({
        currentCornerIx: i,
        frameOffset: stageFrames * j / boxesPerSide,
        colour: palette[i],
        rotationRate: random(300,1200)
      })
    }
  }
  frameRate(60);
}

function draw() {
  background(0);
  let currentFrame = frameCount%stageFrames;

  // cam.setPosition(0,0,frameCount*width/(60*15));

  pointLight(255, 255, 255, 0, 0, 0);
  directionalLight(255, 255, 255, -0.5, -0.5, -0.5);
  ambientLight(255);

  push();
  rotateX(-frameCount * TWO_PI/globalRotationRate);
  rotateY(frameCount * TWO_PI/globalRotationRate);
  rotateZ(-frameCount * TWO_PI/globalRotationRate);
  for(let i = 0; i < palette.length; i++){
    push();
    scale(1 - i/palette.length);
    rotateX(i*HALF_PI);
    rotateY(-i*HALF_PI);
    for(let b of boxes){
      if((frameCount + b.frameOffset) % stageFrames === 0) b.currentCornerIx = (b.currentCornerIx + 1) % corners.length; // increment at the end of a row
      let progress = ((currentFrame + b.frameOffset)%stageFrames)/stageFrames;
      let p = p5.Vector.lerp(corners[b.currentCornerIx], corners[(b.currentCornerIx + 1)%corners.length], easeInOutSine(progress));
      fill(palette[i]);
      push();
      translate(p.x, p.y, p.z);
      rotateX(frameCount * TWO_PI/b.rotationRate);
      rotateY(frameCount * TWO_PI/b.rotationRate);
      rotateZ(frameCount * TWO_PI/b.rotationRate);
      box(width/20);
      pop();
    }
    pop();

  }
  pop();
  
  

  
  orbitControl();


}

function easeInOutSine(x){
  return -(Math.cos(PI * x) - 1) / 2;
  }

