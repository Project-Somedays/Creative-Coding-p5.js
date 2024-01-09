/*
Author: Project Somedays
Date: 2024-01-04
Title: Genuary 2024 Day 4 - Pixels

Inspiration: Slow Mo Guys: https://www.youtube.com/watch?v=3BJU2drrtCM
The basic idea: why don't I just show how the work by sampling the image underneath
For now, I kind of like the buggy effect.
Bonus points for working out what I should have done to have it work as intended? hahaha
Music: Titanium from Alicia via Pixabay: Music by <a href="https://pixabay.com/users/alisiabeats-39461785/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=170190">Alisia</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=170190">Pixabay</a>
*/

const pixelViewWindowSize = 25;
const cycleOnFrame = 300;
const colours = ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1'];
const bgGraphicSquareSize = 10;
const everyNthFrame = 5;
let windowH2WRatio;
let res;
let startX, startY, startXOff, startYOff;
let bgImage;
let pixelViewMode = true;

const getStartCoord = (offset, lowerLim, upperLim) => int(map(noise(offset),0,1,lowerLim,upperLim)); 


function setup() {
  createCanvas(windowWidth, windowHeight);
  res = min(width, height)/pixelViewWindowSize;
  bgImage = generateGraphic();
  windowH2WRatio = height/width;
  pixelDensity(1);
  startXOff = random(1000); // for moving about the screen
  startYOff= random(1000);
  startX = 0;
  startY = 0;
  stroke(0);
  bgImage.loadPixels();
}
  
function draw() {
  image(bgImage, 0,0);
  
  // move the "window" around the screen
  startX = int(map(noise(startXOff), 0, 1, 0, bgImage.width-pixelViewWindowSize));
  startY = int(map(noise(startYOff), 0, 1, 0, bgImage.height-pixelViewWindowSize));
  
  // show the window
  fill(255);
  stroke(0);
  rect(startX, startY, pixelViewWindowSize, pixelViewWindowSize*windowH2WRatio);

  if(pixelViewMode){
    for(let y = 0; y < height/res; y++){
      for(let x = 0; x < width/res; x++){
        let index = ((x + startX)  +  (y+startY)*width)*4;
        drawPixel(x*res,y*res, bgImage.pixels[index], bgImage.pixels[index + 1], bgImage.pixels[index + 2]);
      }
    }
  }
  
  // move the things around the screen
  startXOff += 0.0005;
  startYOff += 0.0005;

  if(frameCount%cycleOnFrame === 0){
    pixelViewMode = !pixelViewMode;
    
  }
}


function drawPixel(x,y, r, g, b){
  stroke(0);
      strokeWeight(2);
      rect(x, y, res, res); // the outline
      noStroke();
      fill(r, 0, 0); // red channel
      rect(x, y, res/3, res); 
      fill(0, g, 0); // green channel
      rect(x + res/3, y,res/3,res);
      fill(0, 0, b); // blue channel
      rect(x + 2*res/3, y, res/3, res);
}

function generateGraphic(){
  let bg = createGraphics(width, height);
  bg.textAlign(CENTER, CENTER);
  bg.textSize(min(height, width)/2.5);
 
  for(let y = 0; y < height; y ++){
    for(let x = 0; x < width; x ++){
      bg.fill(random(colours));
      bg.square(x*bgGraphicSquareSize, y*bgGraphicSquareSize,bgGraphicSquareSize);
    }
  }
  bg.fill(255);
  if(width < height){
    bg.push();
    bg.translate(width/2, height/2);
    bg.rotate(HALF_PI);
    bg.text("PIXELS",0, 0);
    bg.pop();
  } else {
    bg.text("PIXELS", width/2, height/2);
  }
  return bg;
}