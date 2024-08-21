/*
Author: Project Somedays
Date: 2024-08-13 updated 2024-08-21
Title: Genuary 2024 Day 30 Shaders: interference patterns

Huge help from Dave on this one! Still VERY new to the whole shader world. Check out his stuff! https://openprocessing.org/user/67809?view=sketches&o=48
Defs check out the Birb's Nest Community https://discord.gg/g5J6Ajx9Am if you like this sort of thing 🙂
Can't credit Sableraph enough for gathering such a generous and fun collective: https://openprocessing.org/user/22192?view=sketches&o=48

There are a few control points moving around the screen with perlin noise
We pass their coordinates to the shader and it measures a normalized distance to each pixel, maps it between 0 and TWO_PI
We then add up the sines of those mapped distances to show the destructive and constructive interference

Probably something I've missed here, but I'm pretty happy with it!
*/

let shaderProgram;
let gui;
let params;
let cpt1, cpt2;
let colours;
let controlPoints = [];

function preload() {
  shaderProgram = createShader(vertShader, fragShader);
}

function setup() {
  createCanvas(min(windowWidth, windowHeight),min(windowWidth, windowHeight), WEBGL);
  // createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);
  // createCanvas(1080, 1080, WEBGL);
  noStroke();

  colours = {
    "Oxford Blue":color("#101a2b"),
    "Midnight green":color("#032c2d"),
    "Brunswick green":color("#204c3d"),
    "Café noir":color("#482f00"),
    "Black bean":color("#381201")}
 
  params = {
    uCycles: 5.0,
    noiseProgRate: 0.0025,
    nControlPoints: 5,
    baseColour: colours["Oxford Blue"]
  }

  controlPoints = makeControlPoints(params.nControlPoints);

  gui = new lil.GUI();
  gui.add(params, 'uCycles', 1.0, 10.0);
  gui.add(params, 'noiseProgRate', 0.0001, 0.01);
  gui.add(params, 'nControlPoints', 1, 15, 1).onChange((value) => {controlPoints = makeControlPoints(value)});
  gui.add(params, 'baseColour', colours);

  yOff = random(10000);
  xOff = random(10000);
}


function draw() {
  background(0);

  for(let cpt of controlPoints){
    cpt.update();
  }
  
  shader(shaderProgram);  

  shaderProgram.setUniform('uResolution', [float(width), float(height)])
  shaderProgram.setUniform('uControlPointCount', controlPoints.length);
  shaderProgram.setUniform('uControlPoints', controlPoints.flatMap(cpt => [cpt.p.x, cpt.p.y]));
  // for(let i = 0; i < controlPoints.length; i++){
  //   shaderProgram.setUniform(`uCpt${i+1}`, [controlPoints[i].p.x, controlPoints[i].p.y]);
  // }
  shaderProgram.setUniform('uMaxDist', dist(-width/2, -width/2, width/2, height/2));
  shaderProgram.setUniform('uCycles', float(params.uCycles));
  shaderProgram.setUniform('uBaseColour', normalizeColour(params.baseColour));
  
  
  // Draw a rectangle to cover the entire canvas
  beginShape();
  vertex(-1, -1, 0, 0, 0);  // Bottom-left corner
  vertex(1, -1, 0, 1, 0);   // Bottom-right corner
  vertex(1, 1, 0, 1, 1);    // Top-right corner
  vertex(-1, 1, 0, 0, 1);   // Top-left corner
  endShape(CLOSE);   // Top-left
}

function windowResized() {
  // resizeCanvas(min(windowWidth, windowHeight),min(windowWidth, windowHeight));
  resizeCanvas(1080, 1080, WEBGL);
}

// Helper functions
const makeControlPoints = (n) => {return new Array(n).fill(0).map(() => new ControlPoint())};
const normalizeColour = (c) => {return [red(c)/255.0, green(c)/255.0, blue(c)/255.0]};
const getNoiseVal = (noiseOff, maxVal, minVal, noiseProgRate) => { return map(noise(noiseOff + frameCount*noiseProgRate), 0, 1, minVal, maxVal)};


const vertShader = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = vec2(aTexCoord.x, 1.0 - aTexCoord.y);
  gl_Position = vec4(aPosition, 1.0);
}
`

const fragShader = `
#ifdef GL_ES
precision mediump float;
#endif

const int MAX_CONTROL_POINTS = 100;
varying vec2 vTexCoord;
uniform vec2 uResolution;
uniform vec3 uBaseColour;
uniform int uControlPointCount;
uniform vec2 uControlPoints[MAX_CONTROL_POINTS];
uniform vec2 uCpt1;
uniform vec2 uCpt2;
uniform vec2 uCpt3;
uniform vec2 uCpt4;
uniform vec2 uCpt5;
uniform float uMaxDist;
uniform float uCycles;
float PI = 3.1415926535;

void main() {
  vec2 st = gl_FragCoord.st/uResolution;
  vec2 coord = st*uResolution - uResolution / 2.0;

  float brightness = 0.0;
  for (int i = 0; i < MAX_CONTROL_POINTS; i++) {
    if(i >= uControlPointCount) break;
    float ndist = distance(coord, uControlPoints[i])/uMaxDist; // normalize
    brightness += sin(uCycles*ndist*2.0*PI);
  }

  vec3 col = mix(vec3(1.0), uBaseColour, abs(brightness));
 
  // gl_FragColor = vec4(1.0 - vec3(abs(brightness)), 1.0);
  gl_FragColor = vec4(col, 1.0);  
}
`

class ControlPoint{
  constructor(){
    this.xOff = random(1000);
    this.yOff = random(1000);
    this.p = createVector(0,0);
  }

  update(){
    let x = getNoiseVal(this.xOff, -width/2, width/2, params.noiseProgRate);
    let y = getNoiseVal(this.yOff, -height/2, height/2, params.noiseProgRate);
    this.p.set(x,y);
  }

  show(){
    fill(255);
    push();
    translate(this.p.x, this.p.y, 0);
    sphere(width/25);
    pop();
  }
}




