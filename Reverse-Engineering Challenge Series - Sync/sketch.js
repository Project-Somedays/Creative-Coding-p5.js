/*
Author: Project Somedays
Date: 2024-03-07
Title: Reverse Engineering Challenges - Sync

Anyone else experience old code as if a stranger had written it? I will choose to be kind to my past self, but I did have to start from scratch on this one.
Went through a musical phase where I was quite obsessed with polyrhythms. Something definitely tickled my math brain when they came back in sync.
I saw something crazy like this made in blender a few years back and thought I'd give 2D a go.
Also, a good chance to make some perfect loops by sampling from a 2D noise field =)
Got this from Daniel Shiffman's video: https://www.youtube.com/watch?v=c6K-wJQ77yQ
*/

const petalCount = 24;
const noiseZoom = 0.3;
const loopFrames = 1000;
let petalStackC;
let globA = 0;
let test;
let globRate;
let nVals = [];
let displayD, displayR;
let r;

let colour2 = [
  {'dark': '#041017', 'light':'#145277'},
  {'light': '#83d0cb', 'dark': "#0d1414"}];

let colour3 = [
  {'light' : '#26547c', 'dark' : '#071018'},
  {'light' : '#ef476f', 'dark' : '#2F0E16'},
  {'light' : '#ffd166', 'dark' : '#332914'}
]

let colour4 = [
  {'light' : '#26547c', 'dark' : '#010D11'},
  {'light' : '#ef476f', 'dark' : '#2F0E16'},
  {'light' : '#ffd166', 'dark' : '#332914'},
  {'light' : '#06d6a0', 'dark' : '#012A20'}
]

let colour5 = [
  {'light' : '#118ab2', 'dark' : '#010D11'},
  {'light' : '#ef476f', 'dark' : '#2F0E16'},
  {'light' : '#ffd166', 'dark' : '#332914'},
  {'light' : '#06d6a0', 'dark' : '#012A20'},
  {'light' : '#073b4c', 'dark' : '#000507'}
]

let colour6 = [
  {'light' : '#073b4c', 'dark' : '#000507'},
  {'light' : '#ef476f', 'dark' : '#2F0E16'},
  {'light' : '#f78c6b', 'dark' : '#180E0A'},
  {'light' : '#ffd166', 'dark' : '#332914'},
  {'light' : '#06d6a0', 'dark' : '#012A20'},
  {'light' : '#118ab2', 'dark' : '#010D11'}
]

let allColours = [colour2, colour3, colour4, colour5, colour6];
let colourIx = 0;
let petalStacks = [];
let selectedPalette;


function setup(){
  // createCanvas(windowWidth, windowHeight, P2D);
  createCanvas(1080, 1920, P2D);
  petalStackC = createVector(width/2, height/3);
  r = width/6;
  // stroke(255);
  noStroke();
  displayD = 0.3*width;
  displayR = 0.5*displayD;
  globRate = TAU/loopFrames; 
  restart();

}
  

function draw(){
background(0);

for(let stack of petalStacks){
  stack.update();
}
// interleave petal stacks
for(let i = petalCount - 1; i >= 0; i--){
  for(let j = 0; j < petalStacks.length; j++){
    petalStacks[j].petals[i].show();
  }
}

// draw the representation of the loop progress
stroke(100);
strokeWeight(5);
push();
translate(width/2, 0.8*height);
noFill();
circle(0, 0, displayD);
for(let i = 0; i < selectedPalette.length; i++){
  let x = displayR*cos((i+1)*globA);
  let y = displayR*sin((i+1)*globA);
  fill(selectedPalette[i].light);
  circle(x,y,width/20);
}
pop();
noStroke();
globA += globRate;

}

// called to restart the same loop but with more/fewer colours
function restart(){
  globA = 0;
  selectedPalette = allColours[colourIx];
  petalStacks = [];
  for(let i = 0; i < selectedPalette.length; i++){
    petalStacks.push(
      new PetalStack(
        hexToRgb(selectedPalette[i].light), 
        hexToRgb(selectedPalette[i].dark),
        i+1));
  }
}

// lerpColour doesn't like hex colours apparently
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return color(r, g, b);
}


function keyPressed(){
  if(keyCode === RIGHT_ARROW){
    colourIx = (colourIx + 1)%allColours.length;
    restart();
  }
  if(keyCode === LEFT_ARROW){
    colourIx --;
    if(colourIx < 0){
      colourIx = colourIx + allColours.length;
    }
    restart();
  }
}

function mousePressed(){
  if(keyCode === RIGHT_ARROW){
    colourIx = (colourIx + 1)%allColours.length;
    restart();
  }
}




