/*
Author: Project Somedays
Date: 2025-01-13
Title: Genuary 2025 Day 13 - Triangles and nothing else
*/

// Example usage:
let test;
function setup(){
  createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
  test = new Slug(width/2, width/10, 30, 30);
  // noStroke();
  
}

function draw() {
  background(0);
 
  directionalLight(255,255, 255, p5.Vector.sub(createVector(0,0,0), createVector(width/2, width/2, width/2)));
  fill(255,0,0);
  // normalMaterial();
  stroke(0);
  test.show();
  orbitControl();
}

