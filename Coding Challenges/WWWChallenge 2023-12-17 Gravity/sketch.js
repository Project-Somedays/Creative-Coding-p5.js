/*
Author: Project Somedays
Started: 2023-12-25

#WCCChallenge: Gravity

Just a simple gravity sim, but I like the thought of planetary evolution:
That only those with stable orbits survive to be seen. Or at least what we see is just what hasn't hit other stuff.
Bodies that hit the planets get replaced and are only drawn larger/coloured if they survive long enough.

Stretch goals:
 - Let the user position the suns
 - Let the user decide on the starting position and initial velocity of the bodies
 - Replace with satellites?
*/



// const colours = ['#f72585',' #b5179e', '#7209b7', '#560bad', '#480ca8', '#3a0ca3', '#3f37c9', '#4361ee', '#4895ef', '#4cc9f0']
const colours = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];
const starCount = 1500;
const bodiesPerFrame = 5;
const planetCount = 2;
const stableOrbitLimit = 500;
const startBodyCount = 50;
const orbitTraceLimit = 500;
const systemOrbitRate = 0;//0.005;
const starfieldOrbitRate = 0.0003;
const G = 40; // gravitational constant
const avV = 6;
const vMin = 2;
const vMax = 10;

let starfield;
let avD; // set by dimensions of screen
let bodies = [];
let startMag;
let planetSep;
const avPlanetMass = 100;
let avPlanetSize;
let c;
let system;
let starfieldRot = 0;



function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  createStarField();
  planetSep = width/3;
  avPlanetSize = height/12;
  c = createVector(width/2, height/2);
  avD = max(0.01*height,1); // min of percentage of screen or some visible size

  system = new System(width/2, height/2, planetSep);
  
  startMag = width*sqrt(2);
  for(let i = 0; i < startBodyCount; i++){
    bodies.push(generateBody());
  }
  
  
  
}

function draw() {
  background(0);
  starfieldRot += starfieldOrbitRate;
  push();
    translate(width/2, height/2);
    rotate(starfieldRot);
    image(starfield,0,0);
  pop();
  // update and show bodies
  system.update();
  system.show();

  fill(255);
  for(let i = 0; i < bodies.length; i++){
    let isDestroyed = false;
    for(let j = 0; j < system.planets.length; j++){
      let f = attract(bodies[i].p, system.planets[j].p); // so we only need to calculate distance once
      bodies[i].addForce(f);
      
      if(p5.Vector.dist(bodies[i].p, system.planets[j].p) < system.planets[j].d/2 || p5.Vector.dist(bodies[i].p, c) > startMag){
        bodies[i].destroy();
      }
    }
    bodies[i].update();
    bodies[i].show();
  }

  
  
  // cleaning up: remove bodies
  for(let i = bodies.length - 1; i >= 0; i--){
    if(bodies[i].isDestroyed){
      bodies.splice(i,1);
      bodies.push(generateBody());
    } 
  }
  
}

function generateBody(){
  let d = randomGaussian()*avD;
  let col = random(colours);
  // let d = 5;
  let a = random(TAU);
  // let start = createVector(width/2  + startMag*cos(a), height/2 + startMag*sin(a));
  let start = createVector(random(width), random(height));
  // let target = createVector(c.x + random(-width/3, width/3), c.y + random(-width/3, width/3));
  // let startV = p5.Vector.sub(target, start);
  let vMag = constrain(randomGaussian()*avV,vMin,vMax);
  let startV = createVector(1,0).setMag(vMag);
  return new Body(start.x, start.y, startV.x, startV.y, d, col);
}


function createStarField(){
  starfield = createGraphics(width*2, height*2, P2D);
  starfield.background(0);
  noStroke();
  fill(255,150);
  for(let i = 0; i < starCount; i++){
    let d = randomGaussian()*3;
    starfield.circle(random(width*2), random(height*2), d);
  }
  return
}

function attract(bodyPos, planetPos){
  d = p5.Vector.dist(bodyPos, planetPos);
  return p5.Vector.sub(planetPos, bodyPos).setMag(G/d); // F = -G*m1*m2/r
 
}

