/*
Author: Project Somedays
Date: 2023-12-28

WCCChallenge Gravity: Entry 2

I wanted to visualise loads of possible trajectories for a body given a starting position and a velocity
Inspired by The Expanse
And Gravity Sims which are fun
*/

const predictSteps = 100;
const velStep = 0.5;
const velMax = 5;
const traceSize = 5;
let c;
let m;
let velocities = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  m = createVector(mouseX, mouseY);
  c = createVector(width/2, height/2);
  velocities = [];
  for(let i = 0; i < velMax; i += velStep){
    velocities.push(createVector(i,0));
  }
}

function draw() {
  background(0);
  m.set(mouseX, mouseY);
  
  fill(255, 255, 0);
  circle(c.x, c.y, width/20);

  fill(255);
  circle(m.x, m.y, 5);
}

class Body{
  constructor(x,y){
    this.p = createVector(x,y);
    this.traces = [];
  }

  applyForce(f){
    this.a.add(f);
  }

  update(){
    for(let i = 0; i < velocities.length; i++){
      let trace = [];
      let p = createVector(this.p.x, this.p.y); // copies of the start
      let v = createVector(velocities[i].x, velocities[i].y);
      for(let j = 0; j < predictSteps; j++){
        
      }
    }
    this.traces.push(trace);

  }

  show(){
    for(let trace of this.traces){
      for(let p of trace){
        circle(p.x, p.y, traceSize)
      }
    }

  }
}
