/*
Author: Project Somedays
Date: 2024-08-24
Title: WCCChallenge 2024 Week 34 - Rewind

Made for Sableraph's weekly creative coding challenges, reviewed weekly on https://www.twitch.tv/sableraph
See other submissions here: https://openprocessing.org/curation/78544
Join The Birb's Nest Discord community! https://discord.gg/g5J6Ajx9Am

Love me some wanton pixel destruction 💣💥🤯
Sampling from the image to make Matter.js boxes
Saving the canvas as an image that gets played back in order and then in reverse order during playback mode

INSTRUCTIONS
- Start the recording - you'll see the progress bar across the bottom
- Right Click: Set off an explosion
- Click release hold to let the slumpage begin
- Reset to the start again

QUESTIONS
How do you stop the usual right click options coming up?
Tried left click and it was too annoying with constantly setting off explosions

RESOURCES:
- Matter.js: https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.20.0/matter.min.js
- lil-gui: https://cdn.jsdelivr.net/npm/lil-gui@0.19.2/dist/lil-gui.umd.min.js
- fxHash Sableraph image: https://gateway.fxhash.xyz/ipfs/Qmai8R24bQjCrdRwsM5dgWjk6Q73gNPHTWm4cgQ8G2WFZn
- birb: https://i.kym-cdn.com/entries/icons/facebook/000/019/189/birb.jpg
- GorillaSun (used with permission! Much thanks!)  https://pbs.twimg.com/profile_images/1516050989241057281/05gwFNl3_400x400.jpg
- Grumpy Cat: https://media.wired.com/photos/5cdefc28b2569892c06b2ae4/master/w_2560%2Cc_limit/Culture-Grumpy-Cat-487386121-2.jpg
- Overly Attached GF: https://helios-i.mashable.com/imagery/articles/06NwyMPotETRux7TrR6H74Q/hero-image.fill.size_1200x1200.v1614270598.jpg
- Wonka Meme: https://helios-i.mashable.com/imagery/articles/00jdsdJ5TJ5j9pExdUWjQaC/hero-image.fill.size_1200x900.v1611611940.jpg
- The Coding Train's excellent tutorials on Matter.js: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6bLh3T_4wtrmVHOrOEM1ig_


TASK LIST
TODO: Fix bug where hitting toggle playback before recording crashes everything
TODO: Fix bug where hitting startstopRecord too fast crashes everything
TODO: Tidy up logic --> currently hidden in too many places for my liking

DONE: Indicate how long until the buffer is full
KINDA DONE: Fix weird glitches the where things escape - make walls MUCH fatter
DONE: Add a distance effect from the explosion
DONE: Move controls to right click for explosions
DONE: Add adjustment for capture duration
DONE: Make fall and record on load
DONE: Add bg colour adjustment
*/


// gui biz
let params, gui;
let samplingBiz;
let interactionBiz;
let captureBiz;

// images
let sableraphImg;
let birb;
let derp;
let projectsomedays;
let gorillasun;
let gfmeme;
let wonkameme;

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
let holdInPlace = false;
let startPlaybackFrame = 0;
let recordingMode = false;

function preload(){
  sableraphImg = loadImage("sableraph.png");
  birb = loadImage("birb.png");
  derp = loadImage("derpyhorse.png");
  projectsomedays = loadImage("Me.png");
  gorillasun = loadImage("gorillasun.png");
  gfmeme = loadImage("gf.png");
  wonkameme = loadImage("wonka.png");
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
  

  // declaring variables for adjustment and their default values
  params = {
    img: sableraphImg,
    boxSize: 10,
    captureFrameLimit: 120,
    explosionStrength: 15,
    explosionRadius: width/2,
    gravityStrength: 5.0,
    transparencyThreshold: 5,
    imgScale: 0.66,
    togglePlaybackMode: togglePlayback,
    'startStopRecording': startStopRecording,
    reset: resetWorld,
    releaseHold: releaseHold,
		bgColour: "#000000"
  }
	
	gui.addColor(params, 'bgColour');
  samplingBiz = gui.addFolder("Sampling Biz");
  samplingBiz.add(params, 'img', {
    'Sableraph' : sableraphImg,
    'Birb' : birb,
    'Derpy Horse': derp,
    'me':projectsomedays,
    'gorillasun':gorillasun,
    'gfmeme' : gfmeme,
    'wonkameme': wonkameme
  }).onChange(() => resetWorld());
  samplingBiz.add(params, 'boxSize', 5, 100, 1).onChange(() => {resetWorld()});
  samplingBiz.add(params, 'imgScale', 0, 1).onChange(() => {resetWorld()});
  samplingBiz.add(params, 'transparencyThreshold', 0, 50, 1).onChange(() => resetWorld());

  interactionBiz = gui.addFolder("Interaction/Sim Biz");
  interactionBiz.add(params, 'explosionStrength', 5, 50, 1);
  interactionBiz.add(params, 'explosionRadius', width/8, sqrt(2)*width);
  interactionBiz.add(params, 'gravityStrength', 1.0, 10.0, 0.1).onChange(value => engine.gravity.y = value);
  interactionBiz.add(params, 'releaseHold');
  
  captureBiz = gui.addFolder("Capture Biz");
  captureBiz.add(params, 'captureFrameLimit', 30, 300, 5);
  captureBiz.add(params, 'startStopRecording');
  captureBiz.add(params, 'togglePlaybackMode');

  gui.add(params, 'reset');

  srcImgLayer = createGraphics(width, height);
  srcImgLayer.imageMode(CENTER);
  
  resetWorld();
	holdInPlace = false;
	recordingMode = true;
}

