/*
Author: Project Somedays
Date: 2024-08-24
Title: WCCChallenge 2024 Week 34 - Rewind

Made for Sableraph's weekly creative coding challenges, reviewed weekly on https://www.twitch.tv/sableraph
See other submissions here: https://openprocessing.org/curation/78544
Join The Birb's Nest Discord community! https://discord.gg/g5J6Ajx9Am

Love those videos of rewinding destruction/chaos
Choose your background image: SABLERAPH, BIRB

It works like a highspeed camera - the previous captureFrames are always being captured


RESOURCES:
- Matter.js
- lil-gui
- fxHash Sableraph image: https://gateway.fxhash.xyz/ipfs/Qmai8R24bQjCrdRwsM5dgWjk6Q73gNPHTWm4cgQ8G2WFZn
- birb: https://www.deviantart.com/arrupako/art/Birb-634103522
- 

INTERACTION:
- Choose your interaction mode: BOMB, WRECKING_BALL
- Press space or hit the button to stop overwriting the frameBuffer


TODO: Indicate how long until the buffer is full
TODO: Fix weird glitches the where things escape
TODO: Add a distance effect from the explosion

*/


// gui biz
let params, gui;

let modes = Object.freeze({
  NONE: "None",
  BOMB: "Bomb",
  WRECKING_BALL: "Wrecking Ball"
})

// images
let sableraphImg;
let birb;
let derp;
let projectsomedays;

// graphics
let canvas;
let srcImgLayer;

// matter.js
let boxes = [];
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Constraint = Matter.Constraint;
let engine, world;

// environment
let wallThick;


// control
let playbackMode = false;
let rewind = false;
let frames = [];
let runSim = false;
let startPlaybackFrame = 0;

function preload(){
  sableraphImg = loadImage("sableraph.png");
  birb = loadImage("birb.png");
  derp = loadImage("derpyhorse.png");
  projectsomedays = loadImage("me.png");

}

function setup() {
  canvas = createCanvas(min(windowWidth, windowHeight),min(windowWidth, windowHeight));

  pixelDensity(1);
  noStroke();
  imageMode(CENTER);

  wallThick = width/4;
  
  // Matter.js world biz
  engine = Engine.create();
  world = engine.world;
  
  gui = new lil.GUI();
  
  params = {
    img: birb,
    boxSize: 20,
    showBoxes: true,
    showImage: false,
    mode: modes.BOMB,
    captureLength: 120,
    explosionStrength: 20,
    gravityStrength: 5.0,
    canInteract: false,
    togglePlaybackMode: togglePlayback,
    reset: resetWorld,
    manualOverrideRunSim: toggleRunSim
  }

  gui.add(params, 'img', {
    'sableraph' : sableraphImg,
    'birb' : birb,
    'derp': derp,
    'me':projectsomedays
  }).onChange(() => resetWorld());
  gui.add(params, 'boxSize', 15, 100, 1).onChange(() => {
    runSim = false;
    resetWorld();
  });
  gui.add(params, 'mode', [modes.BOMB, modes.WRECKING_BALL]);
  gui.add(params, 'showBoxes');
  gui.add(params, 'showImage');
  gui.add(params, 'canInteract');
  gui.add(params, 'captureLength', 30, 300, 5);
  gui.add(params, 'explosionStrength', 5, 50, 1);
  gui.add(params, 'gravityStrength', 1.0, 10.0, 0.1).onChange(value => engine.gravity.y = value);
  gui.add(params, 'togglePlaybackMode');
  gui.add(params, 'manualOverrideRunSim');
  gui.add(params, 'reset');
  

  srcImgLayer = createGraphics(width, height);
  srcImgLayer.imageMode(CENTER);
  

  resetWorld();
}

function draw() {
  background(255);

  // debugging image generation
  // if(params.showImage && !playbackMode) image(srcImgLayer, width/2, height/2);
  
  // fill the buffer and, once it's full, drop the first frame and keep writing to the end
  if(!playbackMode){
    // circle(width/2 + 0.5*width*cos(frameCount * TWO_PI/120), height/2, width/8);
    // circle(mouseX, mouseY, 100);
    Engine.update(engine);
    if(!runSim){
      for(let box of boxes){
        box.reset();
      }
    }

    for(let box of boxes){
      box.show();
    }

    if(frames.length >= params.captureLength) frames.shift();
    capture(); 
    return;
  } 
  
  if(playbackMode){
    let currentFrame = (frameCount - startPlaybackFrame) % frames.length;
    if(currentFrame === 0) rewind = !rewind;
    
    let frameIndex = rewind ? frames.length - 1 - currentFrame : currentFrame;
    console.log(`Playing back frame ${frameIndex}`);
    image(frames[frameIndex], width/2, height/2);
  }
  
}

// use some closures here - these aren't used anywhere else
function resetWorld(){
  World.clear(world);

  function generateWalls(){
    const makeWall = (x,y,w,h) => {
      return Bodies.rectangle(x, y, w, h, {isStatic: true});
    }
  
    World.add(world, makeWall(0, height/2, wallThick, height));
    World.add(world, makeWall(width, height/2, wallThick, height));
    World.add(world, makeWall(width/2, 0, width, wallThick));
    World.add(world, makeWall(width/2, height, width, wallThick));
  }

  generateWalls();


  function drawImageToCanvas(img){
    srcImgLayer.clear();
    
    srcImgLayer.image(img, width/2,width/2,img.width * (height/img.height), height);
  }
  drawImageToCanvas(params.img);
  generateBoxesFromImg(params.img)

  playbackMode = false;
  runSim = false;
  frames = [];
  

}



function capture(){
  let img = createGraphics(width, height);
  img.copy(canvas, 0, 0, width, height, 0, 0, width, height);
  frames.push(img);
  console.log(`frames.length: ${frames.length}`);
}



function generateBoxesFromImg(){
  boxes = [];
  for(let i = params.boxSize/2; i < height; i += params.boxSize/2){
    for(let j = params.boxSize/2; j < width; j += params.boxSize/2){
      let c = srcImgLayer.get(i,j);
      if(alpha(c) !== 0){
        let box = new Box(i,j,c, params.boxSize);
        boxes.push(box);
        World.add(world, box.body);
      }
      
    }
  }
  return boxes;
}


function togglePlayback(){
  startPlaybackFrame = frameCount;
  if(playbackMode) frames = [];
  playbackMode = !playbackMode;
  console.log(`Playback Mode: ${playbackMode}`);
}

function mousePressed(){

  if(!params.canInteract) return;
    
  runSim = true;
  console.log(`Run Sim: ${runSim}`);
  for(let box of boxes){
    let force = p5.Vector.sub(createVector(box.body.position.x, box.body.position.y), createVector(mouseX, mouseY)).setMag(params.explosionStrength);
    Body.setVelocity(box.body, {x: force.x, y: force.y});
  }
}

function toggleRunSim(){
  runSim = !runSim;
}

