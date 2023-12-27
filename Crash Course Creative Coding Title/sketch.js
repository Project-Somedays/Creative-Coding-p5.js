/*
Author: Project Somedays
Date: 2023-12-24

I wanted a cool intro to a course I'm hoping to pull together... I think I've found it!
  - Loads up the image
  - Samples every 5th pixel
  - Makes a mover object from it
  - Updates each mover based on a random speed and a 2D perlin noise field 
  - Repeat the whole thing again with a random config, fading to 0 opacity over the course of the animation loop

Quite often some movers get stuck, but I kind of like this. I don't know why, but I don't care =)
*/


let zoomFactor = 300;
const animationFrames = 500;
const waitFrames = 180;
let startFrame = 0;
const margin = 50;

let logo;
let scaleFactor;
let movers;
let resetFrame;



function preload(){
  logo = loadImage('logo.png');
}

function setup() {
  createCanvas(500, 500, P2D);
  imageMode(CENTER);
  scaleFactor = height/logo.height;
  
  // pixelDensity(1);
  
  
  formSwarm();
  
}

function draw() {
  
  if(frameCount < startFrame){
    return;
  }
  background(0);
  stroke(255, int(map(frameCount-startFrame,0,animationFrames,255,0)));
  for(let m of movers){
    m.update();
    m.show();
  }
  
  // cleaning up movers that are off the screen. Should help with performance.
  for(let i = movers.length - 1; i >=0; i--){
		if(movers[i].p.x < -margin || movers[i].p.x > width + margin || movers[i].p.y < -margin || movers[i].p.y > height + margin){
			movers.splice(i,1);
		}
	}

  if(frameCount > resetFrame){
    formSwarm();
  }
  
}

class Mover{
  constructor(x,y){
    this.p = createVector(x,y);
    this.v;
    this.speed = constrain(randomGaussian()*8,3,15);
    this.weight = randomGaussian()*4;
  }

  update(){
    let a = map(noise(this.p.x/zoomFactor, this.p.y/zoomFactor),0,1,-TAU, TAU);
    this.v = p5.Vector.fromAngle(a).setMag(this.speed);
    this.p.add(this.v);
  }
  show(){
    strokeWeight(this.weight);
    point(this.p.x, this.p.y);
  }
}

function formSwarm(){
  movers = [];
  stroke(255);
  startFrame = frameCount + waitFrames;
  resetFrame = startFrame + animationFrames; // set the reset animationFrames into the future
  noiseSeed(random(10000));
  zoomFactor = constrain(randomGaussian()*300,10,1000);
  background(0);
  image(logo,width/2,height/2, scaleFactor*logo.width, scaleFactor*logo.height);
  // sample every 5th pixel
  for(let y = 0; y < height; y+=5){
    for(let x = 0; x < width; x+=5){
      let p = get(x,y);
      // get opaque white pixels
      if(p[0] === 255 && p[1]=== 255 && p[2] == 255 & p[3] === 255){
        movers.push(new Mover(x,y));
      }
  }
  }
}

