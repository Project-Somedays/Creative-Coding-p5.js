/*
Author: Project Somedays
Date: 2024-03-05
Title: #WCCChallenge "Firefly"

Using a technique I've used a few times now to form the cast of firefly out of fireflies.
Fireflies move with perlin noise within a bounding box
To make the movement more naturalistic as they converge, rather than setting their position directly, we just make the bounding box smaller
*/
let globOffset = 0.00005;
let sampleRate = 1000;
let sampleCount = 1000;
let swarm;
let neighbourhood;
const swarmProgressRate = 0.01;

function setup() {
  createCanvas(1080, 1080, P2D);
  neighbourhood = 0.25*max(width, height);
  swarm = new Swarm(sampleCount);
  console.log(swarm.swarm.length);
  noStroke();
  frameRate(30);
}

function draw() {
  background(0);
  swarm.update();
  swarm.show();

  globOffset += swarmProgressRate;
}
