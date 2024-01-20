// physics
const G = 2.25;


// src words
let hWord = "ASCII";
let vWord = "A\nS\nC\nI\nI";
let src;
let letters = [];
let sampleEvery;
let tSize;
const standardTextSizeProportion = 1/30;
const letterChoices = ["A","S","C","I","I"];

// timeline
const maxDelay = 50;
let startFrame = 0;
const framesToAppear = 150;
const phase1Frames = 100;
let endTarget;
const phase2Frames = 100;

// robotBiz
const robotSpeed = 20;
let robot;

const laserRate = 0.02;
const closeEnough = 0.01;

// bit of trial and error to get this to appear properly on the screen
let robotString = String.raw` 
   ____          ____
  |oooo|        |oooo|
  |oooo| .----. |oooo|
  |Oooo|/\_||_/\|oooO|
  '----' / __ \ '----'
   ,/ |#|/\/__\/\|#| \,
   /  \|#|| |/\| ||#|/  \
  / \_/|_|| |/\| ||_|\_/ \
 |_\/    o\=----=/o    \/_|
 <_>      |=\__/=|      <_>
 <_>      |------|      <_>
 | |   ___|======|___   | |
 //\\  / |O|======|O| \  //\\
 |  |  | |O+------+O| |  |  |
 |\/|  \_+/        \+_/  |\/|
 \__/  _|||        |||_  \__/
  | ||        || |
  [==|]        [|==]
  [===]        [===]
  >_<          >_<
  || ||        || ||
  || ||        || ||
      || ||        || ||    
   _|\_/|__    __|\_/|__
   /___n_n___\  /___n_n___\
`

let saucerText = `
  _____
  ,-"     "-.
  / o       o \\
  /   \\     /   \\
  /     )-"-(     \\
  /     ( 6 6 )     \\
  /       \\ " /       \\
  /         )=(         \\
  /   o   .--"-"--.   o   \\
  /    I  /  -   -  \\  I    \\
  .--(    (_}y/\\       /\\y{_)    )--.
  (    ".___l\/__\\_____/__\/l___,"       )
 \\                                   /
  "-._      o O o O o O o      _,-"
  '--Y--.___________.--Y--'
  |==.___________.==|
  '==.___________.=='
`

let hMode; // decides whether we're roboting or saucering

// function preload(){
//   saucer = loadImage("spaceship.jpg");
// }



function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textAlign(CENTER, CENTER);
  hMode = width > height;
  tSize = hMode ? height/1.75 : height/6; // changing the vertical/horizontal text

  src = createGraphics(width, height);
  src.background(0);
  src.fill(255);
  src.noStroke();
  src.textAlign(CENTER, CENTER);
  
  textFont('Courier New', tSize*2);
  src.textSize(tSize);
  src.textLeading(tSize);
  
  if(hMode){
    src.text(hWord, width/2, height/2);
  } else{
    src.text(vWord, width/2, 0.6*height);
  }

  sampleEvery = hMode ? int(tSize / 50) : int(tSize/20);
  textSize(sampleEvery);

  endTarget = createVector(width/2, height/10);

  // sampling from src
  src.loadPixels();
  sampleSource();

fill(255);

// choose target thing
robot = new Robot(-robotSpeed*(framesToAppear+maxDelay)*1.5, height/2 - height/8);
saucer = new Saucer(width/2, -height*1.5, height/20);
// robot = new Robot(width/2, height/2);
// robot.v.set(0,0);
// robot.start();
  
}

