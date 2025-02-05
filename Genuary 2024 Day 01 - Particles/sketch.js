/*
Happy New Years! Hope you had a sweet time! ... I... I'll see myself out...

Building off my previous "Christmas Beetles" project, bees swarm about with Perlin Noise
At the trigger frame, they converge on their target to form the words "Hapbee New Year"
Targets are sampled from a graphic. One bee per target.
During the converge/diverge phase, we lerp not the position of the bees directly, but the bounds of the mapping of the noise values
This gives us a seamless transition in and out.
*/

let flightPoses = [];
let bees = [];
let targets = [];
let currentPose = 0;
let globOff = 0;

// default image scaling
let globBeeScaleFactor;
let beeDefaultWidth;
let beeDefaultHeight;
let textScaleFactor;

const beeScaleLower = 0.1;
const beeScaleUpper = 1.25;
let currentBeeScaleLower = beeScaleLower;
let currentBeeScaleUpper = beeScaleUpper;


// text sampling density
let sampleRate;

// animation control
let cycleFrame = 0;
const MODES = {
  CONVERGE : Symbol("Converge"),
  DIVERGE : Symbol("Diverge"),
  DEFAULT: Symbol("Default")
};
let currentMode = MODES.CRUISE;
// for lerping
let lerpPos = 0;
let lerpSliderControl = 0;
// Draw myself a timeline
const startPhaseDuration = 200;
const convergeDuration = 100;
const textDuration = 200;
const scatterDuration = 200;
const endPhaseDuration = 200;
const transitionFrames = 100;

// the animation sequence
const startConvergeFrame = 200;
const endConvergeFrame = startConvergeFrame + convergeDuration;
const startScatterFrame = endConvergeFrame + textDuration;
const endScatterFrame = startScatterFrame + scatterDuration;
const resetCycleFrame = startScatterFrame + endPhaseDuration;
const progRate = 1/(transitionFrames);
let targetBoxSize; // how much should the bees moves around once converged
let targetScaleFactor; // what the bees should shrink down to


function preload(){
  beeFlight1 = loadImage("BeeBoxFP1.png");
  beeFlight2 = loadImage("BeeBoxFP2.png");
  beeLandPose = loadImage("BeeBoxLP.png");
  happyNewYear = loadImage("HapBeeNewYear@2x.png")
  beeDefaultWidth = beeFlight1.width;
  beeDefaultHeight = beeFlight1.height;
  flightPoses.push(beeFlight1);
  flightPoses.push(beeFlight2);
}

function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(1080, 1080);
  imageMode(CENTER);
  // pixelDensity(1);
  
  bees = [];
  textScaleFactor = min(height, width)*0.9 / happyNewYear.height;
  globBeeScaleFactor = (max(height, width)/10) / beeDefaultHeight; //
  p = createVector(0,0);
  xOff = random(1000);
  yOff = random(1000);
  sampleRate = min(width,height)/200;
  targetScaleFactor = 0.4/sampleRate;
  targetBoxSize = 0.005*width;
  
  
  // background(220);
  // getting targets from the test image
  image(happyNewYear,width/2,height/2, textScaleFactor*happyNewYear.width, textScaleFactor*happyNewYear.height);
  for(let y = 0; y < height; y+= sampleRate){
    for(let x = 0; x < width; x+= sampleRate){
      let p = get(x,y);
      if(p[0] === 0 && p[1] === 0 && p[2] === 0 && p[3] === 255){
        targets.push(createVector(x,y));
      }
    }
  }

  // console.log(targets.length);
  for(let i = 0; i < targets.length; i++){
    bees.push(new Bee(0,0,targets[i],random(1000), random(1000), random(1000)));
  }
  

}

function draw() {
  background(0);
  // showing the different sliders for debugging
  // line(0.05*width, 0.05*height, width/2, 0.05*height);
  // let xSliderPos = lerp(0.05*width, width/4, lerpSliderPos);
  // fill(255);
  // circle(xSliderPos, 0.05*height, 20);

  // line(0.05*width, 0.1*height, width/2, 1*height);
  // let xSliderControl = lerp(0.05*width, width/4, lerpSliderControl);
  // fill(255);
  // circle(xSliderControl, 0.1*height, 20);

  // use the current frame count to set the mode
  getMode();
  
  switch(currentMode){
    case MODES.CONVERGE:  // while converging, move the slider from 0 to 1
      if(lerpSliderControl < 1){
        lerpSliderControl += progRate;
        lerpPos = -(cos(PI * lerpSliderControl) - 1) / 2;
      }
      for(let b of bees){
        b.converge_diverge();
      }
      break;
    case MODES.DIVERGE: // while diverging, move the slider from 1 to 0
      if(lerpSliderControl >= 0){
        lerpSliderControl -= progRate;
        lerpPos = -(cos(PI * lerpSliderControl) - 1) / 2;
      }
      for(let b of bees){
        b.converge_diverge();
      }
    default:
      break;
  }
  currentBeeScaleLower = lerp(beeScaleLower, targetScaleFactor, lerpPos);
  currentBeeScaleUpper = lerp(beeScaleUpper, targetScaleFactor, lerpPos);
  bees.sort((a,b) => a.currentScaleFactor - b.currentScaleFactor);
  for(let b of bees){
    b.update();
    b.show();
  }

  
  globOff += 0.005;
  
}

function getMode(){
  let prevMode = currentMode;
  cycleFrame = frameCount % resetCycleFrame;
  if(cycleFrame < startConvergeFrame){
    currentMode = MODES.DEFAULT;
  } else if(cycleFrame < endConvergeFrame){
    currentMode = MODES.CONVERGE;
  } else if(cycleFrame < startScatterFrame){
    currentMode = MODES.DEFAULT;
  } else if(cycleFrame < endScatterFrame){
    currentMode = MODES.DIVERGE;
  } else{
    currentMode = MODES.DEFAULT;
  }
  if(currentMode != prevMode){
    console.log(`Mode changed: ${currentMode.toString()}`);
  }
}
