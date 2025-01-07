/*
Author: Project Somedays
Date: 2025-01-04
Title: Genuary 2025 Day 4 - Black on Black 
aka Genuary 2025 Day 6 - Make a landscape using only primitive shapes
aka Genuary 2025 Day 28 - Infinite scroll
aka WCCChallenge 2025 Week 1 - Generative Landscapes

I may have hit the limit of what can be accomplished with atmospheric lighting in p5.js.
Will revisit in Three.js someday soon 🙂
*/

let gems = [];
let n = 10;
let submersible;
let submersibles = [];
const subs = 2;
let rockColumn;
const pointLights = 1;
let diveRate = 0.5;

function preload(){
  submersible = loadModel("Submersible.obj", true);
}
function setup(){
//  createCanvas(windowWidth, windowHeight, WEBGL);
createCanvas(1080, 1080, WEBGL);
rockColumn = new RockColumn();

for(let i = 0; i < subs; i++){
  submersibles[i] = new Sub();
}
 
noCursor();
//  for(let i = 0; i < n; i++){
//   gems[i] = new Gemstone(random(-width/2, width/2),0,random(-width/2, width/2),random(width/50, width/20), random(height/24, height/4), int(random(5, 9)));
//   //new Gemstone(random(width), 0, random(width), random(width/25, width/10), random(height/20, height/10), 6); 
//  }
}

function draw(){
  background(0);

  // rotateY(frameCount * TWO_PI/2400);

  // lights

  // for(let i = 0; i < pointLights; i++){
  //   let a = frameCount * TWO_PI/600 + i * TWO_PI/pointLights;
  //   pointLight(255, 255, 255, 0.5*width*cos(a), 0.5*height*sin(a), 0.5*width*cos(a), 0.01);
  //   // directionalLight(255, 255, 255, cos(a), 0, sin(a));
  // }

  // camera
  for(let sub of submersibles){
    sub.update();
    pointLight(255, 255, 255, 0.5 * sub.r * cos(sub.a), sub.y, 0.5 *sub.r * sin(sub.a));
    sub.show();
  }


  fill(0);
  specularMaterial(255, 255, 255);
  // metalness(0.2);
  rockColumn.update();
  rockColumn.show();



  
  
  orbitControl();
}



// class Gemstone {
//   constructor(x, y, z, radius, gHeight, segments) {
//     this.x = x;
//     this.y = y;
//     this.z = z;
//     this.radius = radius;
//     this.gHeight = gHeight;
//     this.segments = segments;
//     this.rotationY = random(TWO_PI);
//     this.rotationX = random(-PI/6, PI/6);
//     this.topPoints = [];
//     this.bottomPoints = [];
//     this.calculatePoints();
//   }

//   calculatePoints() {
//     // Calculate points for top and bottom polygons
//     for (let i = 0; i < this.segments; i++) {
//       const angle = (TWO_PI / this.segments) * i;
//       const x = cos(angle) * this.radius;
//       const z = sin(angle) * this.radius;
      
//       // Top points (smaller radius for top pyramid)
//       this.topPoints.push({
//         x: x * 0.5,
//         y: -this.gHeight / 2,
//         z: z * 0.5
//       });
      
//       // Bottom points
//       this.bottomPoints.push({
//         x: x,
//         y: this.gHeight / 2,
//         z: z
//       });
//     }
//   }

//   show() {
//     push();
//     translate(this.x, this.y, this.z);
//     rotateY(this.rotationY);
//     rotateX(this.rotationX);
    
//     // Draw the facets with different colors
//     this.drawFacets();
    
//     // Increment rotation for animation
//     // this.rotation += 0.01;
//     pop();
//   }

//   drawFacets() {
//     fill(0);
//     metalness(0.9);
//     specularMaterial(255, 255, 255);
//     // Draw top pyramid
//     for (let i = 0; i < this.segments; i++) {
//       const next = (i + 1) % this.segments;
      
//       // Top facets
//       // fill(200, 220, 255, 200);
      
//       beginShape();
//       vertex(0, -this.gHeight, 0); // Top point
//       vertex(this.topPoints[i].x, this.topPoints[i].y, this.topPoints[i].z);
//       vertex(this.topPoints[next].x, this.topPoints[next].y, this.topPoints[next].z);
//       endShape(CLOSE);
      
//       // Middle facets
//       // fill(170, 190, 255, 200);
//       beginShape();
//       vertex(this.topPoints[i].x, this.topPoints[i].y, this.topPoints[i].z);
//       vertex(this.topPoints[next].x, this.topPoints[next].y, this.topPoints[next].z);
//       vertex(this.bottomPoints[next].x, this.bottomPoints[next].y, this.bottomPoints[next].z);
//       vertex(this.bottomPoints[i].x, this.bottomPoints[i].y, this.bottomPoints[i].z);
//       endShape(CLOSE);
//     }
    
//     // Draw bottom pyramid
//     for (let i = 0; i < this.segments; i++) {
//       const next = (i + 1) % this.segments;
//       // fill(140, 160, 255, 200);
//       beginShape();
//       vertex(0, this.gHeight * 1.5, 0); // Bottom point
//       vertex(this.bottomPoints[i].x, this.bottomPoints[i].y, this.bottomPoints[i].z);
//       vertex(this.bottomPoints[next].x, this.bottomPoints[next].y, this.bottomPoints[next].z);
//       endShape(CLOSE);
//     }
//   }
// }



// function setup() {
//   createCanvas(400, 400, WEBGL);
//   noStroke();
// }

// function draw() {
//   background(0);

//   push();
//   rotateY(frameCount * TWO_PI/120);
//   directionalLight(255, 255, 255, createVector(-1,0,0));
//   pop();
//   pointLight(255, 255, 255, 0, 0, 0);
//   // ambientLight(255, 255, 255);
//   specularMaterial(255);
//   metalness(0.5);
//   fill(0);

//   for(let i = 0; i < 12; i ++){
//     let a = i*TWO_PI/12;
//     push();
//     rotateY(a);
//     translate(width/4, 0, 0);
//   let y = 0.3 * height * sin(frameCount * TWO_PI/300 + i*TWO_PI/12);
//   let yOff = map(noise(frameCount * 0.01 + i * 1000 ), 0, 1, -height/12, height/12);
//   translate(0, y + yOff, 0)

//   rotateX(frameCount * TWO_PI/300);
//   rotateY(frameCount * TWO_PI/300);
//   rotateZ(frameCount * TWO_PI/300);

//   box(width/10);
//   pop();
//   }

//   orbitControl();
  
// }

