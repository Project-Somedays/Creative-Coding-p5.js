/*
Author: Project Somedays
Date: 2024-10-17
Title: Reverse-Engineering Challenge Series - The Weave

More riffing on the awesome one-tweet code by @SnowEsamosc  https://x.com/i/bookmarks?post_id=1843992881041916168

Colour palette from coolors.co: https://coolors.co/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
*/

let speaker;

const palette = "#001219, #005f73, #0a9396, #94d2bd, #e9d8a6, #ee9b00, #ca6702, #bb3e03, #ae2012, #9b2226".split(", ");

let cam;

let gui, params;
let rowSpacing, colSpacing;

function setup() {
  createCanvas(1080, 1080, WEBGL);
  noStroke();

  gui = new lil.GUI();
  params = {
    rows: 11,
    cols: 100,
    noiseZoom: 0.1,
    rMax : width/250,
    framesPerCycle: 300,
    sphereSize: width/100,
    wormsPerRow: 3
  }

  rowSpacing = height/params.rows;
  colSpacing = width/params.cols;

  gui.add(params, 'rows', 1,100, 1).onChange(value => colSpacing = width/value);
  gui.add(params, 'cols', 1, 100, 1).onChange(value => rowSpacing = width/value);
  gui.add(params, 'noiseZoom', 0.001, 1.0);
  gui.add(params, 'rMax', 0,width/10);
  gui.add(params, 'framesPerCycle', 10, 120, 1);
  gui.add(params, 'sphereSize', width/500, width/20); 
  gui.add(params, 'wormsPerRow', 1, 10, 1); 
}



function draw() {
  background(0);
  
  // Lighting
  directionalLight(255, 255, 255, 1, -1, 0);
  directionalLight(255, 255, 255, 0, 0, -1);
  
 for(let row = 0; row < params.rows; row++){
    fill(palette[row%palette.length]);
  for(let col = 0; col < params.cols; col++){
    let rNoiseVal = noise(row/params.noiseZoom,col/params.noiseZoom);
    let r = map(rNoiseVal, 0, 1, 0, params.rMax);
    let aNoiseVal = noise((row+1000)/params.noiseZoom,(col+1000)/params.noiseZoom);
    let theta = map(aNoiseVal, 0, 1, 0, TWO_PI);
    push();
    translate(-width/2 + col*colSpacing + r*cos(theta), -height/2 + row*rowSpacing + r*sin(theta), 0);
    let offset = TWO_PI * (row/params.rows + col/params.cols);
    let angle = frameCount*TWO_PI/params.framesPerCycle;
    let sphereRadius = max(0, sin(offset + params.wormsPerRow * angle)) * params.sphereSize;
    sphere(sphereRadius);
    pop();
  }
 }

  orbitControl();
}



