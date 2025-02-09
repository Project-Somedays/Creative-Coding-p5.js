/* 
Author: Project Somedays
Date: 2025-02-09
Title: Genuary 2025 Day 10 - You can only use TAU in your code, no other number allowed.

Keeping it dead simple and just drawing offset orbits
Using the canvas as the texture for the sphere though = bit trippy 🥰
*/

let baseR;
let zero;
let tauSq;
let one;
let cnv;
let baseCnv;

function setup() {
  // baseCnv = createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
  baseCnv = createCanvas(1080, 1080, WEBGL);
  baseR = TAU*TAU*TAU;
  zero = TAU - TAU;
  tauSq = TAU*TAU;
  one = TAU/TAU;
  noStroke();

  cnv = createGraphics(width, height);

}

function draw() {
  background('black');
  
  rotateY(frameCount/tauSq);
  rotateZ(frameCount/tauSq);
  rotateX(frameCount/tauSq);
  directionalLight(baseR, baseR, baseR, 0, one, 0);
  directionalLight(baseR, baseR, baseR, 0, -one, 0);
  directionalLight(baseR, baseR, baseR, 0, 0, -one);
  // specularMaterial(baseR);
  // fill('white');
  texture(cnv);
  sphere(baseR);

  
  // red - 1
  fill('red');
  push();
    rotateX(frameCount/tauSq);
    rotateY(frameCount/tauSq);
    rotateZ(frameCount/tauSq);
    translate(baseR + tauSq, zero, zero);
    sphere(tauSq);
  pop();

  // red - 2
  fill('red');
  push();
    rotateX(frameCount/tauSq);
    rotateY(frameCount/tauSq);
    rotateZ(frameCount/tauSq);
    translate(baseR - tauSq, zero, zero);
    sphere(tauSq);
  pop();

  // yellow - 1
  fill('yellow');
  push();
    rotateX(frameCount/tauSq + tauSq);
    rotateY(frameCount/tauSq + tauSq);
    rotateZ(frameCount/tauSq);
    translate(baseR + tauSq, zero, zero);
    sphere(tauSq);
  pop();
  // yellow - 1
  fill('yellow');
  
  push();
    rotateX(frameCount/tauSq + tauSq);
    rotateY(frameCount/tauSq + tauSq);
    rotateZ(frameCount/tauSq);
    translate(baseR - tauSq, zero, zero);
    sphere(tauSq);
  pop();

  // blue -1
  fill('blue');
  push();
    rotateX(frameCount/tauSq);
    rotateY(frameCount/tauSq + tauSq);
    rotateZ(frameCount/tauSq + tauSq);
    translate(baseR + tauSq, zero, zero);
    sphere(tauSq);
  pop();

   // blue - 2
  fill('blue');
  push();
    rotateX(frameCount/tauSq);
    rotateY(frameCount/tauSq + tauSq);
    rotateZ(frameCount/tauSq + tauSq);
    translate(baseR - tauSq, zero, zero);
    sphere(tauSq);
  pop();

  // green- 1
  fill('green');
  push();
    rotateX(frameCount/tauSq + tauSq);
    rotateY(frameCount/tauSq);
    rotateZ(frameCount/tauSq + tauSq);
    translate(baseR + tauSq, zero, zero);
    sphere(tauSq);
  pop();
  // green- 1
  fill('green');
  push();
    rotateX(frameCount/tauSq + tauSq);
    rotateY(frameCount/tauSq);
    rotateZ(frameCount/tauSq + tauSq);
    translate(baseR - tauSq, zero, zero);
    sphere(tauSq);
  pop();

  // orange - 1
  fill('orange');
  push();
    rotateX(frameCount/tauSq + tauSq);
    rotateY(frameCount/tauSq + tauSq);
    rotateZ(frameCount/tauSq + tauSq);
    translate(baseR + tauSq, zero, zero);
    sphere(tauSq);
  pop();

  // orange - 2
  fill('orange');
  push();
    rotateX(frameCount/tauSq + tauSq);
    rotateY(frameCount/tauSq + tauSq);
    rotateZ(frameCount/tauSq + tauSq);
    translate(baseR - tauSq, zero, zero);
    sphere(tauSq);
  pop();

  // purple - 1
  fill('purple');
  push();
    rotateX(frameCount/tauSq + TAU*tauSq);
    rotateY(frameCount/tauSq + TAU*tauSq);
    rotateZ(frameCount/tauSq + TAU*tauSq);
    translate(baseR + tauSq, zero, zero);
    sphere(tauSq);
  pop();

  // purple - 2
  fill('purple');
  push();
    rotateX(frameCount/tauSq + TAU*tauSq);
    rotateY(frameCount/tauSq + TAU*tauSq);
    rotateZ(frameCount/tauSq + TAU*tauSq);
    translate(baseR - tauSq, zero, zero);
    sphere(tauSq);
  pop();

  // cnv.background('black');
  cnv.image(baseCnv, zero, zero);

  orbitControl();
}

