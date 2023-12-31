/*
Happy New Years! Hope you have a sweet time! ... I... I'll see myself out...

Bees fly around and then land to form the letters. Still playing around with drawing pixels.
Note: Bees bounding boxes are all the same size so the scaling works on all of them. 
*/

let flightPoses = [];
let currentPose = 0;
let p;
let xOff, yOff;
let globOff = 0;
let prevX = 0;
let globBeeScaleFactor;
let bees;
let beeDefaultWidth;
let beeDefaultHeight;
let textScaleFactor;
let targets = [];
let sampleRate;
let cycleFrameCount = 0;
const MODES = {
  CRUISE : Symbol("Cruise"),
  MARK: Symbol("Mark"),
  CONVERGE : Symbol("Converge")
};
let currentMode = MODES.CRUISE;
// for lerping
let lerpSliderPos = 0;
let lerpSliderControl = 0;
const triggerFrame = 300;
const textFrames = 150;
const resetFrame = triggerFrame + textFrames;
const progRate = 1/(textFrames/3);
let testBee;


function preload(){
  beeFlight1 = loadImage("BeeBoxFP1.png");
  beeFlight2 = loadImage("BeeBoxFP2.png");
  beeLandPose = loadImage("BeeBoxLP.png");
  happyNewYear = loadImage("HappyBeeNewYear@2x.png")
  beeDefaultWidth = beeFlight1.width;
  beeDefaultHeight = beeFlight1.height;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  // pixelDensity(1);
  flightPoses.push(beeFlight1);
  flightPoses.push(beeFlight2);
  bees = [];
  textScaleFactor = min(height, width)*0.9 / happyNewYear.height;
  globBeeScaleFactor = (max(height, width)/10) / beeDefaultHeight; //
  p = createVector(0,0);
  xOff = random(1000);
  yOff = random(1000);
  sampleRate = max(width,height)/150;
  testBee = new Bee(0,0,createVector(0,0),random(1000), random(1000), random(1000), 1);
  // console.log(`Sample every ${sampleRate} pixel`);
  
  
  
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
  background(200);

  // console.log(targets.length);
  for(let i = 0; i < targets.length; i++){
    bees.push(new Bee(0,0,targets[i],random(1000), random(1000), random(1000), constrain(randomGaussian(),0.5, 2)));
  }
  
  fill(0);
  for(let p of targets){
    circle(p.x, p.y, 2);
  }

}

function draw() {
  background(200);
  testBee.cruise();
  testBee.show();

  // getMode();
  
  // switch(currentMode){
  //   case MODES.CRUISE:
  //     // sort bees in scale order
  //     bees.sort((a,b) => a.beeScaleFactor - b.beeScaleFactor);
  //     for(let b of bees){
  //       b.cruise();
  //       b.show();
  //     }
  //     break;
  //   case MODES.MARK:
  //     // console.log("Marking start positions");
  //     lerpSliderControl = 0;
  //     lerpSliderPos = 0;
  //     for(let b of bees){
  //       b.mark();
  //       b.show();
  //     }
  //     break;
  //   case MODES.CONVERGE: // sine wave easing function
  //     if(lerpSliderPos < 1){
  //       lerpSliderControl += progRate;
  //       lerpSliderPos = -(cos(PI * lerpSliderControl) - 1) / 2;
  //     }
  //     // sort bees in scale order
  //     bees.sort((a,b) => a.beeScaleFactor - b.beeScaleFactor);
  //     for(let b of bees){
  //       b.converge();
  //       b.show();
  //     }
  //     break;
  //   default:
  //     break;

  // }
  // sort bees by size and draw the smallest first
  
  globOff += 0.005;
  
}

function getMode(){
  cycleFrameCount = frameCount % resetFrame;
  if(cycleFrameCount < triggerFrame){
    currentMode = MODES.SAUNTER;
  }
  if(cycleFrameCount === triggerFrame){
    currentMode = MODES.MARK;
  }
  if(cycleFrameCount > triggerFrame){
    currentMode = MODES.CONVERGE;
  }
}