function draw() {
  background(params.bgColour);
 
  if(!playbackMode){
    
    Engine.update(engine);
    if(holdInPlace){
      for(let box of boxes){
        box.reset();
      }
    }

    for(let box of boxes){
      box.show();
    }

    if(recordingMode && frames.length < params.captureFrameLimit){
      captureFrame();
      showProgressBar();
    }

    if(frames.length === params.captureFrameLimit){
      recordingMode = false;
      playbackMode = true;
    }
    
    return;
  } 
  
  if(playbackMode){
    let currentFrame = (frameCount - startPlaybackFrame) % frames.length;
    if(currentFrame === 0) rewind = !rewind;
    
    let frameIndex = rewind ? frames.length - 1 - currentFrame : currentFrame; 
    // console.log(`Playing back frame ${frameIndex}`);
    image(frames[frameIndex], width/2, height/2);
  }
  
}

// use some closures here - these other functions aren't used anywhere else
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

  function drawImageToCanvas(img){
    srcImgLayer.clear();
    srcImgLayer.image(img, width/2,width/2,img.width * (height/img.height)*params.imgScale, height*params.imgScale);
  }
  
  function generateBoxesFromImg(){
    boxes = [];
    for(let i = params.boxSize/2; i < height; i += params.boxSize/2){
      for(let j = params.boxSize/2; j < width; j += params.boxSize/2){
        let c = srcImgLayer.get(i,j);
        if(alpha(c) > params.transparencyThreshold){
          let box = new Box(i,j,c, params.boxSize);
          boxes.push(box);
          World.add(world, box.body);
        }
      }
    }
    return boxes;
  }

  generateWalls();

  drawImageToCanvas(params.img);
  generateBoxesFromImg(params.img)

  playbackMode = false;
  holdInPlace = true;
  frames = [];
}



function captureFrame(){
  let img = createGraphics(width, height);
  img.copy(canvas, 0, 0, width, height, 0, 0, width, height);
  frames.push(img);
  // console.log(`frames.length: ${frames.length}`);
}

function showProgressBar(){
  fill(0,255,0);
  noStroke();
  rect(0, height*0.95, width*frames.length/params.captureFrameLimit, height);
}





function togglePlayback(){
  startPlaybackFrame = frameCount;
  playbackMode = !playbackMode;
  // console.log(`Playback Mode: ${playbackMode}`);
}

function mousePressed(){
  if(mouseButton === RIGHT){
    holdInPlace = false;
    applyExplosionToBoxes();
  }
}

function applyExplosionToBoxes(){
  let src = createVector(mouseX, mouseY);
  for(let box of boxes){
    let d = dist(box.body.position.x, box.body.position.y, src.x, src.y);
    if(d > params.explosionRadius) continue;
    let force = p5.Vector.sub(createVector(box.body.position.x, box.body.position.y), src)
    let forceMag = params.explosionStrength * (1 - params.explosionRadius/(sqrt(2)*width)); 
    force.setMag(forceMag);
    Body.setVelocity(box.body, {x: force.x, y: force.y});
  }
}

function releaseHold(){
  holdInPlace = !holdInPlace;
}

function startStopRecording(){
  if(recordingMode){
    playbackMode = true;
    startPlaybackFrame = frameCount;
  } else{
    frames = [];
  }
  
  recordingMode = !recordingMode;
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}