let stair;
let stepWidth, stepSize;

function setup() {
  createCanvas(400, 400, WEBGL);
  stepWidth = width/3;
  stepSize = width/8;
  stair = new Stair(createVector(0,0,0), 10, 0);
}

function draw() {
  background(220);

  stair.show();

  orbitControl();
}

class Stair{
  constructor(start, steps, dir){
    this.start = start.copy();
    this.steps = steps;
    this.dir = dir;
  }

  show(){
    push();
    rotateY(this.dir + frameCount*TWO_PI/1200);
    translate(this.start.x, this.start.y, this.start.z);
    for(let i = 0; i < this.steps; i++){
      push();
        translate(i * stepSize, -stepSize * (i + 0.5), 0);
        box(stepSize*2, stepSize, stepWidth);
      pop();
    }
    pop();
  }
}
