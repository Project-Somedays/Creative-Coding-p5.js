/* 
Author: Project Somedays
Date: 2024-05-09
Title: Reverse-Engineering Challenge Series - The Picture of Dorian Grey

Riffing on experiments from yesterday - embrace the jank!

Now with 3 layers for the noise field to choose from

Lends itself to something with a shader if anyone wants to make a fork and run it on the GPU. It's on my list to learn still...

Original Image: https://images.app.goo.gl/3abXqML8arZWYxZT7

*/


let man, muscles, skeleton;
let manLayer, musclesLayer, skeletonLayer;
let opacityThreshold = 5;

let step = 5;
const noiseZoom = 300;
const noiseProgRate = 0.03;

let tiles = [];


// ---- CAPTURE BIZ ------ //
let fps = 30;
let capturer;
const captureMode = true;



function preload() {
  man = loadImage("Man.png");
  muscles = loadImage("Muscles.png");
  skeleton = loadImage("Skeleton.png");
}


function setup() {
  createCanvas(1080, 1080);
  // frameRate(30);


  // so we can just grab the pixels that have something on them
 manLayer = createGraphics(width, height);
 manLayer.image(man, 0,0);
 manLayer.loadPixels();

 musclesLayer = createGraphics(width, height);
 musclesLayer.image(muscles, 0,0);
 musclesLayer.loadPixels();

 skeletonLayer = createGraphics(width, height);
 skeletonLayer.image(skeletonLayer, 0,0);
 skeletonLayer.loadPixels();


  pixelDensity(1);

  // ignore samples that are completely transparent
  for (let i = 0; i < width; i += step) {
    for (let j = 0; j < height; j += step) {
      // if (containsOpaquePixels(i, j)) 
      tiles.push(new Tile(i, j)); 
        
    }
  }

  console.log(tiles.length);

  // -------------- CAPTURE BIZ ----------------------//

  capturer = new CCapture({
    format: 'png',
    framerate: fps
  });
  stroke(255);
  noFill();

}

function draw() {
  background(255);
  if (captureMode && frameCount === 1) capturer.start();

  for(let t of tiles){
    t.update();
    t.show();
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
      
        if((manLayer.pixels[ix+3] > opacityThreshold) || (skeletonLayer.pixels[ix+3] > opacityThreshold) || (musclesLayer.pixels[ix+3] > opacityThreshold)) return true;
    
      
    }
  }
  return false;
}

class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.noiseVal;
  }

  update() {
    this.noiseVal = noise(this.x / noiseZoom, this.y / noiseZoom, frameCount * noiseProgRate);
  }

  show() {
    // image(skeleton, this.x, this.y, step, step, this.x, this.y, step, step);
    if (this.noiseVal <= 0.3) {
      image(skeleton, this.x, this.y, step, step, this.x, this.y, step, step);
    } else if(this.noiseVal <= 0.55) {
      image(muscles, this.x, this.y, step, step, this.x, this.y, step, step);
    } else {
      image(man, this.x, this.y, step, step, this.x, this.y, step, step);
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
