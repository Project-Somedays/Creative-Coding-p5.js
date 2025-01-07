/*
Author: Project Somedays
Date: 2025-01-03
Title: Genuary 2025 Day 3 - Exactly 42 lines of code

Could be a cool leaping off point for all sorts of wobbly functions...
But for now, onwards and upwards!
*/
const n = 75;
let r, sphereSize;
const noiseSpeed = 0.01;
function setup(){
  createCanvas(1080, 1080, WEBGL);
  noStroke();
  r = width/3;
  metalness(1);
  sphereSize = width/10;
  colorMode(HSB, 360, 100, 100);
  noCursor();
}
function draw(){
  background(0);
  fill((1* frameCount)%360, 100, 100);
  rotateY(frameCount * 0.01);
  directionalLight(255, 255, 255, createVector(-1, 0.5, 1));
  let sx = map(noise(frameCount * noiseSpeed, 1000), 0, 1, -r, r);
  let sz = map(noise(frameCount * noiseSpeed, 10000), 0, 1, -r, r);
  push(); 
  translate(sx, 0, sz);
  specularMaterial(255);
  sphere(sphereSize);
  pop();
  for(let x = 0; x < n; x++){
    for(let z = 0; z < n; z++){
      let cx = -1.5*r + x * 3*r/n;
      let cz = -1.5*r + z * 3*r/n;
      let h = getH(cx, cz, sx, sz);
      push();
      translate(cx, r/2 - h, cz);
      specularMaterial(255);
      box(0.9*3*r/n, h, 0.9*3*r/n);
      pop();
    }
  }
orbitControl();
}
const getH = (cx, cz, sphereX, sphereZ) => {
  let d = dist(cx,cz, sphereX, sphereZ);
  if( d > sphereSize*1.25) return map(d, 0, 3*r, height/100, height/5) * sin(d/50);
  return r - r*cos(asin(d/r));
}