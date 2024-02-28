/*
Author: Project Somedays
Date: 2023-12-10
Classic visualisation of 2D perlin noise, but with hexagonal columns instead
Opportunities:
  - Lerping between colour bands
  - Perlin noise movement throughout the 2D perlin noise space
  - Change of perspective
*/
// let colours = ['#d9ed92', '#b5e48c', '#99d98c', '#76c893', '#52b69a', '#34a0a4', '#168aad', '#1a759f', '#1e6091', '#184e77'].reverse();
// let colours = ['#2d00f7', '#6a00f4', '#8900f2', '#a100f2', '#b100e8', '#bc00dd', '#d100d1','#db00b6', '#e500a4', '#f20089'];
let colours = ["#ff0000","#ff8700","#ffd300","#deff0a","#a1ff0a","#0aff99","#0aefff","#147df5","#580aff","#be0aff"];
let nx = 20;
let ny; // because of how hexagons tesselate, there needs to be more rows than columns
let r, halfSide, R;
let zoomFactor = 400;
let xShift, yShift; // for moving the grid over the 2D perlin noise landscape
let tSpeed, t; // for changing the evolution rate of the landscape
let grid = [];
let step = 5;

function setup() {
  // createCanvas(windowHeight, windowHeight, P2D);
  // createCanvas(1080, 1080, P2D);
  createCanvas(1080, 1920, P2D);
  pixelDensity(1);
  frameRate(30);
  ny = nx*(1.2*1920/1080); // this could be more exact, but I can't be bothered to do the maths
  r = width/(2*(nx-1.5)); // same as above. Just ensures it fits on the screen nicely
  R = r/cos(PI/6);
  halfSide = R*sin(PI/6);
  xShift = 0;
  yShift = 0;
  t = 0;
  tSpeed = 0.03;//0.01;
  initGrid();
  pixelDensity(1);
}

function draw() {
  background(0);
  push();
  translate(0,-100);
  updateShift();
  updateAndShowGrid();
  pop();
  t += tSpeed;
  
}

class Hex{
  constructor(x,y){
    this.p = createVector(x,y);
    this.corners = []; // storing the corners makes it easier to draw the pillars in 2D
    this.nVal = 0.0;
    this.h = 0.0;
    this.col = color(255);
    for(let i = 0; i < 6; i++){
      let a = i*TWO_PI/6 + PI/6; // orientates it so that parallel sides are vertical
      this.corners.push(createVector(this.p.x + R*cos(a), this.p.y + R*sin(a)));
    }
  }
  
  update(){
    this.nVal = noise((this.p.x+xShift)/zoomFactor, (this.p.y + yShift)/zoomFactor,t);
    this.h = map(this.nVal, 0, 1, -height/8, height/8); // how much to move up by
    let c = map(this.nVal, 0, 1, 0, colours.length);
    let c1 = floor(c);
    let c2 = ceil(c);
    this.col = lerpColor(color(colours[c1]), color(colours[c2]), c - floor(c)); // c - floor(c) gives just the decimal value between colours
  }
  
  show(){
    fill(this.col);
    beginShape();
    for(let i = 0; i < 6; i++){
      vertex(this.corners[i].x, this.corners[i].y - this.h);
    endShape(CLOSE);
    }
    
  }
}

function initGrid(){
  for(let row = 0; row < ny; row++){
    let hexRow = [];
    for(let col = 0; col < nx; col++){
      let x;
      let y;
      // rows are offset in the x direction in this orientation
      if (row%2 == 0) {
        x = r*(1+ 2*col);
        y = row*(R + halfSide);
      } else {
        x = col*2*r;
        y = row*(halfSide + R);
      }
      hexRow.push(new Hex(x,y));
    }
    grid.push(hexRow);
  }
}


function updateAndShowGrid(){
  for(let row = 0; row < ny; row++){
    for(let col = 0; col < nx; col++){
      grid[row][col].update();
      grid[row][col].show();
    }
  }
}


function updateShift() {
  if (keyIsDown(83)) {
    // Hold down 's', add 1 to yShift
    yShift += step;
  }
  if (keyIsDown(87)) {
    // Hold down 'w', subtract 1 from yShift
    yShift -= step;
  }
  if (keyIsDown(68)) {
    // Hold down 'd', add 1 to xShift
    xShift += step;
  }
  if (keyIsDown(65)) {
    // Hold down 'a', subtract 1 from xShift
    xShift -= step;
  }
}

