let bg;
const sampleRate = 10;
let targets= [];
let beetles = [];
let progress = 0;
let lerpx = 0;
const triggerFrame = 300;
const textFrames = 150;
const resetFrame = triggerFrame + textFrames;
const progRate = 1/(textFrames/3);
let scaleFactor;
let startV;
let MODES;
let mode;
let bug;
let bugScale;


function preload(){
  bg = loadImage('Christmas.png');
  bug = loadImage('Bug.png');
  MODES = Object.freeze(
    {
      SAUNTER : Symbol("saunter"),
      CONVERGE : Symbol("converge"),
      MARK : Symbol("mark")
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  imageMode(CENTER);
  scaleFactor = width/bg.width;
  bugScale = 0.015*width/bug.width;
  image(bg,width/2, height/2,bg.width*scaleFactor, bg.height*scaleFactor);
  fill(255);
  noStroke();

  for(let y = 0; y < height; y+= sampleRate){
    for(let x = 0; x < width; x+= sampleRate){
      let p = get(x,y);
      if(p[0] === 1 && p[1] === 1 && p[2] === 1){
        targets.push(createVector(x,y));
      }
    }
  }
  
  console.log(`Targets: ${targets.length}`);
  for(let i = 0; i < targets.length; i++){
    beetles.push(new Beetle(random(width), random(height), targets[i]));
  }
}

function draw() {
  background(0);
  getMode();
  console.log(mode);
  
  switch(mode){
    case MODES.SAUNTER:
      for(let b of beetles){
        b.moveAtRandom();
        b.show();
      }
      break;
    case MODES.MARK:
      console.log("Marking start positions");
      lerpx = 0;
      progress = 0;
      for(let b of beetles){
        b.mark();
        b.randomise();
        b.show();
      }
      break;
    case MODES.CONVERGE:
      if(lerpx < 1){
        lerpx += progRate;
        progress = -(cos(PI * lerpx) - 1) / 2;
      }
      for(let b of beetles){
        b.converge();
        b.show();
      }
      break;
    default:
      break;

  }
  
}

function getMode(){
  cycleFrameCount = frameCount % resetFrame;
  if(cycleFrameCount < triggerFrame){
    mode = MODES.SAUNTER;
  }
  if(cycleFrameCount === triggerFrame){
    mode = MODES.MARK;
  }
  if(cycleFrameCount > triggerFrame){
    mode = MODES.CONVERGE;
  }
}
