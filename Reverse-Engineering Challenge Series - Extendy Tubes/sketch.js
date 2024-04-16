/*
Author: Project Somedays
Date: 2024-04-13 last updated 2024-04-14
Title: Recode-Rethink / Reverse Engineering Challenge Series: Extendagons

Leaping off from the mesmerising animations by Seohywork: https://x.com/seohyowork/status/1774789646578536803

Things to play with (watch this space):
  - Various easing functions
  - Offset cycles of different speed rather than perlin noise directly controlling h
  - Spacing/Density
  - Curved Tubes
  - 3D implementation

UPDATE: refactored to allow choosing generation and update methods WAY easily
*/

const palettes = [
  // ['#ffffff'],
  ['#f72585', '#b5179e', '#7209b7', '#560bad',' #480ca8', '#3a0ca3', '#3f37c9', '#4361ee', '#4895ef', '#4cc9f0'],
  ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000', '#dc2f02', '#e85d04',' #f48c06', '#faa307', '#ffba08'],
  ['#d9ed92', '#b5e48c','#99d98c','#76c893', '#52b69a', '#34a0a4', '#168aad', '#1a759f', '#1e6091', '#184e77'],
  ['#3a0f72', '#6023b0', '#7826e3', '#8e48eb', '#a469f2', '#bb4fcd', '#d235a8', '#ff005e', '#250b47'],
  ['#007f5f', '#2b9348', '#55a630', '#80b918', '#aacc00', '#bfd200', '#d4d700', '#dddf00', '#eeef20', '#ffff3f'],
  ['#012a4a', '#013a63', '#01497c', '#014f86', '#2a6f97', '#2c7da0', '#468faf', '#61a5c2', '#89c2d9', '#a9d6e5'],
  ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1'],
  ['#0466c8', '#0353a4', '#023e7d', '#002855', '#001845', '#001233', '#33415c', '#5c677d', '#7d8597', '#979dac'],
  ['#7400b8', '#6930c3', '#5e60ce', '#5390d9', '#4ea8de', '#48bfe3', '#56cfe1', '#64dfdf', '#72efdd', '#80ffdb'],
  ['#54478c', '#2c699a', '#048ba8', '#0db39e', '#16db93', '#83e377', '#b9e769', '#efea5a', '#f1c453', '#f29e4c'],
  ['#227c9d', '#17c3b2', '#ffcb77', '#fef9ef', '#fe6d73'],
  ['#ffbc42', '#d81159', '#8f2d56', '#218380', '#73d2de'],
  ['#d00000', '#ffba08', '#3f88c5', '#032b43', '#136f63'],
  ['#eac435', '#345995', '#03cea4', '#fb4d3d', '#ca1551']
];

// video cap biz
const captureMode = false;
let rotateMode = false;
let precessMode;
let fps = 30;
let capturer = new CCapture({
  format: 'png',
  framerate: fps
});

const archimedesSpiral = (a,b,t) => createVector(a*cos(t)*(t)**(1/b),a*sin(t)*(t)**(1/b));

const noiseRate = 200;
let maxHFrac;
let sFrac;

let cycleOffset;
let cycleFrames = 300;
const rotRate = 50;
let totalFrames = 5*cycleFrames;

let palette;
let cyclePaletteMode;
let paletteIx = -1;

let extendagons = [];

let generationMethods;
let updateMethods;

let updateMethod;
let genMethod;

function setup() {
  createCanvas(windowWidth,  windowHeight);
  // createCanvas(1080, 1080);
  // createCanvas(1920, 1080);
  pixelDensity(1);
  
  precessMode = random(1) < 0.3;
  
  maxHFrac = random(0.1, 0.2);
  sFrac = random(0.0075, 0.015);

  // choosing colours
  cyclePaletteMode = random(1) < 0.25;
  if(cyclePaletteMode){
    paletteIx = (paletteIx + 1)%palettes.length;
    palette = palettes[paletteIx];
  } else {
    palette = random(palettes);
  }
  
  console.log(paletteIx);
  console.log(palettes[paletteIx]); 
  
  
  cycleOffset = random(width);

  generationMethods =  [
    generateExtendagonsCrowdedRandDir,
    generateExtendagonsCrowdedNoiseDir,
    generateExtendagonsOnASpiral
  ];

  updateMethods = [
    updateHNoiseWithSineEasing,
    updateHSineCycle,
    updateHSineCycleStartFrameDelay
  ]

  genMethod = random(generationMethods);
  updateMethod = random(updateMethods);

  extendagons = genMethod(400);
}

