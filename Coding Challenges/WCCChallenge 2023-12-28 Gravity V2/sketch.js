/*
Author: Project Somedays
Date: 2023-12-28

WCCChallenge Gravity: Entry 2

I wanted to visualise loads of possible trajectories for a body given a starting position and a velocity
Inspired by The Expanse
And Gravity Sims which are fun
*/

const predictSteps = 10000;
const velStep = 1;
const velMax = 5;
const traceSize = 2;
const G = 40;
const colours = ["#d9ed92","#b5e48c","#99d98c","#76c893","#52b69a","#34a0a4","#168aad","#1a759f","#1e6091","#184e77"];
let sunSize;
let c;
let m;
let velocities = [];
let traceShower;



function setup() {
  createCanvas(windowWidth, windowHeight);
  m = createVector(mouseX, mouseY);
  c = createVector(width/2, height/2);
  velocities = [];
  for(let i = 0; i < colours.length; i += velStep){
    velocities.push(createVector(i,0));
  }
  sunSize = width/20;
  noStroke();
  
}

function draw() {
  background(0);
  m.set(mouseX, mouseY);
  traceShower = new TraceShower(m.x, m.y);
  traceShower.update();
  traceShower.show();
  
  fill(255, 255, 0);
  circle(c.x, c.y, sunSize);

  fill(255);
  circle(m.x, m.y, 5);
}

class TraceShower{
  constructor(x,y){
    this.p = createVector(x,y);
    this.traces = [];
  }

  applyForce(f){
    this.a.add(f);
  }

  update(){
    for(let i = 0; i < colours.length; i++){
      let trace = [];
      let p = createVector(this.p.x, this.p.y); // copies of the start
      let v = createVector(velocities[i].x, velocities[i].y);
      for(let j = 0; j < predictSteps; j++){
        let attractionF = p5.Vector.sub(c, p); // direction of acceleration
        let p2c = p5.Vector.dist(p, c); // get the distance from the body
        if(p2c < sunSize/2 || p2c > 1.5*max(width, height)) break; // if we've crashed or if we've 
        attractionF.setMag(G/p2c); // set the mag inversely proportional to the distance
        v.add(attractionF); // change the acceleration
        p.add(v); // change the position
        trace.push(createVector(p.x, p.y)); // add the position to the trace
      }
      this.traces.push(new Trace(colours[i], trace));
    }
     // add the trace

  }

  show(){
    for(let trace of this.traces){
      trace.show()
    }

  }
}

class Trace{
  constructor(col, traceArray){
    this.col = col;
    this.traceArray = traceArray;
  }

  show(){
    stroke(this.col);
    noFill();
    beginShape();
    for(let t of this.traceArray){
      vertex(t.x, t.y);
    }
    endShape(OPEN);
  }
}

