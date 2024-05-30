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

// ---------- PHASEBIZ -------------- //
let phases = {
  DEPLOY_LETTERS:   {phaseName: "DEPLOY_LETTERS",  frames: 60},
  DISENGAGE_ARMS:   {phaseName: "DISENGAGE_ARMS", frames: 60},
  MOVE_OUT:         {phaseName: "MOVE_OUT",       frames: 60},
  FETCH:            {phaseName: "FETCH",          frames: 60}
}
let phaseOrder = [phases.DEPLOY_LETTERS, phases.DISENGAGE_ARMS, phases.MOVE_OUT, phases.FETCH];
setCumulativeFrames(phaseOrder);
let currentPhase = phaseOrder[0];
const totalFrames = phaseOrder[phaseOrder.length - 1].cumulativeFrames;
console.log(phaseOrder);
console.log(totalFrames);

// -------- ARM BIZ -----------------//
let segmentLength;
const totalSegments = 4;
let arms = [];


let pos;
let arm;




function setup() {
  createCanvas(1080, 1080);
  pixelDensity(1);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  maxTextHeight = height/10;
  textSize(maxTextHeight*1.5);

  currentPalette = random(palettes);
  genLetters = convertTextToGenLetters(msg);
  pos = createVector(mouseX, mouseY);

  segmentLength = width/5;
  // arm = new Arm(width/2, height/2);
  arms = generateArmsFromGenLetters(genLetters);
  

}

function draw() {
  background(0);

  
 

  currentFrame = frameCount%totalFrames;

  // ------------------- DETERMINE THE CURRENT FRAME ------------------- //
  if(getCurrentPhase(currentFrame) !== currentPhase){
    currentPhase = getCurrentPhase(currentFrame);
    console.log(currentPhase.phaseName);
  };

  // ------------------ ON RESET ----------------- //
  if(currentFrame === 0){
    currentPalette = random(palettes);
    genLetters = convertTextToGenLetters(msg);
  }

  if(currentFrame === phases.DISENGAGE_ARMS.cumulativeFrames){
    for(let a of arms){
      a.capturePos();
    }
  }

  switch(currentPhase){

    // ---------------- MOVE IN ------------------- //
    case phases.DEPLOY_LETTERS:
      for(let gl of genLetters){
      gl.update(easeInOutSine(currentFrame/phases.DEPLOY_LETTERS.frames));
      }
      trackArmsToGenLetters();
      
      break;

    // ---------------- DISENGAGE ARMS ------------------- //
    case phases.DISENGAGE_ARMS:

      break;

     // ---------------- MOVE OUT ------------------- //
     case phases.MOVE_OUT:
      
      let rate = width/phases.MOVE_OUT.frames;
      for(let gl of genLetters){
        gl.currentPos.x += rate;
        
      }
      trackArmsToGenLetters();
      break;

      // ---------------- FETCH ------------------- //
     case phases.FETCH:
      returnArms();
      break;

  }

  for(let a of arms){
    a.update();
    a.show();
  }

  for(let g of genLetters){
    g.show();
  }
  

}

function trackArmsToGenLetters(){
  for(let i = 0; i < genLetters.length; i++){
    arms[i].setTarget(genLetters[i].currentPos.x, genLetters[i].currentPos.y);
  }
}

function returnArms(){
  for(let a of arms){
    let cntrl = easeInOutSine(currentFrame/phases.FETCH.frames)
    let p = p5.Vector.lerp(a.target, a.returnPt,cntrl);
    a.setTarget(p.x, p.y);
  }
}




function generateArmsFromGenLetters(letters){
  let arms = [];
  for(let l of letters){
    let startP = p5.Vector.lerp(l.startP, l.target,0.5);
    startP.x -= width/20;
    startP.add(p5.Vector.random2D().setMag(random(width/10)));
    arms.push(new Arm(startP.x,startP.y, l.startP.x, l.startP.y));
  }
  return arms;
}
