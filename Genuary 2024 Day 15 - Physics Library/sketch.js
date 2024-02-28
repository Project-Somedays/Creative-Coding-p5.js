/*
Author: Project Somedays
Date: 2024-02-25
Title: Physics Library 

Going for an underwater reef feel, spawning on a noise field, with the current ebbing and flowing
*/
const zoomFactor = 400;
const everyNthPixel = 5;


// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Composites = Matter.Composites;

let engine;
let world;
let tide;
let lineLength = 200;





function setup() {
  createCanvas(1080, 1920);
  // create an engine
  // engine = Engine.create();
  // world = engine.world;

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
  // tidePhase = 0.5*(sin(radians(10*frameCount)) + 1); // goes between 0 and 1
  tide = map(noise(frameCount/200),0,1, 0, PI);
  for(let y = 0; y < height; y+=everyNthPixel){
    for(let x = 0; x < width; x+=everyNthPixel){
      let nVal = noise(x/zoomFactor,y/zoomFactor);
      if(nVal > 0.5 && nVal < 0.51){
        let offset = map(x, 0, width, 0, HALF_PI);
        fill(255);
        stroke(255);
        strokeWeight(2);
        line(x,y,x + lineLength*cos(tide + offset),y + lineLength*sin(tide + offset));
        // circle(x,y, everyNthPixel);
      }
    }
  }

}

function easeInOutCubic(x){
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
