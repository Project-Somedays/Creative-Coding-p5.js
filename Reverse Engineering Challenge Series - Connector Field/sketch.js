/*
Author: Project Somedays
Date: 2024-09-11
Title: Reverse Engineering Challenge Series - Connector Grid 

Inspired by https://x.com/jcponcemath/status/1726912084070506671

TODO:
- Fix res
*/
let grid = [];
let gui, params;
let res;
let cam;
let xGlobalOff;
let zGlobalOff;
let yGlobalOff;
let palette = "#03045e, #023e8a, #0077b6, #0096c7, #00b4d8, #48cae4, #90e0ef, #ade8f4, #caf0f8".split(", ");

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  xGlobalOff = random(1000);
  yGlobalOff = random(1000);
  zGlobalOff = random(1000);

  gui = new lil.GUI();
  params = {
    colour: "#c3f0fa",
    columns: 10,
    noiseZoom: 1 / 300,
    noiseProgressRate: 0.005,
    ptSize: width / 20 / 8,
    xzPert: width / 20,
    yPert: width / 4,
  };

  cam = createCamera();

  gui.addColor(params, "colour");
  gui.add(params, "columns", 5, 100, 1).onChange((value) => {
    grid = generateGrid();
    res = width / value;
  });
  gui.add(params, "noiseZoom", 1 / 500, 1 / 100);
  gui.add(params, "noiseProgressRate", 0.0005, 0.08);
  gui.add(params, "ptSize", width / 100, width / 50);
  gui.add(params, "xzPert", width / 50, width / 5);
  gui.add(params, "yPert", width / 20, width / 2);

  res = width / params.columns;
  grid = generateGrid();

  stroke(0);
  strokeWeight(100);

  // cam.setPosition(0, width / 4, 0);
  // cam.lookAt(0, 0, 0);
}

function draw() {
  background(255);
  strokeWeight(width / 100);

  // normalMaterial();
  for (let x = 0; x < params.columns; x++) {
    for (let z = 0; z < params.columns; z++) {
      grid[x][z].update();
      // grid[x][z].show();
    }
  }

  stroke(0);
  for (let x = 0; x < params.columns - 1; x++) {
    for (let z = 0; z < params.columns - 1; z++) {
      fill(grid[x][z].colour);
      beginShape();
      vertex(grid[x][z].tempPos.x, grid[x][z].tempPos.y, grid[x][z].tempPos.z);
      vertex(grid[x][z + 1].tempPos.x, grid[x][z + 1].tempPos.y, grid[x][z + 1].tempPos.z);
      vertex(grid[x + 1][z + 1].tempPos.x, grid[x + 1][z + 1].tempPos.y, grid[x + 1][z + 1].tempPos.z);
      vertex(grid[x + 1][z].tempPos.x, grid[x + 1][z].tempPos.y, grid[x + 1][z].tempPos.z);
      endShape(CLOSE);
    }
  }

  // stroke(255, 0, 0);

  // line(grid[0][0].tempPos.x, grid[0][0].tempPos.y, grid[0][0].tempPos.z, grid[0][1].tempPos.x, grid[0][1].tempPos.y, grid[0][1].tempPos.z);
  // line(grid[1][0].tempPos.x, grid[1][0].tempPos.y, grid[1][0].tempPos.z, grid[0][1].tempPos.x, grid[0][1].tempPos.y, grid[0][1].tempPos.z);

  orbitControl();
}

function generateGrid() {
  let finalGrid = [];
  for (let x = 0; x < params.columns; x++) {
    let row = [];
    for (let z = 0; z < params.columns; z++) {
      // row.push(createVector(-width / 2 + x * res, 0, -width / 2 + z * res));
      row.push(new Pt(width / 2 - x * res, width / 2 - z * res, random(palette)));
    }
    finalGrid.push(row);
  }
  return finalGrid;
}

const noiseVal = (x, z, globalOff, minVal, maxVal) =>
  map(noise(x * params.noiseZoom, z * params.noiseZoom, frameCount * params.noiseProgressRate + globalOff), 0, 1, minVal, maxVal);

class Pt {
  constructor(x, z, colour) {
    this.p = createVector(x, 0, z);
    this.tempPos = createVector();
    this.colour = colour;
  }

  update() {
    let xPos = this.p.x + noiseVal(this.p.x, this.p.z, xGlobalOff, -params.xzPert, params.xzPert);
    let yPos = this.p.y + noiseVal(this.p.x, this.p.z, yGlobalOff, -params.yPert, params.yPert);
    let zPos = this.p.z + noiseVal(this.p.x, this.p.z, zGlobalOff, -params.xzPert, params.xzPert);
    this.tempPos.set(xPos, yPos, zPos);
  }

  show() {
    push();
    translate(this.tempPos.x, this.tempPos.y, this.tempPos.z);
    sphere(params.ptSize);
    pop();
  }
}
