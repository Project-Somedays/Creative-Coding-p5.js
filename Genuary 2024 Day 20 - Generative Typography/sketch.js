/*
Author: Project Somedays
Date: 2024-05-16 completed 2024-05-18
Title: Genuary 2024 Day 20 - Generative Typography

Building off Dan Shiffman's excellent Inverse Kinematics code: https://www.youtube.com/watch?v=hbgDqyy8bIw

*/

// ------------- TEXTBIZ --------------//
const msg = "GENERATIVE\nTYPOGRAPHY";
const fonts = ['Arial', 'Times New Roman', 'Helvetica', 'Verdana', 'Courier New', 'Georgia', 'Tahoma', 'Trebuchet MS', 'Comic Sans MS', 'Impact', 'Calibri', 'Garamond', 'Palatino Linotype', 'Lucida Sans', 'Century Gothic', 'Franklin Gothic Medium', 'Bookman Old Style', 'Gill Sans', 'Monotype Corsiva', 'Arial Black'];
let genLetters = [];
let maxTextHeight;


// ----------------- COLOURS ------------------//
const palettes = [
  "#d9ed92, #b5e48c, #99d98c, #76c893, #52b69a, #34a0a4, #168aad, #1a759f, #1e6091, #184e77".split(", "),
  "#f72585, #b5179e, #7209b7, #560bad, #480ca8, #3a0ca3, #3f37c9, #4361ee, #4895ef, #4cc9f0".split(", "),
  "#f94144, #f3722c, #f8961e, #f9844a, #f9c74f, #90be6d, #43aa8b, #4d908e, #577590, #277da1".split(", "),
  "#2364aa, #3da5d9, #73bfb8, #fec601, #ea7317".split(", "),
  "#7400b8, #6930c3, #5e60ce, #5390d9, #4ea8de, #48bfe3, #56cfe1, #64dfdf, #72efdd, #80ffdb".split(", "),
  "#800016, #a0001c, #c00021, #ff002b, #ffffff, #407ba7, #004e89, #002962, #00043a".split(", ")
]
let currentPalette;


// ---------- RECORDING BIZ ------------- //
const captureMode = false;
const fps = 30;
let capturer;
let moveFrames = 30;


// ------------- ARMBIZ -------------//
const handMode = false;
const armSegments = 6;
let servoSound;

let maxLength;
let arms = [];


// CONVEYORBELT
let conveyorBelt;

// ---------- CONTROL -------------//
let currentFrame = 0;
let currentPhase;
let frameCnv;
let conveyorRate = 1;

// ---------- PHASEBIZ -------------- //
let phases = {
  DEPLOY_LETTERS:    {phaseName: "DEPLOY_LETTERS",    frames: 60},
  DISENGAGE_ARMS: {phaseName: "DISENGAGE_ARMS", frames: 60},
  MOVE_OUT:       {phaseName: "MOVE_OUT",       frames: 60}
}
let phaseOrder = [phases.DEPLOY_LETTERS, phases.DISENGAGE_ARMS, phases.MOVE_OUT];
setCumulativeFrames(phaseOrder);
const totalFrames = phaseOrder[phaseOrder.length - 1].cumulativeFrames;
console.log(phaseOrder);
console.log(totalFrames);


let arm;

function preload(){
  glove = loadImage("glove.png");
  servoSound = loadSound("mechanicalclamp-6217.mp3");
  
}


function setup() {
  // createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
  createCanvas(1080, 1080);
  pixelDensity(1);
  imageMode(CENTER);
  rectMode(CENTER);
  


  currentPalette = random(palettes);
  
  textAlign(CENTER, CENTER);

  maxTextHeight = height/10;
  
  textSize(maxTextHeight);

  genLetters = convertTextToGenLetters(msg);
  console.log(genLetters);
  arms = generateArmsFromGenLetters(genLetters);
  console.log(arms);

  conveyorBelt = new Conveyor(height/3, width/10);


  capturer = new CCapture({
    format: 'png',
    framerate: fps
  });
 
	if(!captureMode) frameRate(30);

  arm = new Arm(width/2, height/2, width/4, height/4);


  
	describe("Robot arms move letters in to spell 'GENERATIVE TYPGOPRAPHY' in random fonts, fontsizes and colours on a conveyor belt. The conveyor belt moves on and the sequence starts again.");
}











