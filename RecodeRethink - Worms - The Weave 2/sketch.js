/*
Author: Project Somedays
Date: 2024-10-17
Title: Reverse-Engineering Challenge Series - The Weave

More riffing on the awesome one-tweet code by @SnowEsamosc  https://x.com/i/bookmarks?post_id=1843992881041916168

Colour palette from coolors.co: https://coolors.co/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
*/

let speaker;

const palette = "#001219, #005f73, #0a9396, #94d2bd, #e9d8a6, #ee9b00, #ca6702, #bb3e03, #ae2012, #9b2226".split(", ");

// let cam;
let zHeight = 0;

let gui, params;
let rowSpacing, colSpacing;
let grid;

function setup() {
  createCanvas(1080, 1080, WEBGL);
  noStroke();
  imageMode(CENTER);


  gui = new lil.GUI();
  params = {
    rows: 15,
    cols: 75,
    noiseZoom: 0.1,
    rMax : 15,
    framesPerCycle: 300,
    sphereSize: 50,
    wormsPerRow: 3
  }


  gui.add(params, 'rows', 1,100, 1).onChange(value => {
    rowSpacing = height/value;
    grid = generateArray();
  });
  gui.add(params, 'cols', 1, 100, 1).onChange(value => {
    colSpacing = width/value;
    grid = generateArray();
  });
  gui.add(params, 'noiseZoom', 0.001, 1.0);
  gui.add(params, 'rMax', 0,width/10).onChange(value => grid = generateArray());
  gui.add(params, 'framesPerCycle', 10, 120, 1);
  gui.add(params, 'sphereSize', width/500, width/20); 
  gui.add(params, 'wormsPerRow', 1, 10, 1); 

  rowSpacing = height/params.rows;
  colSpacing = width/params.cols;

  grid = generateArray();
  // cam = createCamera();
  // cam.setPosition(0,0,width/5 + zHeight);
  // cam.lookAt(0,0,0);

}



function draw() {
  background(0);
  
  // zHeight = zHeight + (frameCount < 250 ? 3 : 0);
  // cam.setPosition(0,0, width/5 + zHeight);
  
  // Lighting
  directionalLight(255, 255, 255, 1, -1, 0);
  directionalLight(255, 255, 255, 0, 0, -1);
  
 for(let row = 0; row < params.rows; row++){
    fill(palette[row%palette.length]);
  for(let col = 0; col < params.cols; col++){
    let p = grid[row][col];
    // let offset = params.wormsPerRow * TWO_PI * (row/params.rows + col/params.cols);
    let offset = params.wormsPerRow * TWO_PI * (col/params.cols);
    let angle = frameCount*TWO_PI/params.framesPerCycle;
    let sphereRadius = max(0, sin(offset + angle)) * params.sphereSize;
    for(let i = 0; i < 2; i++){
      push();
      rotateZ(-i*HALF_PI);
      translate(p.x, p.y, p.z + i * 5);
      sphere(sphereRadius);
      pop();
    }
    
  }
 }

  orbitControl();
}

function generateArray(){
  let grid = [];

  for(let row = 0; row < params.rows; row++){
    let newRow = [];
    for(let col = 0; col < params.cols; col++){
      let rNoiseVal = noise(row/params.noiseZoom,col/params.noiseZoom);
      let r = map(rNoiseVal, 0, 1, 0, params.rMax);
      let aNoiseVal = noise((row+1000)/params.noiseZoom,(col+1000)/params.noiseZoom);
      let theta = map(aNoiseVal, 0, 1, 0, TWO_PI);
      newRow.push(createVector(-width/2 + col*colSpacing + r*cos(theta), -height/2 + row*rowSpacing + r*sin(theta), 0));
    }
    grid.push(newRow);
 }
 return grid;
}



