/*
Author: Project Somedays
Date: 2024-03-13
Title: Lepidoptera

Building off an old processing sketch/Casey Reas' overlapping circle technique
Movers move around, bouncing off a wedge of a hexagon, drawing a line between their centres wherever they overlap.
Replicate for the other sectors of the hexagon.

I LOVE it when really simple rules produce VERY pretty results
*/
const r = 20;
let walls = [];
let movers = [];
let moverCount = 1;

function setup() {
  createCanvas(1080, 1920);
  noFill();
  stroke(255);
  strokeWeight(2);
  walls.push(new Wall(0, 0, 0.5*width*cos(-PI/6), 0.5*width*sin(-PI/6), 0));
  walls.push(new Wall(0, 0, 0.5*width*cos(PI/6), 0.5*width*sin(PI/6), 1));
  walls.push(new Wall(0.5*width*cos(PI/6), 0.5*width*sin(PI/6), 0.5*width*cos(-PI/6), 0.5*width*sin(- PI/6), 2));
  
  
  for(let i = 0; i < moverCount; i++){
    let radius = random(width/8, 0.8*width/2);
    let theta = random(-PI/7, PI/7);
    movers.push(new Mover(radius*cos(theta), radius*sin(theta)));
  }
}

function draw() {
  background(0);
  push();
  
  translate(width/2, height/2);
  for(let w of walls){
    line(w.start.x, w.start.y, w.end.x, w.end.y);
  }

  // wall mover interactions
  
  for(let m of movers){
    for(let w of walls){
      bounce(w, m);
    }
    m.update();
    m.show();
  }
  pop();
  
}

function isHittingWall(wall, mover){
  let x1 = mover.p.x;
  let y1 = mover.p.y;
  let x2 = mover.p.x + mover.v.x; // the next position
  let y2 = mover.p.y + mover.p.y; // the next position

  let x3 = wall.start.x;
  let y3 = wall.start.y;
  let x4 = wall.end.x;
  let y4 = wall.end.y
  let denominator = (x1 - x2)*(y3 - y4) - (y1-y2)*(x3 - x4);
  if(denominator === 0){
    return false
  }
  let t = ((x1-x3)*(y3-y4) - (y1 - y3)*(x3-x4))/denominator;
  let u = ((x2 - x1)*(y1-y3) - (y2 - y1)*(x1-x3))/denominator;
  let intersectionPt = t >= 0 && t <= 1 && u >= 0 && u <= 1 ? createVector(x1 + t*(x2 - x1), y1 + t*(y2-y1)) : null;
  mover.intersect(intersectionPt, wall.i);
  if(intersectionPt){
    console.log("wall hit!");
    return true;
  } 
  
  return false;
  
}

function bounce(wall, mover){
  if(!isHittingWall(wall, mover)){
  return;
  }
  let g = p5.Vector.sub(mover.p, mover.intersectionPt);
  let dy = -sin(wall.a)*g.x + cos(wall.a)*g.y; // rotate around pt to make coordinate system easier
  let vx = cos(wall.a)*mover.v.x + sin(wall.a)*mover.v.y; 
  let vy = -sin(wall.a)*mover.v.x + cos(wall.a)*mover.v.y;
  if (abs(dy) < r) {
    mover.setV(cos(wall.a)*vx + sin(wall.a)*vy, sin(wall.a)*vx - cos(wall.a)*vy);
  }
}

class Wall{
  constructor(sx, sy, ex, ey, i){
    this.start = createVector(sx,sy);
    this.end = createVector(ex, ey);
    this.a = p5.Vector.sub(this.end, this.start).heading();
    this.i = i;
  }

}

class Mover{
  constructor(x,y){
    this.p = createVector(x,y);
    this.v = p5.Vector.random2D();
    this.intersections = new Array(3).fill(null);
  }

  intersect(p, i){
    this.intersections[i] = p;
  }
  update(){
    this.p.add(this.v);
  }

  setV(x,y){
    this.v.set(x,y);
  }

  show(){
    stroke(255);
    circle(this.p.x, this.p.y, 2*r);
  }
}
