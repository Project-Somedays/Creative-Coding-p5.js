/*
Author: Project Somedays
Date: 2024/10/20
Title: Reverse-Engineering Challenge Series - Go Go Gadget ExtendoSphere

Slowly learning not every sketch has to be maximum effort 🤣
Riffing on this fun post from Joe Ryba https://x.com/joe_ryba/status/1838577693845024943

Resources:
- Easing Functions from https://easings.net/

*/



let frames = 180;
let rotationCycleFrames = 500;
let thickness;
let palette = "#f72585, #b5179e, #7209b7, #560bad, #480ca8, #3a0ca3, #3f37c9, #4361ee, #4895ef, #4cc9f0".split(", ");
let progress = 0;
let growing = true;

function setup() {
  // createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
  createCanvas(1080, 1080, WEBGL);
  palette = [...palette, ...palette.slice(1,palette.length).reverse()]; // do the whole spectrum there and back again
  
  noFill();
  thickness = height/40;
}

function draw() {
  rotateX(HALF_PI);
  background(0);
  directionalLight(255, 255, 255, 1, 1, -1);
  directionalLight(255, 255, 255, 1, -1, -1);
  directionalLight(255, 255, 255, -1, 1, -1);
  rotateX(TWO_PI * frameCount/rotationCycleFrames);
  rotateY(-TWO_PI * frameCount/rotationCycleFrames);
  rotateZ(TWO_PI * frameCount/rotationCycleFrames);

  


  if(frameCount%frames === 0) growing = !growing;

  if(growing){
    progress += 1/frames;
  } else{
    progress -= 1/frames;
  }
  
  // let r =  0.5*(sin(frameCount *  TWO_PI / frames) + 1.25) * width/10;
  let r = (easeInOutElastic(progress) + 0.25) * width/4;
  let n = floor(r/thickness);

  normalMaterial();
  for(let i = 0; i < n; i++){
    let a = asin((i+1)*thickness/r);
    let col = palette[i % palette.length];
    let thisR = r*cos(a);
    fill(col);
    cylinder(thisR, (i+1)*thickness*2, 32);
  }

  // sphere(r);
  orbitControl();
}


function easeInOutSine(){
  return 0.5*(cos(frameCount * TWO_PI/frames));
}

function easeInOutElastic(x) {
  const c5 = (2 * Math.PI) / 4.5;
  
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
    : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
  }
