/*
Author: Project Somedays
Date: 2024-06-22
Title: WCCChallenge "Based on a song"

Made for Sableraph's weekly creative coding challenges, reviewed weekly on https://www.twitch.tv/sableraph
See other submissions here: https://openprocessing.org/curation/78544
Join The Birb's Nest Discord community! https://discord.gg/S8c7qcjw2b

Took it fairly literally - is sound visualisation with rotational symmetry 😊
Different frequency bands are represented by the different colours/movers.
Movers are driven upwards against gravity with thrust as a function of amplitude.

Copyright-free royalty-free music by SergePavkinMusic on Pixabay: "Reflected Light" https://pixabay.com/music/beautiful-plays-reflected-light-147979/
*/

let cnv; 
let music;
let fft;
let gravityStrength = 0.25;
let maxKick = 0.75;
const lowerThreshold = 0;
let gravity;
let isPlaying = true;
const symmetries = 16;

let gravSlider;
let thrustSlider;

let baseColourPalette;
let finalColourPalette;
const bins = 128;

let movers = [];

function preload(){
  music = loadSound("reflected-light-147979.mp3")
}

function setup() {
  createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
  
  cnv = createGraphics(width, height);
  
  baseColourPalette = "#ff595e, #ff924c, #ffca3a, #8ac926, #52a675, #1982c4, #4267ac, #6a4c93".split(", ").map(e => color(e));
  finalColourPalette = fillInColourPalette(baseColourPalette, int(bins/baseColourPalette.length));
  console.log(finalColourPalette);

  // for prototypying - took a fair amount of trial and error to get the right values to be interesting
  gravSlider = createSlider(0,2.5,1.25,0.1);
  thrustSlider = createSlider(0,5,1.75,0.1);

  gravity = createVector(0, gravityStrength);

  fft = new p5.FFT(1, bins);
  music.loop();

  for(let i = 0; i < bins; i ++){
    movers.push(new Mover((i+0.5)*width/bins, height, finalColourPalette[i]));
  }

  music.loop();
  console.log(movers);

  imageMode(CENTER);

}



function draw() {
  background(0);

  // toggle music
  if(isPlaying && !music.isPlaying()) music.loop();
  if(!isPlaying && music.isPlaying()) music.stop();

  // clear the canvas
  cnv.clear();
  
  gravityStrength = gravSlider.value();
  maxKick = thrustSlider.value();
  
  let spectrum = fft.waveform();
  drawMovers(cnv, spectrum);
 
  push();
  translate(width/2, height/2);
  rotate(frameCount*TWO_PI/1200);
  for(let i = 0; i < symmetries; i++){
    push();
    rotate(i*TWO_PI/symmetries);
    image(cnv, 0, 0, cnv.width*0.75, cnv.height*0.75);
    pop();
  }
  pop();
  

  // text(`Gravity: ${gravityStrength}`, width/2, height*0.9);
  // text(maxKick, width/2, height*0.95);
}


function mousePressed(){
  if(mouseButton === LEFT) isPlaying = !isPlaying;
}

function showWaveform(spectrum){
  for(let i = 0; i < spectrum.length; i++){
    let x = (i+0.5)*width/spectrum.length;
    let y = height*(1 - abs(spectrum[i]));
    fill(finalColourPalette[i]);
    circle(x,y,width/spectrum.length);
  }
}

function drawMovers(layer, spectrum){
  for(let i = 0; i < movers.length; i++){
    let thrustY = map(abs(spectrum[i]),0,1,0,maxKick); // normalised to 0 to 1;
    let f = createVector(0, -thrustY);
    if(thrustY > lowerThreshold) movers[i].applyForce(f);
    movers[i].applyForce(gravity);
    movers[i].update();
    movers[i].show(layer);
  }
}

class Mover{
  constructor(x, y, col){
    this.p = createVector(x,y);
    this.v = createVector(0,0);
    this.a = createVector(0,0);
    this.colour = col;
  }

  applyForce(f){
    this.a.add(f);
  }

  update(){
    this.v.add(this.a);
    // this.v.limit(maxKick);
    this.p.add(this.v);
    this.a.mult(0);
    if(this.p.y < 0){
      this.p.y = 0; // keep it on the screen
      this.v.mult(0);
    }
    if(this.p.y > height){
      this.p.y = height; // keep it on the screen
      this.v.mult(0);
    }
  }

  show(layer){
    layer.fill(this.colour);
    layer.circle(this.p.x, this.p.y, width/bins);
  }
}

function fillInColourPalette(palette, subdivisions){
  let newPalette = [];
  for(let i = 0; i < palette.length; i++){
    for(let subdiv = 0; subdiv < subdivisions; subdiv ++){
      let colourA = palette[i];
      let colourB = palette[(i+1)%palette.length];
      let newCol = lerpColor(colourA, colourB, i/subdivisions);
      newPalette.push(newCol);
    }
  }
  return newPalette;
}