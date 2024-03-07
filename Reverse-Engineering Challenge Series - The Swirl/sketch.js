/*
Author: Project Somedays
Date: 2024-03-07
Title: Reverse Engineering Challenges - Sync

Anyone else experience old code as if a stranger had written it? I will choose to be kind to my past self, but I did have to start from scratch on this one.
Went through a musical phase where I was quite obsessed with polyrhythms. Something definitely tickled my math brain when they came back in sync.
I saw something crazy like this made in blender a few years back and thought I'd give 2D a go.
*/

const petalCount = 24;
let petals = [];
let globA = 0;
let test;
let globRate;


function setup(){
  createCanvas(1080, 1920, P2D);
  noStroke();
  globRate = TAU/100;

  colorMode(HSB, 360, 100, 100);
  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal(
      1 + i * 0.5,
      (i * QUARTER_PI) / (petalCount / 4),
      color(320, 55, 93 - (i * 92) / petalCount))
    )
  }

}

function draw(){
background(0);
for(let p of petals){
  p.show(0.5*sin(globA) + 1);
}
globA += globRate;
}