function draw() {
  background(0);
  if(frameCount === 1 && captureMode) capturer.start();
  if(frameCount%cycleFrames === 0) setup();
    
  for(let t of extendagons){
    t.update(updateMethod(t));
    if(rotateMode) t.rotateVertices();
    if(precessMode) t.precess(precessExtendagons(t));
    t.show();
  }
  
  if (frameCount === totalFrames && captureMode) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  if(captureMode) capturer.capture(document.getElementById('defaultCanvas0'));
}

function precessExtendagons(extendagon){
  return 2*TWO_PI*sin((frameCount - extendagon.startFrame)/150)
}

function generateExtendagonsOnASpiral(nToProduce){
  let extendagonArr = [];
  
  for(let i = 0; i < nToProduce; i++){
    let p = archimedesSpiral(2,1,i);
    let a = 0;// map(noise(p.x/noiseZoom, p.y/noiseZoom), 0, 1, -PI/6, PI/6);
    let s = map(i, 0, nToProduce, 0.5, 3)*max(width, height)*sFrac;
    let hMax = map(i, 0, nToProduce, 0, 0.3*min(width, height));
    let c = palette[i%palette.length];
    extendagonArr.push(new Extendagon(width/2 + p.x, height/2 + p.y, a, s, random(4,8), hMax, c, i));
  }
  extendagonArr.sort((a,b) => b.p.y - a.p.y);
  return extendagonArr;
}

function generateExtendagonsCrowdedNoiseDir(nToProduce){
  let extendagonArr = [];
  let noiseZoom = random(300,500);
  for(let col = 0; col < width*1.2 ; col += min(width, height)*sFrac*3){
    for(let row = 0; row < height*1.2; row += min(width, height)*sFrac*3){
      let params = {
        cx : col,
        cy : row,
        a : map(noise(col/noiseZoom, row/noiseZoom), 0, 1, -PI/6, PI/6) + HALF_PI,
        s : random(0.5*max(width, height)*sFrac, max(width, height)*sFrac),
        n : int(random(4,8)),
        h : max(width, height)*maxHFrac,
        colour : random(palette),
        startFrame : 0
      }
      extendagonArr.push(new Extendagon(params));
    }
  }
  return extendagonArr;
}

function generateExtendagonsCrowdedNoiseDirwColour(nToProduce){
  let extendagonArr = [];
  let noiseZoom = random(300,500);
  for(let col = 0; col < width*1.2 ; col += min(width, height)*sFrac*3){
    for(let row = 0; row < height*1.2; row += min(width, height)*sFrac*3){
      let noiseVal = noise(col/noiseZoom, row/noiseZoom)
      let c = palette[int(map(noiseVal, 0, 1, 0, palette.length))];
      let params = {
        cx : col,
        cy : row,
        a : map(noiseVal, 0, 1, -PI/6, PI/6) + HALF_PI,
        s : random(0.5*max(width, height)*sFrac, max(width, height)*sFrac),
        n : int(random(4,8)),
        h : max(width, height)*maxHFrac,
        colour : c,
        startFrame : 0
      }
      extendagonArr.push(new Extendagon(params));
    }
  }
  return extendagonArr;
}

function generateExtendagonsCrowdedRandDir(nToProduce){
  let extendagonArr = [];
  for(let col = 0; col < width*1.2 ; col += min(width, height)*sFrac*2){
    for(let row = 0; row < height*1.2; row += min(width, height)*sFrac*2){
      let params = {
        cx : col,
        cy : row,
        a : random(PI),
        s : random(0.5*max(width, height)*sFrac, max(width, height)*sFrac),
        n : int(random(4,8)),
        h : max(width, height)*maxHFrac,
        colour : random(palette),
        startFrame : 0
      }
      extendagonArr.push(new Extendagon(params));
    }
  }
  return extendagonArr;
}

function updateHNoiseWithSineEasing(extendagon){
  let noiseVal = noise(extendagon.noiseOffset + frameCount/noiseRate);
  return 0.5*(sin(noiseVal*HALF_PI) + 1)*max(width, height)*maxHFrac;
}

function updateHSineCycle(extendagon){
  let offset = map(extendagon.p.x + cycleOffset - extendagon.p.y, 0, width + cycleOffset+ height, 0, TWO_PI);
  let a = radians(frameCount) - offset;
  return 0.5*(sin(a) + 1)*max(width, height)*maxHFrac;//sin(a) < 0 ? 0 : 0.5*(sin(a) + 1)*max(width, height)*maxHFrac;
}

function updateHSineCycleStartFrameDelay(extendagon){
  return 0.5*(sin(2*(radians(frameCount - extendagon.startFrame) - HALF_PI)/10) + 1)*min(width, height)*maxHFrac;
}

function mousePressed(){
  if(mouseButton === LEFT){
    setup();
  }
}

function compareAngles(a, b) {
  let angleA = atan2(a.y, a.x);
  let angleB = atan2(b.y, b.x);
  return angleA - angleB;
}
