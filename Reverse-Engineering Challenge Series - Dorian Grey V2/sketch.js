/* 
Author: Project Somedays
Date: 2024-05-08
Title: Reverse-Engineering Challenge Series - The Picture of Dorian Grey

Saw a cool thing from @tim_rodenbroeker and that sent me down a rabbit hole of sampling from different images: https://www.instagram.com/p/C6q8n93uJLt/
The Picture of Dorian Grey seemed like the perfect subject matter to either sample from the Picture or Dorian himself.

In this version, I'm using a 2D perlin noise field that progresses over time, deciding which sample to draw

Lends itself to something with a shader if anyone wants to make a fork and run it on the GPU. It's on my list to learn still...

Original Image: https://s26162.pcdn.co/wp-content/uploads/sites/2/2021/07/Dorian-Gray.jpg

*/


let picture, dorian, bgImage;
let portraitLayer, dorianLayer;
let opacityThreshold = 5;

let step = 10;
const noiseZoom = 300;
const noiseProgRate = 0.01;

let tiles = [];


// ---- CAPTURE BIZ ------ //
let fps = 30;
let capturer;
const captureMode = false;



function preload() {
  picture = loadImage("Picture.png");
  dorian = loadImage("Dorian.png");
  bgImage = loadImage("Background.png");
}


function setup() {
  createCanvas(1080, 1080);
  frameRate(30);

  // so we can just grab the pixels that have something on them
  portraitLayer = createGraphics(width, height);
  portraitLayer.image(picture, 0, 0);
  dorianLayer = createGraphics(width, height);
  dorianLayer.image(dorian, 0, 0);
  dorianLayer.loadPixels();
  portraitLayer.loadPixels();

  pixelDensity(1);

  // ignore samples that are completely transparent
  for (let i = 0; i < width; i += step) {
    for (let j = 0; j < height; j += step) {
      if (containsOpaquePixels(i, j)) tiles.push(new Tile(i, j));
    }
  }


  // -------------- CAPTURE BIZ ----------------------//

  capturer = new CCapture({
    format: 'png',
    framerate: fps
  });
  stroke(255);
  noFill();

}

function draw() {
  image(bgImage, 0, 0);
  if (captureMode && frameCount === 1) capturer.start();

  for (let i = 0; i < width; i += step) {
    for (let j = 0; j < height; j += step) {
      let noiseVal = noise(i / noiseZoom, j / noiseZoom, frameCount * noiseProgRate);
      if (noiseVal < 0.5) {
        image(dorian, i, j, step, step, i, j, step, step)
      } else {
        image(picture, i, j, step, step, i, j, step, step);
      }
    }
  }



  if (captureMode && frameCount === 30 * 30) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  if (captureMode) capturer.capture(document.getElementById('defaultCanvas0'));

}

// for filtering out completely transparent pixels that don't change
function containsOpaquePixels(x, y) {
  for (let i = x; i <= x + step; i++) {
    for (let j = y; j <= y + step; j++) {
      let ix = i + j * width;
      if (portraitLayer.pixels[ix + 3] > opacityThreshold || dorianLayer.pixels[ix + 3] > opacityThreshold) return true;
    }
  }
  return false;
}

class Tile {
  constructor(x, y) {
    this.p = createVector(x, y);
    this.noiseVal;
  }

  update() {
    this.noiseVal = noise(this.p.x / noiseZoom, this.p.y / noiseZoom, frameCount * noiseProgRate);
  }

  show() {
    if (this.noiseVal < 0.5) {
      image(dorian, this.p.x, this.p.y, step, step, this.p.x, this.p.y, step, step);
    } else {
      image(picture, this.p.x, this.p.y, step, step, this.p.x, this.p.y, step, step);
    }

  }
}




// pixel-based approach experiment

// portraitLayer = createGraphics(width, height);
// portraitLayer.image(portrait, 0,0);
// dorianLayer = createGraphics(width, height);
// dorianLayer.image(dorian,0,0);
// dorianLayer.loadPixels();
// for(let i = 0; i < width; i++){
//   for(let j = 0; j < height; j++){
//     let ix = i + width*j;
//     if(noise(i/noiseZoom,j/noiseZoom, frameCount*noiseProgRate) < 0.5){
//       dl.pixels[ix] = portraitLayer.pixels[ix]
//       dl.pixels[ix+1] = portraitLayer.pixels[ix+1]
//       dl.pixels[ix+2] = portraitLayer.pixels[ix+2]
//       dl.pixels[ix+3] = portraitLayer.pixels[ix+3]
//     } else{
//       dl.pixels[ix] = dorianLayer.pixels[ix]
//       dl.pixels[ix+1] = dorianLayer.pixels[ix+1]
//       dl.pixels[ix+2] = dorianLayer.pixels[ix+2]
//       dl.pixels[ix+3] = dorianLayer.pixels[ix+3]
//     }
//   }
// }
// dl.updatePixels();
// image(dl, 0, 0);
