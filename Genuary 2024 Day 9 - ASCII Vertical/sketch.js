/*
Author: Project Somedays
Date: 2024-02-24
Title: Genuary 2024 Day 9 - ASCII

Playing around with lerping and easing functions
Use a generated image of the text "ASCII" and sample from those pixels to determine the targets for all the letters

ASCII UFO: https://ascii.co.uk/art/alien
Easing Functions: https://easings.net/
*/

let UFOSTRING = String.raw`
    \.   \.      __,-"-.__      ./   ./
  \.   \'.  \'.-'"" _,="=._ ""'-.'/  .'/   ./
   \'.  \_'-''      _,="=._      ''-'_/  .'/
   \ '-',-._   _.  _,="=._  ,_   _.-,'-' /
  \. /',-',-._"""  \ _,="=._ /  """_.-,'-,'\ ./
  \'-'  /    '-._  "       "  _.-'    \  '-'/
  /)   (         \    ,-.    /         )   (\
  ,-'"     '-.       \  /   \  /       .-'     "'-,
  ,'_._         '-.____/ /  _  \ \____.-'         _._',
  /,'   '.                \_/ \_/                .'   ',\
  /'       )                  _            Krogg (       '\
   /   _,-'"'-.  ,++|T|||T|++.  .-'"'-,_   \
  / ,-'        \/|'|'|'|'|'|'|\/        '-, \
  /,'             | | | | | | |             ',\
  /'               ' | | | | | '               '\
' | | | '
  ' | '
`;


// Establishing the phases of the animation
let STATE = Object.freeze({
  "WAITING" : Symbol("WAITING"),
  "CONVERGING" : Symbol("Converging"),
  "ABDUCTING" : Symbol("Abducting")
});
let currentState = STATE.CONVERGING;
let currentFrame = 0;

// Image variables
let img;
let charSet = ["A","S","C","I","I"];
let tSize = 0.01; //1% of the width;
let letters = [];
let everyXPixel = 10; // determines how many letters
let cycleOffset;
let ufo;

// Easing tracking
let lerpProgress = 0;
let convergeEasing;
let abductionProgress = 0;
let abductEasing;
let cycleRate;

// timings
const phase1Frames = 200;
const phase2Frames = 100;
const phase3Frames = 200;
const totalFrames = phase1Frames + phase2Frames + phase3Frames;


function setup() {
  createCanvas(1080, 1920);
  
  pixelDensity(1);

  cycleRate = random(1,15); // set the cycle rate each frame
  cycleOffset = random(); // how much should the x,y position influence the offset
  
  // text variables
  textSize(everyXPixel);
  textAlign(CENTER, CENTER);
  textFont('Courier');
  textStyle("BOLD");
  fill(255);
  stroke(255);
  
  // make the ufo offscreen
  ufo = new UFO(width/2, -height/2, width/2, height/4);

  // ----------------- Create the underlying graphic -------------- //
  img = createGraphics(width, height);
  img.fill(255);
  img.textAlign(CENTER, CENTER);
  img.textSize(1.2*height/(charSet.length));
  img.textLeading(0.9*height/charSet.length);
  img.textStyle(BOLD);
  img.text(charSet.join("\n"), img.width/2, img.height/2);

  // -------------- Get the targets ------------- //

  img.loadPixels();
  for(let x = 0; x < img.width; x+=everyXPixel){
    for(let y = 0; y < img.height; y+=everyXPixel){
      let ix = (x + y*img.width)*4;
      if(img.pixels[ix] === 255 && img.pixels[ix+1] === 255 && img.pixels[ix+2] === 255){
        let a = random(TWO_PI);
        let startX = width/2 + 1.1*height*cos(a);
        let startY = height/2 + 1.1*height*sin(a);
        letters.push(new Letter(startX, startY, x, y));
      }
    }
  }

  // console.log(letters);

}

function draw() {
  background(0);
  
  // ----------- get state --------------- //
  currentFrame = frameCount%totalFrames;

  if(currentFrame === 0){
    lerpProgress = 0;
    abductionProgress = 0;
    
  }
  
  if(currentFrame <= phase1Frames){
    currentState = STATE.CONVERGING;
  } else if(currentFrame > phase1Frames && currentFrame < phase1Frames + phase2Frames){
    currentState = STATE.WAITING;
  } else if(currentFrame > phase1Frames + phase2Frames){
    currentState = STATE.ABDUCTING;
  } 

  // ----------- set the lerp progress using the easing function depending on state --------------- //
  switch(currentState){
    case STATE.CONVERGING:
      lerpProgress += 1/phase1Frames;
      convergeEasing = easeInOutElastic(lerpProgress);
      break;
    case STATE.WAITING:
      lerpProgress = 1;
      convergeEasing = easeInOutElastic(lerpProgress);
      break;
    case STATE.ABDUCTING:
      abductionProgress += 1/phase3Frames;
      abductEasing = easeInOutQuint(abductionProgress);
      break;
  }
  
  // ------------ draw the letters ------------ //
  textSize(20);
  for(let l of letters){
    l.update();
    l.show();
  }

  // ------------- draw the UFO ------------- //
  ufo.update();
  ufo.show();

}




function easeInOutElastic(x){
  const c5 = (2 * Math.PI) / 4.5;
  
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
    : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}

function easeInQuart(x){
  return x * x * x * x;
}

function easeInOutQuint(x){
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}
  