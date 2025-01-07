/*
Author: Project Somedays
Date: 2025-01-07
Title: Genuary 2025 Day 7 - Use software that is not intended to create art or images.

Playing fast and loose with interpretation of the prompt - driving "art" from MACHINES that were not intended to create art or images
Technically not generative, but... 🤷 Moving on!

Resources:
  - Sawmill noises: https://pixabay.com/sound-effects/sawmill-noises-22523/
  - Dial-up Internet: https://pixabay.com/sound-effects/the-sound-of-dial-up-internet-6240/
  - 3D printer: https://pixabay.com/sound-effects/031389-3d-printer-close-71289/
  - Typewriter: https://pixabay.com/sound-effects/035385-long-sound-typewriter-76388/
  - Sewing Machine: https://pixabay.com/sound-effects/sewing-machine-77390/
  - Washing Machine: https://pixabay.com/sound-effects/washing-machine-26247/
  - Hawk Jets: https://pixabay.com/sound-effects/hawk-jets-56916/
*/

let sawmillSounds;
let fft;

const bands = 128; // must be a power of 2
let waveform = [];
let basePalette = "#f94144, #f3722c, #f8961e, #f9c74f, #90be6d, #43aa8b, #4d908e, #577590".split(", ");
let palette;
let positions;
let span;
let maxAmp = 0;

let sounds = [];

let currentSound;

let gui, params;
let prevSound;



function preload(){
  sounds = {
    "Sawmill" : loadSound("sawmill-noises-22523.mp3"),
    "Dialup" : loadSound("the-sound-of-dial-up-internet-6240.mp3"),
    "3Dprinter" : loadSound("031389_3d-printer-close-71289.mp3"),
    "Typewriter" : loadSound("035385_long-sound-typewriter-76388.mp3"),
    "Sewing Machine" : loadSound("sewing-machine-77390.mp3"),
    "Washing Machine" : loadSound("washing-machine-26247.mp3"),
    "Hawk Jets" : loadSound("hawk-jets-56916.mp3")
  }
    
}

function setup() {
  // createCanvas(windowWidth, windowHeight,WEBGL);
  createCanvas(1080, 1080, WEBGL);
  
  span = 0.6*min(width, height);
  fft = new p5.FFT(0.8, bands);
 
  ortho();
  // noStroke();
  fill(255);
  
  colorMode(HSB, 360, 100, 100);

  gui = new lil.GUI();
  params = {
    currentSound : sounds["Sawmill"],
    rotateMode : true,
    rotationFrames: 1200
  }

  params.currentSound.loop();
 

  gui.add(params, 'currentSound', sounds).onChange(currentSound => {
    prevSound.stop();
    currentSound.loop();
    prevSound = currentSound;
  });
  gui.add(params, 'rotateMode');
  gui.add(params, 'rotationFrames', 30, 3000, 10);
  
  prevSound = params.currentSound;
}

function draw() {
  background(0);
  let r = width;
  let a = frameCount*TWO_PI/params.rotationFrames;
  rotateX(-QUARTER_PI);
  if(params.rotateMode){
    rotateY(a);
  } else{
    rotateY(-QUARTER_PI);
  }

  let spectrum  = fft.analyze();
  let n = int(spectrum.length*0.45); // the interesting part of the spectrum
  // beginShape();

  waveform.push(spectrum);
  
  for(let i = 0; i < waveform.length; i++){
    let z = span/2 - i * span/n;
    for(let j = 0; j < n; j++){
      let spectrumHeight =  waveform[i][j];
      if(spectrumHeight > maxAmp) maxAmp = spectrumHeight; // keep updating the max amp
      let c = map(spectrumHeight, 0, maxAmp, 0, 360);
      fill(c, 100, 100);
      let x = -span/2 + j * span / n;
      let y = -spectrumHeight/2;
      push();
      translate(x,y,z);
      box(span/n, spectrumHeight, span/n);

      pop();
    }
  }
 
  endShape();

  if(waveform.length > n) waveform.shift();
 

  orbitControl();
}

