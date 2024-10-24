let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

let engine;
let world;
let balls = [];
let ground;
let containerCircle;
let maxBalls = 100;
let minRad;
let maxRad;

function setup() {
  createCanvas(min(windowWidth,windowHeight), min(windowWidth,windowHeight));
  engine = Engine.create();
  world = engine.world;
  minRad = width/50;
  maxRad = width/20;

  // ground = Bodies.rectangle(width/2, height + height/100, 2*width, height/50, {isStatic: true});
  // World.add(world, ground);
  createCircularBoundary(width/2, height/2, width*0.45, 100);

  
  // Create the circular container
  let containerRadius = width*0.45;
  containerCircle = Bodies.circle(width / 2, height / 2, containerRadius, {
    isStatic: true,
    render: { fillStyle: 'transparent' }
  });
  
  // // Invert the container to create an inner boundary
  // Matter.Body.setPosition(containerCircle, { x: width / 2, y: height / 2 });
  // containerCircle.parts.forEach(part => {
  //   part.render.visible = false;
  // });
  // World.add(world, containerCircle);
  
  // // Create a funnel
  // let funnelLeft = Bodies.rectangle(width / 2 - 50, 50, 200, 20, { 
  //   isStatic: true, 
  //   angle: Math.PI / 4
  // });
  // let funnelRight = Bodies.rectangle(width / 2 + 50, 50, 200, 20, { 
  //   isStatic: true, 
  //   angle: -Math.PI / 4
  // });
  // World.add(world, [funnelLeft, funnelRight]);
}

function draw() {
  background(0);
  Engine.update(engine);
  
  // Draw the container
  // noFill();
  // stroke(0);
  // strokeWeight(2);
  // ellipse(width / 2, height / 2, width*0.45);
  

  
  // Draw the balls
  for (let ball of balls) {
    ball.show();
  }
  
  // Add new balls periodically
  if (frameCount % 20 === 0 && balls.length <= maxBalls) {
    addBall(width/2, height*0.1);
  }

  // Remove balls that are off-screen
  for(let ball of balls){
    if(ball.body.position.y > height + 100) World.remove(world, ball.body);
  }
  balls = balls.filter(ball => ball.body.position.y < height + 100);
}




class Ball{
  constructor(x, y, radius){
    this.radius = radius;
    this.body = Bodies.circle(x, y, radius, {
      restitution: 0.2,
      friction: 0.005
    });
    World.add(world, this.body);
  }

  show(){
    fill(255);
    circle(this.body.position.x, this.body.position.y, this.radius*2);
  }
}

function addBall() {
  let ball = new Ball(width/2, height*0.1, random(minRad, maxRad));
  balls.push(ball);
}

function createCircularBoundary(x, y, radius, segments) {
  let composite = Matter.Composite.create();
  let angle = TWO_PI / segments;

  for (let i = 0; i < segments; i++) {
    let theta = i * angle;
    let nextTheta = (i + 1) * angle;

    let x1 = x + radius * cos(theta);
    let y1 = y + radius * sin(theta);
    let x2 = x + radius * cos(nextTheta);
    let y2 = y + radius * sin(nextTheta);

    let segment = Matter.Bodies.rectangle(
      (x1 + x2) / 2,
      (y1 + y2) / 2,
      Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
      5,
      { isStatic: true, angle: theta }
    );

    Matter.Composite.add(composite, segment);
  }

  Matter.World.add(world, composite);
}


function mousePressed(){
  if(mouseButton === LEFT){
    balls.push(new Ball(mouseX, mouseY, random(minRad, maxRad)));
  }
  
}


// let R;
// let minR;
// let maxAttempts = 200;
// let maxBubbles = 200;
// let everyNFrames = 2;

// let bubbleField = [];

// function setup(){
//   createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);

//   R = width*0.45;
//   minR = width/100;

//   // fill(255);
//   // noStroke();
//   stroke(255);
// }

// function draw(){
//   background(0);

//   if(bubbleField.length === maxBubbles) stroke(0,255,0);
//   if(bubbleField.length <= maxBubbles && frameCount%everyNFrames === 0) insertBubble();

//   for(let i = 0; i < bubbleField.length; i++){
//     if(bubbleField[i].growing) bubbleField[i].grow();
//     // compare to all others to detemine when to stop
//     for(let j = i; j < bubbleField.length; j++){
//       if(bubbleField[i] === bubbleField[j]) continue;
//       if(p5.Vector.dist(bubbleField[i].p, bubbleField[j].p) < (bubbleField[i].r + bubbleField[j].r)){
//         bubbleField[i].stopGrowing();
//         bubbleField[j].stopGrowing()
//       }
//     }
//   }

  
//   for(let bubble of bubbleField){
//     bubble.show();
//   }

//   orbitControl();

// }

// function insertBubble(){
//   let attempts = 0;
//   while(attempts < maxAttempts){
//     let a = random(TWO_PI);
//     let r = random(R);
//     let p = createVector(r*cos(a), r*sin(a), 0);
//     let isValid = true;
//     for(let bubble of bubbleField){
//       if(p5.Vector.dist(bubble.p, p) < max(minR*2, bubble.r)){
//         isValid = false;
//         break;
//       }
//     }
//     if(isValid){
//       bubbleField.push(new Bubble(p.x, p.y, p.z));
//       return;
//     }
//     attempts ++;
//   }
// }


// class Bubble{
//   constructor(x,y, z){
//     this.p = createVector(x,y,z);
//     this.r = minR;
//     this.growing = true;
//   }

//   stopGrowing(){
//     this.growing = false;
//   }

//   grow(){
//     if(this.growing) this.r ++;
//   }

//   show(){
//     push();
//     translate(this.p.x, this.p.y, this.p.z);
//     sphere(this.r);
//     pop();
//   }
// }