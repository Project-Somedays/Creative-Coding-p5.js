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
  for(let i = 0; i < n; i++){
    tests[i] = new CircCollection();
  }
  strokeWeight(1);
  stroke(255);
  noFill();
  // noStroke();
 
  
}

function draw() {
  background(0);
  
  for(let t of tests){
    t.update();
    t.show();
  }

  drawOverlap();
  
}

function drawOverlap(){
  for(let i = 0; i < tests.length; i++){
    for(let j = i; j < tests.length; j++){
      // see if we're out of range
      if(p5.Vector.dist(tests[i].c, tests[j].c) > 2*r) continue;

      // if not, go through and check for overlap between any of the brushes
      let brushesA = tests[i].getAbsPositions();
      let brushesB = tests[j].getAbsPositions();
      for(let a = 0; a < brushesA.length; a ++){
        for(let b = a; b < brushesB.length; b ++){
          let brushA = brushesA[a];
          let brushB = brushesB[b];
          let d = p5.Vector.dist(brushA.p, brushB.p)
          if(d > brushA.radius + brushB.radius) continue;
          // stroke(int(map(d, 0, brushA.r + brushB.r, 255, 0)));
          line(brushA.p.x, brushA.p.y, brushB.p.x, brushB.p.y);
        }
      }
    }
  }
}


class CircCollection{
  constructor(){
    this.c = createVector(0, 0);
    this.brushes = calculateInnerCircles(this.c.x, this.c.y, width/6, 10);
    this.noiseOffsetAngle = random(10000);
    this.noiseOffsetX = random(10000);
    this.noiseOffsetY = random(10000);
    this.a = 0;
  }

  update(){
    let x = map(noise(this.noiseOffsetX + frameCount*rate), 0, 1, -width*0.1, 1.1*width);
    let y = map(noise(this.noiseOffsetY + frameCount*rate), 0, 1, -height*0.1, 1.1*height);
    this.a = map(noise(this.noiseOffsetAngle + frameCount*rate), 0, 1, -TWO_PI, TWO_PI);
    this.c.set(x,y);
    this.brushes = calculateInnerCircles(this.c.x, this.c.y, width/6, this.a);
    
  }

  show(){
    
    for(let b of this.brushes){
      circle(b.p.x,b.p.y, b.radius*2);
    }
   
  }

  getAbsPositions(){
    let absPositions = [];
    for(let b of this.brushes){
      absPositions.push({p: p5.Vector.add(b.p, this.c), radius: b.r});
    }
    return absPositions;
  }
}


function calculateInnerCircles(cx, cy, diameter, rotAngle) {
  let positionsAndRadii = [];
  let circleDiameter = diameter;
  let circleRadius = circleDiameter/2;
  
  for (let i = 0; i < 6; i++) {
    let angle = i * TWO_PI / 6;
    let xPos = cos(angle + rotAngle) * circleRadius;
    let yPos = sin(angle + rotAngle) * circleRadius;
    positionsAndRadii[i] = {p: createVector(cx + xPos, cy + yPos), radius: circleRadius/3};
  }
  positionsAndRadii.push({p: createVector(cx,cy), radius: circleRadius/3});
  
  return positionsAndRadii;
}

