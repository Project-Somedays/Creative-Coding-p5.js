/*
Author: Project Somedays
Made for the #WCCChallenge: Arcs

- Press 'd' to toggle debugMode which should make it WAY more obvious how it works
- Press 's' to toggle sparks

I wanted to get better at improving the efficiency of my code by pre-filtering and sorting rather than brute forcing all the time
Let me know how I can make it better

The algorithm: there's a field of particles moving around in the background
A bolt starts with a direction and filters the background field for just those inside a cone with angular width aRange
Particles are then sorted by proximity
Vertices need to be within that cone of the current end point of the bolt

Stretch goals:
  - Work out the bug that happens around 0/360 degrees... it doesn't like comparing 0 and 360
  - Some minor issues with debugMode and toggling on and off sparks. I've spent more than enough time on this.
  - ... I'm sure there's more to be done with this
*/


// the background particle field
let field = [];
const n = 300; // increase for more detail
let nodeSpeed = 2; // increase for more chaos
const margin = 2;

// spark stuff
let sparksOn = true; // toggle with 's'
let g; // gravity
const gStr = -0.2;
const sparkCount = 4; // how many new sparks are produced with each arc strike 
const sparkVel = 5; // how fast the sparks shoot out at the beginning
const coolingRate = 4; // how fast the sparks cool down/shift colour/disappear 
let explosions = [];
let startColour;
let endColour;

// setting up the electrode and config
let middle; // where the centre of the scene resides
let aRange; // angular size of the cone for filtering particles
let maxR; // how far away particles can be from the central electrode

//debugging tools
let debugBolt;
let debugMode = false;
let debugExplosions = [];
let m;

// boltAppearance
let secondaryColour;
let tertiaryColour;
const mainWeight = 3;
const otherWeights = 1;




let scorchmarks = [];
let testScorch;

// other config
 // the further away a node can be from the centre
const srcASpeed = 0.001;
let bolts = [];
const boltCount = 10;

function setup() {
  createCanvas(600, 600);
  aRange = PI/3;
  maxR = 0.95*width/2;
  g = createVector(0,-gStr);
  secondaryColour = '#00008B';
  tertiaryColour  = '#A929EE';
  
  // start and end colours of the sparks
  startColour = color(255,200);
  endColour = color(154,45,25,100);//color(199,57,21,50);
  
  // for debugging
  m = createVector(mouseX, mouseY);
  middle = new Node(width/2, height/2);

  // initialise the field 
  for(let i = 0; i < n; i++){
    field.push(new Node(random(width), random(height)));
  }

  fill(255);
  textAlign(CENTER, CENTER);
  // testScorch = new ScorchMark(width/4, height/4);
  // scorchmarks.push(testScorch);
  for(let i = 0; i < boltCount; i++){
    bolts.push(new Bolt())
  }

  debugBolt = new Bolt();
  

}

function draw() {
  background(0);
  noStroke();
  
  fill(255);
  updateField();
  
  
  if(debugMode){
    debugBolt.update();
    debugBolt.showNodes();
    debugBolt.showAll()
    showField();
    if(sparksOn) updateAndCleanExplosions(debugExplosions);
    return;
  }
   
  for(b of bolts){
      b.update();
      b.showAll();
    }
  // clean up as we go
  updateAndCleanExplosions(explosions);
  
  
  // updateAndDrawScorchMarks(); // wasn't happy with this
}

function updateAndCleanExplosions(explosionArr){
  if(explosionArr.length === 0){
    return;
  }

  // go back through the list of explosion and remove the ones that are done
  for(let i = explosions.length - 1; i >= 0; i--){
    explosions[i].updateAndShow();
    if(explosions[i].isDone){
      explosions.splice(i,1);
    }
  }
  
}

function getPositiveHeading(heading){
  return heading < 0 ? heading + TWO_PI : heading;
}

function isWithinAngle(p, src, targetBearing){
  let dir = getPositiveHeading(p5.Vector.sub(p,src).heading());
  return abs(dir - targetBearing) <= aRange/2;
}

function jitter(){
  return random(-5, 5);
}




function updateAndDrawScorchMarks(){
  noStroke();
  for(s of scorchmarks){
    s.update();
    s.show();
  }
  // cleaning up
  for(let i = scorchmarks.length -1; i >= 0; i--){
    if(scorchmarks[i].life < 0){
      scorchmarks.splice(i, 1);
    }
  }
}

function updateField(){
    // updateField
  for(p of field){
    p.update();
  }
}

function showField(){
  noStroke();
  for(p of field){
    p.show(color(255,100));
  }
}

function mousePressed(){
  if(mouseButton  == LEFT && debugMode){
    debugExplosions.push(new Explosion(mouseX, mouseY));
  }
}

function keyPressed(){
  // toggle debugMode on d
  if(key === 'd' || key === 'D'){
    debugMode = !debugMode;
  } 

  if(key == 's' || key === 'S'){
    sparksOn = !sparksOn;
  }
}