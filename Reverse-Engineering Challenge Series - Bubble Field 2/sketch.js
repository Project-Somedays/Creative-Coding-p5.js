/*
Author: Project Somedays
Date: 2024-07-27 last updated 2024-08-03
Title: Reverse-Engineering Challenge Series: Bubble Field 2

Setting the size of the spheres by their spherical distance from the control point (also moving around on the surface of the sphere)

INSPIRATION/RESOURCES
  - https://x.com/TatsuyaBot/status/1813781259480703419
  - lil-gui library: https://cdn.jsdelivr.net/npm/lil-gui@0.19.2/dist/lil-gui.umd.min.js

TO-DO
  - DONE! lil-gui colour picker
  - multiple triggers
  - non-linear function for setting the size
  - dynamically set the size of the spheres based on how many there are
  - DONE! fix mapping function - I'm getting wrap around (but I don't hate it)
*/


const colours = {"Ultra Violet":"#54478c","Lapis Lazuli":"#2c699a","Blue (Munsell)":"#048ba8","Keppel":"#0db39e","Emerald":"#16db93","Light green":"#83e377","Mindaro":"#b9e769","Maize":"#efea5a","Saffron":"#f1c453","Sandy brown":"#f29e4c"};
let gui;
let params;
let xOff, yOff, zOff;
let cntrlPts = [];
let r;
let points = [];
let spotLightPos;
let decayingSineVariables;
let sineVariables;

function setup() {
  // createCanvas(min(windowWidth,windowHeight), min(windowWidth,windowHeight), WEBGL);
  createCanvas(1080, 1080, WEBGL);
  r = min(width, height)/3;
  noStroke();

  
  // normalMaterial();
  
  gui = new lil.GUI();
  xOff = random(10000);
  yOff = random(10000);
  zOff = random(10000);
  
  
  spotLightPos = createVector(0,0,0);
  
  // establish gui parameters
  params = {
    n: 500,
    controlPoints: 1,
    noiseZoom: 0.1,
    noiseProgRate: 150,
    globRotRate: 600,
    autoRotMode: true,
    threshold: r*PI,
    distanceMapMethod: linearDMap,
    decayAmplitude: 2*r,
    decayRate: 1,
    decayFrequency: 1,
    decayPhaseShift: 0,
    colour: colours["Ultra Violet"],
    sineAmp: r*0.05,
    sineN: 1,
    sineOffset: 0,
    camLightZ: 1.5*r,
    boxRotSpeed: 0.0025,
    pointRepresentationMethod: showSphere,
    centreLight: true,
    edgeLight: false,
    camLight: true
  }

  // set up gui
  gui.add(params, 'n', 100, 3000, 1)
    .onChange(value => points = sphericalPointDistribution(value));
  gui.add(params, 'controlPoints', 1, 20, 1)
    .onChange(value => cntrlPts = genCntrlPts(value));
  gui.add(params, 'camLightZ', 0, 3*r);
  gui.add(params, 'noiseZoom', 0.01, 300);
  gui.add(params, 'noiseProgRate', 30, 600);
  gui.add(params, 'globRotRate', 30, 1200);
  gui.add(params, 'threshold', 0, PI*r);
  gui.add(params, 'autoRotMode');
  gui.add(params, 'distanceMapMethod', {'linearDMap': linearDMap, 'decayingSine': decayingSine, 'straightSine': straightSine});
  decayingSineVariables = gui.addFolder('Decaying Sine Variables');
  decayingSineVariables.add(params, 'decayAmplitude', 0.1*r, 5*r);
  decayingSineVariables.add(params, 'decayRate', 0, TWO_PI);
  decayingSineVariables.add(params, 'decayFrequency', 0, 5);
  decayingSineVariables.add(params, 'decayPhaseShift', 0, TWO_PI);
  sineVariables = gui.addFolder('Sine Variables');
  sineVariables.add(params, 'sineAmp', 0.01*r, 0.25*r);
  sineVariables.add(params, 'sineN', 1, 10);
  sineVariables.add(params, 'sineOffset', 0, TWO_PI);
  gui.add(params, 'colour', colours);
  gui.add(params, 'boxRotSpeed', 0.001, 0.01);
  gui.add(params, 'pointRepresentationMethod', {
    'spherical' : showSphere,
    'cube': showBox
  })
  gui.add(params, 'centreLight');
  gui.add(params, 'edgeLight');
  gui.add(params, 'camLight');


  points = sphericalPointDistribution(params.n);

  for(let i = 0; i < params.controlPoints; i++){
    cntrlPts[i] = new CntrlPoint(random(1000), random(1000));
  }
  



  }

