/*
Author: Project Somedays
Date: 2024-05-07
Title: Genuary 2024 Day 17 (Slightly breaking) Islamic Art

Playing around with some Islamic Star Patterns by The Coding Train and... I don't hate it?
I'm going to say that this is a representation of cultural misappropriation?
*/



// Daniel Shiffman
// http://codingtra.in
// Islamic Star Patterns
// Video Part 1: https://youtu.be/sJ6pMLp_IaI
// Video Part 2: [coming soon]
// Based on: http://www.cgl.uwaterloo.ca/csk/projects/starpatterns/

// Repo with more tiling patterns and features
// https://github.com/CodingTrain/StarPatterns

// var poly;
var polys = [];

// var angle = 75;
// var delta = 10;
let noiseProgRate = 50;
let noiseZoom = 500;

function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(1920, 1080);
  //angleMode(DEGREES);
  background(51);
  strokeWeight(2);

  var inc = 100;
  for (var x = 0; x < width; x += inc) {
    for (var y = 0; y < height; y += inc) {
      var poly = new Polygon(x,y);
      poly.addVertex(x, y);
      poly.addVertex(x + inc, y);
      poly.addVertex(x + inc, y + inc);
      poly.addVertex(x, y + inc);
      poly.close();
      polys.push(poly);
    }
  }
}

function draw() {
  background(51);
  // angle = map(noise(frameCount/noiseProgRate),0,1,0,90);
  // delta = map(noise(frameCount/noiseProgRate),0,1,0,50);
  //console.log(angle, delta);
  for (var i = 0; i < polys.length; i++) {
    polys[i].update();
    polys[i].hankin();
    polys[i].show();
  }
}
