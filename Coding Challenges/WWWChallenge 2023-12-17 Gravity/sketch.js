const colours = ['#f72585',' #b5179e', '#7209b7', '#560bad', '#480ca8', '#3a0ca3', '#3f37c9', '#4361ee', '#4895ef', '#4cc9f0']
const stars = 1000;
const bodiesPerFrame = 5;
const planetCount = 2;
let starfield;
let avD;
let bodies = [];
let planets = [];
const G = 40;
const avV = 6;
const vMin = 2;
const vMax = 10;
let startMag;
let planetSep;
const avPlanetMass = 100;
let avPlanetSize;
let c;


function setup() {
  createCanvas(windowHeight, windowHeight);
  createStarField();
  planetSep = width/3;
  avPlanetSize = width/12;
  c = createVector(width/2, height/2);
  avD = max(0.005*width,1); // min of percentage of screen or some visible size
  aOff = random(TAU);
  for(let i = 0; i < planetCount; i++){
    let a = i * TAU/planetCount + aOff;
    let x = width/2 + planetSep/2*cos(a);
    let y = height/2 + planetSep/2*sin(a)
    let m = randomGaussian()*avPlanetMass;
    let d = avPlanetSize; //randomGaussian()*avPlanetSize;
    planets.push(new Planet(x, y, m, d));
  }
  startMag = width*sqrt(2);
  background(0);
  image(starfield,0,0);
  
}

function draw() {
  
  //drawPlanet
  // show planets
  fill(255, 255,0);
  for(p of planets){
    p.show();
  }

  fill(255);

  // generate bodies every 5 frames
  if(frameCount % 5 === 0){
    for(let i = 0; i < bodiesPerFrame; i++){
      bodies.push(generateBody())
    }
  }


 
  

  // show update bodies
  fill(255);
  for(let i = 0; i < bodies.length; i++){
    let isDestroyed = false;
    for(let j = 0; j < planets.length; j++){
      let f = attract(bodies[i].p, planets[j].p); // so we only need to calculate distance once
      bodies[i].addForce(f);
      
      if(p5.Vector.dist(bodies[i].p, planets[j].p) < planets[j].d/2 || p5.Vector.dist(bodies[i].p, c) > startMag){
        bodies[i].destroy();
      }
    }
    bodies[i].update();
    bodies[i].show();
  }

  
  
  // cleaning up: remove bodies
  for(let i = bodies.length - 1; i >= 0; i--){
    if(bodies[i].isDestroyed) bodies.splice(i,1);
  }
  
}

function generateBody(){
  // let d = randomGaussian()*avD;
  let d = 5;
  let a = random(TAU);
  // let start = createVector(width/2  + startMag*cos(a), height/2 + startMag*sin(a));
  let start = createVector(0, random(height));
  let target = createVector(c.x + random(-width/3, width/3), c.y + random(-width/3, width/3));
  let startV = p5.Vector.sub(target, start);
  let vMag = constrain(randomGaussian()*avV,vMin,vMax);
  startV.setMag(vMag);
  return new Body(start.x, start.y, startV.x, startV.y, d, color(255,10));
}


function createStarField(){
  starfield = createGraphics(width, height, P2D);
  starfield.background(0);
  noStroke();
  fill(255,150);
  for(let i = 0; i < stars; i++){
    let d = randomGaussian()*3;
    starfield.circle(random(width), random(height), d);
  }
}

function attract(bodyPos, planetPos){
  d = p5.Vector.dist(bodyPos, planetPos);
  return p5.Vector.sub(planetPos, bodyPos).setMag(G/d); // F = -G*m1*m2/r
 
}