function draw() {
  background(255);
  push();
  

  if(params.autoRotMode) {
    rotateX(frameCount/params.globRotRate);
    rotateY(frameCount/params.globRotRate);
    rotateZ(frameCount/params.globRotRate);
  } else{
    orbitControl();
  }

  // shine light out of the middle
  if(params.centreLight) pointLight(red(params.colour), green(params.colour), blue(params.colour), 0, 0, 0);
  if(params.camLight) pointLight(red(params.colour), green(params.colour), blue(params.colour), 0, 0, params.camLightZ);
  if(params.edgeLight) pointLight(255, 255, 255, params.camLightZ, 0, 0);
  // ambientLight(red(params.colour), green(params.colour), blue(params.colour));

  // draw a spotlight in line but further out and on the opposite side to the cntrol point
  // spotLightPos.set(-1.75*cntrlX, -1.75*cntrlY, -1.75*cntrlZ);
  // pointLight(red(params.colour), green(params.colour), blue(params.colour), spotLightPos.x, spotLightPos.y, spotLightPos.z);
  // pointLight(red(params.colour), green(params.colour), blue(params.colour), -spotLightPos.x, -spotLightPos.y, -spotLightPos.z);
 
  // update control points
  for(let cntrlPt of cntrlPts){
    cntrlPt.update();
  }
  

  // show growpoints
  for(let pt of points){
    push();
    translate(pt.loc.x, pt.loc.y, pt.loc.z);
    let growPtR = 0;
    for(let cntrlPt of cntrlPts){
      let d = sphericalDistance(cntrlPt.lat, cntrlPt.lon, pt.lat, pt.lon, r);
      if(d <= params.threshold) growPtR += params.distanceMapMethod(d);
    }
    
    params.pointRepresentationMethod(growPtR, params.boxRotSpeed);
    pop();
  }

  
  
}

function genCntrlPts(count){
  let pts = [];
  for(let i = 0; i < count; i++){
    pts[i] = new CntrlPoint(random(1000), random(1000));
  }
  return pts;
}

class CntrlPoint{
  constructor(xOff, yOff){
    this.xOff = xOff;
    this.yOff = yOff;
    this.pos = createVector(0,0);
  }

  update(){
    // locating the cntrlPoint
  this.theta = map(noise(frameCount/params.noiseProgRate + this.xOff), 0, 1, 0, TWO_PI);
  this.phi = map(noise(frameCount/params.noiseProgRate + this.yOff), 0, 1, 0, TWO_PI);
  let cntrlX = r*sin(this.phi)*cos(this.theta);
  let cntrlY = r*sin(this.phi)*sin(this.theta);
  let cntrlZ = r*cos(this.phi);
  let latlon = cartesianToSpherical(cntrlX, cntrlY, cntrlZ, r);

  // update the cntrlPt
  this.lat = latlon.lat;
  this.lon = latlon.lon;
  this.pos.set(cntrlX,cntrlY,cntrlZ);
  }

  show(){

  noFill();
  stroke(255);
  push();
  translate(this.pos.x, this.pos.y, this.pos.z);
  sphere(params.sep/4);
  pop(); 
  }

}

const showSphere = (r, rotSpeed) => sphere(r);

const showBox = (r, rotSpeed) => {
  push();
  rotateX(TWO_PI*frameCount*rotSpeed)
  rotateY(-TWO_PI*frameCount*rotSpeed)
  rotateZ(TWO_PI*frameCount*rotSpeed);
  box(2*r, 2*r, 2*r);
  pop();
}


function sphericalPointDistribution(n){
  // evenly distribute points on a sphere thanks to ChatGPT
  let points = [];
  let phi = (1 + sqrt(5)) / 2 - 1; // Golden ratio
  let ga = phi * TWO_PI; // Golden angle in radians
  

  for (let i = 0; i < n; i++) {
    let lat = asin(-1 + (2 * i) / n);
    let lon = ga * i;
    
    let x = r * cos(lat) * cos(lon);
    let y = r * cos(lat) * sin(lon);
    let z = r * sin(lat);
    
    points[i] = {lat: lat, lon: lon, loc: createVector(x, y, z)};
  }

  return points;
}

function gridPointDistribution(n){
  let points = [];
  let s = int(pow(n, 1/3));
  for(let x = -s/2; x < s/2; x ++){
    for(let y = -s/2; y < s/2; y ++){
      for(let z = -s/2; z < s/2; z++){
        points.push(createVector(x,y,z));
      }
    }
  }
  return points;
}

function linearDMap(d){
  return map(d, 0, PI*r, r/10, 0);
}

function decayingSine(d) {
  let dAngle = map(d,0,PI*r, 0, TWO_PI);
  return 0.001*r*params.decayAmplitude * exp(-params.decayRate * dAngle) * sin(params.decayFrequency * dAngle + params.decayPhaseShift);
}

function sphericalDistance(lat1, lon1, lat2, lon2, radius) {
  // thanks ChatGPT
  let dLat = lat2 - lat1;
  let dLon = lon2 - lon1;

  let a = sin(dLat / 2) * sin(dLat / 2) +
          cos(lat1) * cos(lat2) *
          sin(dLon / 2) * sin(dLon / 2);

  let c = 2 * atan2(sqrt(a), sqrt(1 - a));

  let distance = radius * c;
  return distance;
}

function cartesianToSpherical(x, y, z, radius) {
  // thanks ChatGPT
  let lat = asin(z / radius);
  let lon = atan2(y, x);

  return {
    lat: lat, // Latitude in radians
    lon: lon  // Longitude in radians
  };
}

function straightSine(d){ 
  let t = map(d, 0, PI*r, 0, TWO_PI);
  return params.sineAmp * sin(params.sineN * t + params.sineOffset);
}