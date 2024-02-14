/*
Author: Project Somedays
Date: 2024-02-14
Title: Lava Lamp

Wanted to do something from scratch
Blobs move with convection
Where they overlap, an envelope is drawn using Chaikin Curve Cutting
Points inside the joint shape are removed and the points are connected in order according to their polar angle 
*/

const n = 25;
const smoothing = 5;
let testA;
let testB;

function setup() {
  createCanvas(1000, 1000);
  testA = new Lavablob(width/2, height/2, width/4);
  testB = new Lavablob(width/2, height/2, width/8);
  textAlign(CENTER, CENTER);
  noStroke();
}

function draw() {
  background(220);
  testB.c.set(mouseX,mouseY);
  testA.update();
  testB.update();

  if(p5.Vector.dist(testA.c, testB.c) >= 0.9*(testA.r + testB.r)){
    drawsmoothed(testA.pts, smoothing);
    drawsmoothed(testB.pts, smoothing);
  } else{
    // get the joint centre of the new shape
    let c = p5.Vector.lerp(testA.c, testB.c, 0.5);
    circle(c.x, c.y, 20);

    // Filter out points that are overlapping
    outsidePts = [];
    let collectivePts = [...testA.getSmoothedPoints(), ...testB.getSmoothedPoints()].filter( p => !(
        (p5.Vector.dist(p, testA.c) < 0.99*testA.r) ||
        (p5.Vector.dist(p, testB.c) < 0.99*testB.r))
        );
    text(`collectivePts.length = ${collectivePts.length}`, width/2, height/2);
    
    // sort by polar angle from centre
    collectivePts.sort((a,b) => {
      let a1 = atan2(a.y - c.y, a.x - c.x);
      let a2 = atan2(b.y - c.y, b.x - c.x);
      return a1 - a2;
    });
    
    drawsmoothed(collectivePts, smoothing);
  }
  
}

function sortByPolarAngle(pts, c){

}

class Lavablob{
  constructor(x,y, r){
    this.r = r;
    this.c = createVector(x,y);
    this.pts = [];
    this.smoothedPts = [];
  }

  getSmoothedPoints(){
    return chaikin(this.pts, smoothing);
  }
  
  update(){
    this.pts = [];
    for(let i = 0; i < n; i++){
      let a = i * TWO_PI/n;
      this.pts.push(createVector(this.c.x + this.r*cos(a), this.c.y + this.r*sin(a)));
    }
  }

  // show(){
  //   push();
  //   translate(this.c.x, this.c.y);
  //   beginShape();
  //   for(let p of this.pts){
  //     vertex(p.x, p.y);
  //   }
  //   endShape(CLOSE);
  //   pop();
  // }
  
}


function drawsmoothed(orderedPts){
  beginShape();
  for(let i = 0; i < orderedPts.length; i++){
    vertex(orderedPts[i].x, orderedPts[i].y);
    // text(i, orderedPts[i].x, orderedPts[i].y);
  }
  endShape(CLOSE);


  
}

// Thanks ChatGPT
function chaikin(points, iterations) {
  if (iterations === 0) {
    return points;
  } else {
    let newPoints = [];
    for (let i = 0; i < points.length; i++) {
      // Calculate the midpoint between two consecutive points
      let p1 = points[i];
      let p2 = points[(i + 1)%points.length];
      let q1 = p5.Vector.lerp(p1, p2, 0.25);
      let q2 = p5.Vector.lerp(p1, p2, 0.75);
      
      // Calculate new points based on the Chaikin algorithm
      let r1 = p5.Vector.lerp(p1, q1, 0.5);
      let r2 = p5.Vector.lerp(q1, q2, 0.5);
      let r3 = p5.Vector.lerp(q2, p2, 0.5);
      
      newPoints.push(r1);
      newPoints.push(r2);
      newPoints.push(r3);
    }
    return chaikin(newPoints, iterations - 1);
  }
}
