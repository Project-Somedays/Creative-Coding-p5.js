/*
Author: Project Somedays
Date: 2024-08-10
Title: WCCChallenge 2024 Week 32 - Pattern

Made for Sableraph's weekly creative coding challenges, reviewed weekly on https://www.twitch.tv/sableraph
See other submissions here: https://openprocessing.org/curation/78544
Join The Birb's Nest Discord community! https://discord.gg/g5J6Ajx9Am


*/

let pts = [];
let controlPoints = [];
let gui, params;



function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  
  gui = new lil.GUI();
  params = {
    nFieldPoints: 500,
    nControlPoints: 2,
    noiseProgRate: 0.001,
    sep: 10,
    amp: 20,
    showControlPoints: true,
    phase: 0,
    cycles: 3
  }

  gui.add(params, 'nFieldPoints', 100, 5000, 1)
     .onChange(value => pts = genSquarePtPlane(value));
  gui.add(params, 'nControlPoints', 1, 20, 1)
     .onChange(value => controlPoints = generateControlPoints(value));
  gui.add(params, 'noiseProgRate', 0.0001, 0.01);
  gui.add(params, 'sep', 1, width/2).onChange(value => pts = genSquarePtPlane(value));
  gui.add(params, 'amp', 5, 500);
  gui.add(params, 'phase', 0, TWO_PI);
  gui.add(params, 'cycles', 1, 10, 1);
  gui.add(params, 'showControlPoints');
  

  controlPoints = generateControlPoints(params.nControlPoints);

  pts = genSquarePtPlane(params.nFieldPoints);
  noStroke();
  
}

function draw() {
  background(220);
  fill(255,0,0);
  noStroke();

  pointLight(255, 255, 255, 0,0,height/2);
  for(let cpt of controlPoints){
    cpt.update();
    cpt.show();
  }

  for(let pt of pts){
    push();
    translate(pt.x, pt.y, pt.z);
    let r = 0;
    for(let cntrlPt of controlPoints){
      let d = map(p5.Vector.dist(cntrlPt.pos, pt), 0, params.sep*sqrt(params.nFieldPoints), 0, TWO_PI);
      r += params.amp * sin(params.cycles*d + params.phase);
    }
    sphere(r);
    pop();
  }

  orbitControl();
}


function generateControlPoints(n){
  let cpts = [];
  for(let i = 0; i < n; i++){
    cpts[i] = new ControlPoint();
  }
  return cpts;
}


function genSquarePtPlane(n){
  let points = [];
  let s = int(sqrt(n));
  for(let x = -params.sep*s/2; x < params.sep*s/2; x += params.sep){
    for(let y = -params.sep*s/2; y < params.sep*s/2; y += params.sep){
      points.push(createVector(x,y,0));
    }
  }
  return points;
}

class ControlPoint{
  constructor(){
    this.xOff = random(1000);
    this.yOff = random(1000);
    this.pos = createVector(0,0,0);
  }

  update(){
    let x = map(noise(this.xOff + frameCount*params.noiseProgRate), 0, 1, -sqrt(params.nFieldPoints)*params.sep/2, sqrt(params.nFieldPoints)*params.sep/2);
    let y = map(noise(this.yOff + frameCount*params.noiseProgRate), 0, 1, -sqrt(params.nFieldPoints)*params.sep/2, sqrt(params.nFieldPoints)*params.sep/2);
    this.pos.set(x,y,0);
  }

  show(){
    if(params.showControlPoints){
      fill(255);
      push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        sphere(min(width, height)/20);
      pop();
    }
  }
}
