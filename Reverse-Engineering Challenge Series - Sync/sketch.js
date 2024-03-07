/*
Author: Project Somedays
Date: 2024-03-07
Title: Reverse Engineering Challenges - Sync

Anyone else experience old code as if a stranger had written it? I will choose to be kind to my past self, but I did have to start from scratch on this one.
Went through a musical phase where I was quite obsessed with polyrhythms. Something definitely tickled my math brain when they came back in sync.
I saw something crazy like this made in blender a few years back and thought I'd give 2D a go.
*/

const petalCount = 24;
let petalsA = [];
let petalsB = [];
let globA = 0;
let test;
let globRate;
let nVals = [];
let r;
let colours = ["#000814", "#001d3d", "#003566", "#ffc300", "#ffd60a"];
let noiseZoom = 0.1;



function setup(){
  createCanvas(windowWidth, windowHeight, P2D);
  // colours = [color(255, 0 ,0), color(0, 255, 0)];
  r = width/6;
  noStroke();
  globRate = TAU/500;
  for(let i = 0; i < colours.length; i ++){
    nVals.push({rate: i + 1, colour: colours[i]});
  }

  colorMode(HSB, 360, 100, 100);
  for (let i = 0; i < petalCount; i++) {
    petalsA.push(new Petal(
      1 + i * 0.5,
      (i * QUARTER_PI) / (petalCount / 4),
      color(193, 90, 93 - (i * 92) / petalCount))
    )
    petalsB.push(new Petal(
      1 + i * 0.5,
      TWO_PI/3 + (i * QUARTER_PI) / (petalCount / 4),
      color(320, 55, 93 - (i * 92) / petalCount))
    )
  }
  

}

function draw(){
background(0);
for(let i = petalsA.length - 1; i > 0; i--){
  let noiseXA = noiseZoom*cos(globA - petalsA[i].offset);
  let noiseYA = noiseZoom*sin(globA - petalsA[i].offset);
  let noiseXB = noiseZoom*cos(2*globA - petalsB[i].offset);
  let noiseYB = noiseZoom*sin(2*globA - petalsB[i].offset);
  let noiseValA = noise(noiseXA, noiseYA);
  let noiseValB = noise(noiseXB, noiseYB);
  let currentA = map(noiseValA, 0, 1, -2*PI/3, 2*PI/3);
  let currentB = map(noiseValB, 0, 1, -2*PI/3, 2*PI/3);
  petalsA[i].show(currentA);
  petalsB[i].show(currentB + TWO_PI/3);
}
globA += globRate;

// push();
// translate(width/2, 3*height/4);
// noFill();
// stroke(255);
// strokeWeight(5);
// circle(0, 0, r);
// for(let n of nVals){
//   let x = 0.5*r*cos(n.rate*globA);
//   let y = 0.5*r*sin(n.rate*globA);
//   fill(n.colour);
//   circle(x,y,r/8);
// }
// pop();
}


// function dra
