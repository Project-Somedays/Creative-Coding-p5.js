/*
Author: Project Somedays
Date: 2024-07-27
Title: Reverse-Engineering Challenge Series: Bubble Field 2

Setting the size of the spheres by their spherical distance from the control point (also moving around on the surface of the sphere)

INSPIRATION/RESOURCES
  - https://x.com/TatsuyaBot/status/1813781259480703419
  - lil-gui library: https://cdn.jsdelivr.net/npm/lil-gui@0.19.2/dist/lil-gui.umd.min.js

TO-DO
  - lil-gui colour picker
  - multiple triggers
  - non-linear function for setting the size
  - dynamically set the size of the spheres based on how many there are
  - fix mapping function - I'm getting wrap around (but I don't hate it)
*/

let gui;
let params;
let xOff, yOff, zOff;
let cntrlPt;
let r;
let points = [];
let spotLightPos;

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
    upperDistLim: height/4
  }

  // set up gui
  gui.add(params, 'n', 100, 1000, 1)
     .onChange(value => points = getPointDistribution(value));
  gui.add(params, 'noiseZoom', 0.01, 300);
  gui.add(params, 'noiseProgRate', 30, 600);
  gui.add(params, 'globRotRate', 30, 1200);
  gui.add(params, 'upperDistLim', 0.01*params.n*params.sep,params.n*params.sep);
  gui.add(params, 'autoRotMode');

  points = getPointDistribution(params.n);
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

  

  pointLight(247, 98, 35, 0, 0, 0);
  
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
  pointLight(247, 98, 35, spotLightPos.x, spotLightPos.y, spotLightPos.z);
  pointLight(247, 98, 35, -spotLightPos.x, -spotLightPos.y, -spotLightPos.z);
 
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
    let growPtR = map(d, 0, 0.2*TWO_PI*r, r/10, r/1000);
    sphere(growPtR);
    pop();
  }

  
  
}


function getPointDistribution(n){
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