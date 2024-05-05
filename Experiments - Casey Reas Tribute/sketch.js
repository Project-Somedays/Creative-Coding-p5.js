/*
Author: Project Somedays
Date: 2024-05-06
Title: Experiments - Casey Reas Tribute
*/

let r;
let tests = []
let n = 6;
let rate = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);
  r = width/10;
  for(let )

}

function draw() {
  background(220);
  test.update();
  test.show();
}


class CircCollection{
  constructor(){
    this.c = createVector(0, 0);
    this.brushes = calculateInnerCircles(width/6, 10);
    this.noiseOffsetAngle = random(10000);
    this.noiseOffsetX = random(10000);
    this.noiseOffsetY = random(10000);
    this.a = 0;
  }

  update(){
    let x = map(noise(this.noiseOffsetX + frameCount*rate), 0, 1, 0, width);
    let y = map(noise(this.noiseOffsetY + frameCount*rate), 0, 1, 0, height);
    this.c.set(x,y);
    this.a = map(noise(this.noiseOffsetX + frameCount*rate/2), 0, 1, -TWO_PI, TWO_PI);
  }

  show(){
    push();
    translate(this.c.x, this.c.y);
    rotate(this.a)
    for(let b of this.brushes){
      circle(b.p.x,b.p.y, b.radius*2);
    }
    pop();
  }
}


function calculateInnerCircles(diameter) {
  let positionsAndRadii = [];
  let circleDiameter = diameter;
  let circleRadius = circleDiameter/2;
  
  for (let i = 0; i < 6; i++) {
    let angle = i * TWO_PI / 6;
    let xPos = cos(angle) * circleRadius;
    let yPos = sin(angle) * circleRadius;
    positionsAndRadii[i] = {p: createVector(xPos, yPos), radius: circleRadius/2};
  }
  positionsAndRadii.push({p: createVector(0,0), radius: circleRadius/2});
  
  return positionsAndRadii;
}

