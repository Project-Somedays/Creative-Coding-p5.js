// Idea: run the sim in setup, log the positions of all the nodes and then we can rewind perfectly =)

let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint;

let engine;
let world;
let nodes = [];
let constraints = [];
const totalNodes = 1000;
let spool;
let winding = false;
let ground;
const captureFrames = 150;
let captureArray = [];
let rewind = false;
let currentFrame = 0;
let junkFrames = 3;


function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create engine and world
  engine = Engine.create();
  world = engine.world;
  engine.gravity.y = 1;

  // Create spool
  spool = Bodies.circle(width / 2, 100, 20, { isStatic: true });
  World.add(world, spool);

  ground = Bodies.rectangle(width/2, height, 3/2*width, 100, { isStatic: true });
  World.add(world, ground);

  // Create nodes and constraints
  let prevNode = null;
  for (let i = 0; i < totalNodes; i++) {
    let node = Bodies.circle(width/2, 100 + i, 5, { friction: 0.001 });
    World.add(world, node);
    nodes.push(node);

    if (prevNode) {
      let options = {
        bodyA: prevNode,
        bodyB: node,
        length: 20,
        stiffness: 0.8
      };
      let constraint = Constraint.create(options);
      World.add(world, constraint);
      constraints.push(constraint);
    }
    prevNode = node;
  }
  // get that first frame out of the way
  for(let i = 0; i < junkFrames; i++){
    Engine.update(engine);
  }
  
  captureArray = capture(captureFrames);
  pixelDensity(1);
  frameRate(30);
  
  stroke(0);
  strokeWeight(5);
  noFill();

}

function draw() {
  background(240);


  currentFrame = frameCount % captureFrames;
  if(currentFrame === 0) rewind = !rewind;

  let frameIndex = rewind ? captureFrames - 1 - currentFrame : currentFrame;

  beginShape();
  for(let j = 0; j < totalNodes; j++){
    curveVertex(captureArray[frameIndex][j].x,captureArray[frameIndex][j].y);
  }
  endShape();


  
  }
  
  

  // Update engine
  // Engine.update(engine);

  // // Draw spool
  // fill(200);
  // ellipse(spool.position.x, spool.position.y, 40);

  // // Draw nodes and constraints
  // // for (let i = 0; i < nodes.length; i++) {
  // //   fill(0);
  // //   ellipse(nodes[i].position.x, nodes[i].position.y, 5);
  // // }

  // // to replace with curveVertex at some point
  // strokeWeight(5);
  // stroke(0);
  // noFill();
  // beginShape();
  // for (let c of constraints) {
  //   // line(c.bodyA.position.x, c.bodyA.position.y, c.bodyB.position.x, c.bodyB.position.y);
  //   curveVertex(c.bodyA.position.x, c.bodyA.position.y);
  // }
  // endShape();

  // // Winding mechanism
  // // if (winding) {
  // //   let firstNode = nodes[0];
  // //   Matter.Body.setPosition(firstNode, spool.position);

  // //   for (let i = 1; i < nodes.length; i++) {
  // //     let constraint = constraints[i];
  // //     // Matter.Body.setPosition(nodes[i], constraint.bodyA.position);
  // //     Matter.Body.setPosition(nodes[i], mousePos);
  // //   }
  // // }


function mousePressed() {
  winding = !winding;
}


function capture(captureFrames){
  let captureArray = new Array(captureFrames);
  for(let i = 0; i < captureFrames; i++){
    framePositions = new Array(nodes.length);
    Engine.update(engine);
    for(let j = 0; j < nodes.length; j++){
      framePositions[j] = createVector(nodes[j].position.x, nodes[j].position.y);
    }
    captureArray[i] = [...framePositions];
  }
  return captureArray;
}
