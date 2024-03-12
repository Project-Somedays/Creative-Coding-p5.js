/*
Author: Project Somedays
Date: 2024-02-25
Title: Physics Library 

Going for an underwater reef feel, spawning on a noise field, with the current ebbing and flowing
*/
const zoomFactor = 400;
const everyNthPixel = 10;
const segPerFrond = 5;
const lineLength = 40;
const segL = lineLength/segPerFrond;
const tideCycleFrames = 600;




// module aliases
const {
  Engine,
  World,
  Bodies,
  Body,
  Composite,
  Constraint,
  Runner
} = Matter;

let engine;
let world;
let tideForce;
let tideOffset = 0;
let tideTracker = 0;

let testFrond;
let allFronds = [];



function setup() {
  createCanvas(720, 720);
  // create an engine
  engine = Engine.create();
  
  world = engine.world;
  world.gravity.y = 0.9;
  noStroke();
  
  tideForce = createVector(0,0);

  testFrond =  new Frond(width/2, height/8);
  Runner.run(engine);

  for(let y = 0; y < height; y+=everyNthPixel){
    for(let x = 0; x < width; x+=everyNthPixel){
      let nVal = noise(x/zoomFactor,y/zoomFactor);
      if(nVal > 0.5 && nVal < 0.51){
        allFronds.push(new Frond(x,y));
        
        
        // circle(x,y, everyNthPixel);
      }
    }
  }
 


  // // create two boxes and a ground
  // var boxA = Bodies.rectangle(400, 200, 80, 80);
  // var boxB = Bodies.rectangle(450, 50, 80, 80);
  // var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  // // add all of the bodies to the world
  // Composite.add(engine.world, [boxA, boxB, ground]);

  // // create runner
  // var runner = Runner.create();

  // // run the engine
  // Runner.run(runner, engine);
  }

function draw() {
  background('#0D1C35');
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  tideForce.x = 0.5*(sin(tideTracker) + map(noise(tideOffset), 0, 1, -0.5, 0.5));
  text(tideForce.x, width/2, 0.1*height);
  world.gravity.x = tideForce.x;
  world.gravity.y = 0.9;
  Runner.run(engine);
  

  for(let i = 0; i < allFronds.length; i++){
    allFronds[i].show();
  }
  // testFrond.applyForce(tideForce);
  // tidePhase = 0.5*(sin(radians(10*frameCount)) + 1); // goes between 0 and 1
  // tide = map(noise(frameCount/200),0,1, 0, PI);
  
  tideTracker += TWO_PI/tideCycleFrames;
  tideOffset += 0.001;

}

function easeInOutCubic(x){
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