function draw() {
  if(captureMode && frameCount === 1) capturer.start()
  
  background(0);


  arm.setTarget(mouseX, mouseY);
  // arm.update();
  arm.show();


  // conveyorBelt.update();
  // conveyorBelt.show();



  // for(let s of genLetters){
  //   s.show();
  // }

  // currentFrame = frameCount%totalFrames;

  // // ------------------- DETERMINE THE CURRENT FRAME ------------------- //
  // if(getCurrentPhase(currentFrame) !== currentPhase){
  //   currentPhase = getCurrentPhase(currentFrame);
  //   console.log(currentPhase.phaseName);
  // };

  // // ------------------ ON RESET ----------------- //
  // if(currentFrame === 0){
  //   currentPalette = random(palettes);
  //   genLetters = convertTextToGenLetters(msg);
  // }

  // switch(currentPhase){

  //   // ---------------- MOVE IN ------------------- //
  //   case phases.DEPLOY_LETTERS:
  //     for(let gl of genLetters){
  //     gl.update(easeInOutSine(currentFrame/phases.DEPLOY_LETTERS.frames));
  //     }
      
  //     // trackArmsToPoints(genLetters.map(e => e.currentPos));
  //     break;

  //   // ---------------- DISENGAGE ARMS ------------------- //
  //   case phases.DISENGAGE_ARMS:
  //     let cntrl = easeInOutSine(1-currentFrame/phases.DEPLOY_LETTERS.frames); // reverse direction
  //     // trackArmsToPoints(genLetters.map(e => p5.Vector.lerp(e.startP, e.target, cntrl)));
  //     break;

  //    // ---------------- MOVE OUT ------------------- //
  //    case phases.MOVE_OUT:
  //     let rate = width/phases.MOVE_OUT.frames;
  //     for(let gl of genLetters){
  //       gl.currentPos.x += rate;
        
  //     }
  //     conveyorBelt.update(rate);
  //     break;

  // }

  


  // for(let a of arms){
  //   a.show();
  // }

  // for(let gl of genLetters){
  //   gl.show();
  // }

  // if (captureMode && frameCount > 5*totalFrames) {
  //   noLoop();
  //   console.log('finished recording.');
  //   capturer.stop();
  //   capturer.save();
  //   return;
  // }

  // if(captureMode) capturer.capture(document.getElementById('defaultCanvas0'));
}

  // ------------------- RETARGET ALL ARMS --------------------- //

  function trackArmsToPoints(targetArr){
    for(let i = 0; i < targetArr.length; i++){
      arms[i].setTarget(targetArr[i]);
      arms[i].update();
    }
  }


// ----------- WHICH PHASE WE IN? --------------- //
function getCurrentPhase(currentFrame){
  // gets the smallest phase greater than currentFrame
  let cumulativeFrames = phaseOrder.map(e => e.cumulativeFrames);
  for(let i = 0; i < cumulativeFrames.length; i++){
    if(currentFrame < cumulativeFrames[i]) return phaseOrder[i];
  }
}

// ----------- GET CUMULATIVE FRAMES --------------- //
function setCumulativeFrames(phaseOrder){
  let total = 0;
  for(let i = 0; i < phaseOrder.length; i++){
    let frameArray = phaseOrder.map(e => e.frames).slice(0,i+1);
    let total = frameArray.length > 0 ? frameArray.reduce((a,b) => a + b) : phaseOrder[0].frames;
    phaseOrder[i]["cumulativeFrames"] = total;
  }
}




function easeInOutSine(x) {
  return 0.5*(cos(PI*x) + 1);
  }

function keyPressed(){
  if(key === ' ') handMode = !handMode;
}



function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateArmsFromGenLetters(letters){
  let arms = [];
  console.log(letters);
  for(let genLetter of letters){
     //p5.Vector.lerp(genLetter.startPos, genLetter.target);
    let y = genLetter.startP.y <= height/2 ? height/4 : height*0.75;
    arms.push(new Arm(genLetter.startP.x - width/letters.length, y, genLetter.startP.x, genLetter.startP.y));
  }
  return arms;
}


