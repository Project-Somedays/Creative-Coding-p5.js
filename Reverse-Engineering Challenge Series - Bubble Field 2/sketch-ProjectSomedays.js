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
  - multiple control points
  - DONE! non-linear function for setting the size
  - dynamically set the size of the spheres based on how many there are
  - DONE! fix mapping function - I'm getting wrap around (but I don't hate it)
*/


const colours = {"Ultra Violet":"#54478c","Lapis Lazuli":"#2c699a","Blue (Munsell)":"#048ba8","Keppel":"#0db39e","Emerald":"#16db93","Light green":"#83e377","Mindaro":"#b9e769","Maize":"#efea5a","Saffron":"#f1c453","Sandy brown":"#f29e4c"};
let gui;
let params;
let xOff, yOff, zOff;
let cntrlPt;
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
  
  cntrlPt = createVector(0,0,0);
  spotLightPos = createVector(0,0,0);
  
  // establish gui parameters
  params = {
    n: 500,
    noiseZoom: 0.1,
    noiseProgRate: 150,
    globRotRate: 600,
    autoRotMode: true,
    upperDistLim: height/4,
    distanceMapMethod: linearDMap,
    decayAmplitude: 2*r,
    decayRate: 1,
    decayFrequency: 1,
    decayPhaseShift: 0,
    colour: colours["Ultra Violet"],
    sineAmp: r*0.05,
    sineN: 1,
    sineOffset: 0
  }

  // set up gui
  gui.add(params, 'n', 100, 2000, 1)
     .onChange(value => points = sphericalPointDistribution(value));
  gui.add(params, 'noiseZoom', 0.01, 300);
  gui.add(params, 'noiseProgRate', 30, 600);
  gui.add(params, 'globRotRate', 30, 1200);
  gui.add(params, 'upperDistLim', 0.01*params.n*params.sep,params.n*params.sep);
  gui.add(params, 'autoRotMode');
  gui.add(params, 'distanceMapMethod', {
    'linearDMap': linearDMap,
    'decayingSine': decayingSine,
    'straightSine': straightSine});
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




  points = sphericalPointDistribution(params.n);
  cntrlPt = {lat: 0, lon: 0, pos: createVector(0,0,0)};



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

  

  pointLight(red(params.colour), green(params.colour), blue(params.colour), 0, 0, 0);
  
  // locating the cntrlPoint
  let theta = map(noise(frameCount/params.noiseProgRate + xOff), 0, 1, 0, TWO_PI);
  let phi = map(noise(frameCount/params.noiseProgRate + yOff), 0, 1, 0, TWO_PI);
  let cntrlX = r*sin(phi)*cos(theta);
  let cntrlY = r*sin(phi)*sin(theta);
  let cntrlZ = r*cos(phi);
  let latlon = cartesianToSpherical(cntrlX, cntrlY, cntrlZ, r);

  // update the cntrlPt
  cntrlPt.lat = latlon.lat;
  cntrlPt.lon = latlon.lon;
  cntrlPt.pos.set(cntrlX,cntrlY,cntrlZ);

  // draw a spotlight in line but further out and on the opposite side to the cntrol point
  spotLightPos.set(-1.75*cntrlX, -1.75*cntrlY, -1.75*cntrlZ);
  pointLight(red(params.colour), green(params.colour), blue(params.colour), spotLightPos.x, spotLightPos.y, spotLightPos.z);
  pointLight(red(params.colour), green(params.colour), blue(params.colour), -spotLightPos.x, -spotLightPos.y, -spotLightPos.z);
 
  // show cntrlPt
  // noFill();
  // stroke(255);
  // push();
  // translate(cntrlPt.pos.x, cntrlPt.pos.y, cntrlPt.pos.z);
  // sphere(params.sep/4);
  // pop(); 

  // show growpoints
  for(let pt of points){
    push();
    translate(pt.loc.x, pt.loc.y, pt.loc.z);
    let d = sphericalDistance(cntrlPt.lat, cntrlPt.lon, pt.lat, pt.lon, r);
    let growPtR = params.distanceMapMethod(d);
    sphere(growPtR);
    pop();
  }

  
  
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


//https://easings.net/#easeInOutElastic
function straightSine(d){ 
  let t = map(d, 0, PI*r, 0, TWO_PI);
  return params.sineAmp * sin(params.sineN * t + params.sineOffset);
}