function draw() {
  background(0);
  
  switch(hMode){
    case true:
      // for let l of letters, let them converge
      if(frameCount - startFrame < phase1Frames){
        for(let l of letters){
          l.fall();
          l.show();
        }
      } else {
        for(let l of letters){
          l.update();
          l.show();
        }
      }
      
      // move the robot in
      robot.update();
      robot.show();

      // stop him at 0.1*width and start up the laser
      if(abs(robot.p.x - width/10) < robotSpeed){
        robot.v.set(0,0);
        if(robot.laserA <= -PI/12 ){
          
          robot.v.set(2*robotSpeed,0);
        }
        // hide letters
        for(let l of letters){
          let eyeline = createVector(robot.p.x, robot.eyeLevel);
          let robot2letterheading = p5.Vector.sub(l.p, eyeline).heading();
          if(robot2letterheading > robot.laserA){
            l.colour = color(0);  
          }
        }
      }
      // robot triggered to move on when finished lasering
      if(robot.p.x > width*1.2){
        setup(); // restart
        startFrame = frameCount;
      }
      break;


    // in vertical mode
    case false:
      // during phase 1, fall
      if(frameCount - startFrame < phase1Frames){
        for(let l of letters){
          l.fall();
          l.show();
        }
      // and then form into the ASCII characters
      } else {
        for(let l of letters){
          l.update();
          l.show();
        }
      }

      // at the end of phase 1, restart the starting point
      if(frameCount - startFrame === phase1Frames){ 
        for(let l of letters){
          l.start.set(l.p.x, l.p.y); 
          l.progress = 0;
        }
      }

      if(frameCount - startFrame < phase1Frames + phase2Frames){
        let progress = (frameCount - startFrame) / (phase1Frames + phase2Frames);
        for(let l of letters){
          l.p.x = lerp(l.start.x, endTarget.x, progress);
          l.p.y = lerp(l.start.y, endTarget.y, progress);
          if(l.p.y < height/10){
            l.colour = color(0);
          }
        }
      }
      saucer.update();
      saucer.show();
      break;
  }
  
  
 
  

  // image(saucerGraphic, 0,0);


  // spawn in letters
 
  
  

 
  
  // background(0);
  
  // textSize(sampleEvery);
  
  // textSize(tSize*standardTextSizeProportion);
  

  // text(saucer, width/2, height/2);
  // for(let l of letters){
  //   l.update();
  //   l.show();
  // }

  
  
  // image(src, 0,0);
}





// source: https://easings.net/#easeOutBack
function easeOutBack(x){
  const c1 = 1.70158;
  const c3 = c1 + 1;
  
  return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
}

// source: https://easings.net/#easeInOutSine
function easeInOutSine(x){
  return -(Math.cos(Math.PI * x) - 1) / 2;
  }


function sampleSource(){
  letters = []; // clears on reset
  for(let y = 0; y < src.height; y += sampleEvery){
    for(let x = 0; x < src.width; x += sampleEvery){
      let index = (x + y*src.width)*4;
      if(src.pixels[index] === 255 && src.pixels[index+1] === 255 && src.pixels[index+2] === 255){
        letters.push(new Letter(x,y,random(["A","S","C","I","I"])));
      }
    }
  }
}


function generateGraphic(img, sampleRate, targetBrightness){
  arr = []
  for(let y = 0; y < img.height; y += sampleRate){
    for(let x = 0; x < img.width; x += sampleRate){
      let index = (x + y*img.width)*4;
      if(img.pixels[index] === targetBrightness && img.pixels[index+1] === targetBrightness && img.pixels[index+2] === targetBrightness){
        arr.push(new Letter(x,y,random(["A","S","C","I","I"])));
      }
    }
  }
  return arr;
}

/*
First version: I was going to explode the things

function mousePressed(){
  if(mouseButton === LEFT){
    isExplosion = true;
    console.log(`Explosion = ${isExplosion}`);
    bang = new Explosion(frameCount, mouseX, mouseY, 4, 0.2);
    // applyBangForce(mouseX, mouseY);
  }
}

function applyBangForce(x,y, extF){
  let epicentre = createVector(x,y);
  for(let l of letters){
    let f = p5.Vector.sub(l.p, epicentre);
    let d = p5.Vector.dist(l.p, epicentre);
    let magnitude = extF/d;//map(d, 0, width, 10, G);
    l.applyForce(f.setMag(magnitude));
  }
}

class Explosion{
  constructor(initFrame, x,y, peak, decay){
    this.t_0 = initFrame
    this.p = createVector(x,y);
    this.peak = peak;
    this.decay = decay;
    
  }

  getForce(){
    let t = (frameCount - this.t_0)*timeStep;
    return this.peak*(1-t*this.decayRate)*exp(-this.decayRate*t);
  }


}

*/