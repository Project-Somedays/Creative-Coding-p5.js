
let portrait, dorian, bgImage;
// let portraitPixelArr, dorianPixelArr;

let captureMode = true;

let tiles = [];
let cycleFrames = 120;
let n = 500;
let step = 5;
let noiseZoom = 300;
let noiseProgRate = 0.01;
let dl;

let portraitLayer, dorianLayer;

let fps = 30;
let capturer;


function preload(){
  portrait = loadImage("Portrait.png");
  dorian = loadImage("Dorian.png");
  bgImage = loadImage("Background.png");
}


function setup() {
  createCanvas(1080, 1080);
  frameRate(30);

  // so we can just grab the pixels that have something on them

  portraitLayer = createGraphics(width, height);
  portraitLayer.image(portrait, 0,0);
  dorianLayer = createGraphics(width, height);
  dorianLayer.image(dorian,0,0);
  dorianLayer.loadPixels();
  portraitLayer.loadPixels();

  // make buffer layers and load the pixels
  for(let i = 0; i < width; i+= step){
    for(let j = 0; j < height; j+= step){
      if(containsNoOpaquePixels(i, j)) tiles.push(new Tile(i, j, step, step));
      
    }
  }

  console.log(tiles.length);

  // dl = createGraphics(width, height);

  pixelDensity(1);

  // dl.loadPixels();
 


  capturer = new CCapture({
    format: 'png',
    framerate: fps
  });
  stroke(255);
  noFill();
  image(bgImage, 0, 0);
}

function draw() {
  
  if(captureMode && frameCount === 1) capturer.start();

  for(let i = 0; i < width; i += step){
    for(let j = 0; j < height; j += step){
      let noiseVal = noise(i/noiseZoom, j/noiseZoom, frameCount*noiseProgRate);
      if(noiseVal < 0.5){
        image(dorian,i, j, step, step, i, j, step, step) 
      } else{
        image(portrait, i, j, step, step, i, j, step, step);
      }
    }
  }
  
  
  
  if (captureMode && frameCount === 30*30) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  if(captureMode) capturer.capture(document.getElementById('defaultCanvas0'));
  
}

function containsNoOpaquePixels(x, y){
  for(let i = x; i <= x+step; i++){
    for(let j = y; j <= y + step; j++){
      let ix = i + j*width;
      if(portraitLayer.pixels[ix+3] > 0 || dorianLayer.pixels[ix+3] > 0) return true;
    }
  }
  return false;
}

class Tile{
  constructor(x,y){
    this.p = createVector(x,y);
    this.noiseVal;
  }
  
  update(){
    this.noiseVal = noise(this.p.x/noiseZoom, this.p.y/noiseZoom, frameCount*noiseProgRate);
  
  }

  show(){
    

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
