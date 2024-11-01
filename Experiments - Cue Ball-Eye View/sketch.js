// poolball textures: https://www.robinwood.com/Catalog/FreeStuff/Textures/TexturePages/BallMaps.html

let engine;
let world;
let balls = [];
let cueBall;
let shotState = 'IDLE'; // IDLE, AIMING, POWER, SHOOTING
let pivotPoint = { x: 0, y: 0 };
let shotAngle = 0;
let shotPower = 0;
let cameraPos = { x: 0, y: 0, z: 0 };
let targetPos = { x: 0, y: 0, z: 0 };
const TABLE_WIDTH = 1000;
const TABLE_HEIGHT = 500;
const BALL_RADIUS = 15;
const MAX_POWER = 200;
let powerDisplay = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Initialize Matter.js
  engine = Matter.Engine.create();
  world = engine.world;
  world.gravity.y = 0;
  
  // Create table boundaries
  const walls = [
    Matter.Bodies.rectangle(0, -TABLE_HEIGHT/2, TABLE_WIDTH, 20, { isStatic: true }), // top
    Matter.Bodies.rectangle(0, TABLE_HEIGHT/2, TABLE_WIDTH, 20, { isStatic: true }), // bottom
    Matter.Bodies.rectangle(-TABLE_WIDTH/2, 0, 20, TABLE_HEIGHT, { isStatic: true }), // left
    Matter.Bodies.rectangle(TABLE_WIDTH/2, 0, 20, TABLE_HEIGHT, { isStatic: true }) // right
  ];
  Matter.World.add(world, walls);
  
  // Create balls
  setupBalls();
  
  // Set initial camera position for top-down view
  setCameraTopDown();
}

function setupBalls() {
  // Create cue ball
  cueBall = Matter.Bodies.circle(-200, 0, BALL_RADIUS, {
    restitution: 0.9,
    friction: 0.001,
    density: 1
  });
  Matter.World.add(world, cueBall);
  
  // Create rack of balls
  const startX = 200;
  const startY = 0;
  const rows = 5;
  let ballCount = 0;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col <= row; col++) {
      const x = startX + (row * BALL_RADIUS * 2);
      const y = startY + (col * BALL_RADIUS * 2) - (row * BALL_RADIUS);
      
      const ball = Matter.Bodies.circle(x, y, BALL_RADIUS, {
        restitution: 0.9,
        friction: 0.001,
        density: 1
      });
      balls.push(ball);
      Matter.World.add(world, ball);
      ballCount++;
    }
  }
}

function draw() {
  background(34);
  
  // Update physics
  Matter.Engine.update(engine);
  
  // Update camera position based on game state
  updateCamera();

  pointLight(255, 255, 255, 0, 0, 0);
  
  // Draw table
  push();
  noStroke();
  fill(0, 100, 0);
  rect(-TABLE_WIDTH/2, -TABLE_HEIGHT/2, TABLE_WIDTH, TABLE_HEIGHT);
  pop();
  
  // Draw balls
  push();
  noStroke();
  // Draw racked balls
  balls.forEach((ball, index) => {
    push();
    translate(ball.position.x, ball.position.y);
    fill(255, 200, 0);
    sphere(BALL_RADIUS);
    pop();
  });
  
  // Draw cue ball
  push();
  translate(cueBall.position.x, cueBall.position.y);
  fill(255);
  sphere(BALL_RADIUS);
  pop();
  pop();
  
  // Handle shot mechanics
  if (shotState === 'AIMING') {
    drawAimingLine();
  } else if (shotState === 'POWER') {
    drawPowerIndicator();
  }
}

function drawAimingLine() {
  push();
  stroke(255);
  strokeWeight(2);
  const lineLength = 200;
  const endX = cueBall.position.x + cos(shotAngle) * lineLength;
  const endY = cueBall.position.y + sin(shotAngle) * lineLength;
  line(cueBall.position.x, cueBall.position.y, endX, endY);
  pop();
}

function drawPowerIndicator() {
  push();
  stroke(255, 0, 0);
  strokeWeight(5);
  const powerLength = map(shotPower, 0, MAX_POWER, 0, 200);
  const startX = cueBall.position.x - cos(shotAngle) * BALL_RADIUS * 2;
  const startY = cueBall.position.y - sin(shotAngle) * BALL_RADIUS * 2;
  const endX = startX - cos(shotAngle) * powerLength;
  const endY = startY - sin(shotAngle) * powerLength;
  line(startX, startY, endX, endY);
  pop();
}

function setCameraTopDown() {
  cameraPos = { x: 0, y: 0, z: 800 };
  camera(cameraPos.x, cameraPos.y, cameraPos.z, 0, 0, 0, 0, 1, 0);
}

function setCameraBehindCueBall() {
  const distance = 200;
  const height = 100;
  cameraPos = {
    x: cueBall.position.x - cos(shotAngle) * distance,
    y: cueBall.position.y - sin(shotAngle) * distance,
    z: height
  };
  targetPos = {
    x: cueBall.position.x + cos(shotAngle) * 100,
    y: cueBall.position.y + sin(shotAngle) * 100,
    z: 0
  };
  camera(cameraPos.x, cameraPos.y, cameraPos.z, 
         targetPos.x, targetPos.y, targetPos.z, 
         0, 0, 1);
}

function updateCamera() {
  if (shotState === 'SHOOTING') {
    setCameraBehindCueBall();
  } else {
    setCameraTopDown();
  }
}

function mousePressed() {
  if (shotState === 'IDLE') {
    pivotPoint = { x: mouseX - width/2, y: mouseY - height/2 };
    shotState = 'AIMING';
  }
}

function mouseDragged() {
  if (shotState === 'AIMING') {
    const dx = (mouseX - width/2) - pivotPoint.x;
    const dy = (mouseY - height/2) - pivotPoint.y;
    shotAngle = atan2(dy, dx);
  } else if (shotState === 'POWER') {
    const dx = (mouseX - width/2) - pivotPoint.x;
    const dy = (mouseY - height/2) - pivotPoint.y;
    const distance = dist(pivotPoint.x, pivotPoint.y, mouseX - width/2, mouseY - height/2);
    shotPower = constrain(distance, 0, MAX_POWER);
  }
}

function mouseReleased() {
  if (shotState === 'AIMING') {
    shotState = 'POWER';
  } else if (shotState === 'POWER') {
    takeShot();
  }
}

function takeShot() {
  const force = shotPower * 0.05;
  Matter.Body.applyForce(cueBall, 
    cueBall.position,
    {
      x: cos(shotAngle) * force,
      y: sin(shotAngle) * force
    }
  );
  shotState = 'SHOOTING';
  
  // Reset shot after a delay
  setTimeout(() => {
    if (shotState === 'SHOOTING') {
      shotState = 'IDLE';
      shotPower = 0;
    }
  }, 2000);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}