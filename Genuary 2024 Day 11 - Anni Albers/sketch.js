/* 
Author: Project Somedays
Date: 2024-10-11
Title: Genuary 2024 Day 11 - Anni Alber

Wanted to take an iconic Anni Alber work and convert an image of her into that style
Found one that was mostly slightly warped rhombuses
Used the prompt clue from Day 10: (https://www.redblobgames.com/grids/hexagons/) to make a grid of rhombuses defined from their centers
Wrote a filter function to convert to colours from the sample artwork
*/

let img;
const res = 10; // how many pixels wide is a rhombus?
// const targetWidth = 1920;
const targetWidth = 1920;
let n; // how many rhombuses wide?
let scaleFactor; // for sampling purposes
let p, q, hp, hq; // p is long, q is short
let vertices;

let grid = [];
let testW = 20;

// for drawing the rhombuses
let OLEFT = Symbol("OLEFT");
let ORIGHT = Symbol("ORIGHT");
let OTOP = Symbol("OTOP");

// testing
// let colours = ["#ff0000","#ff8700","#ffd300","#deff0a","#a1ff0a","#0aff99","#0aefff","#147df5","#580aff","#be0aff"];
let test1,test2, test3;

// for the output
let targetGraphic;

// takes a sample point and maps it onto the domain it's sampling from
// const getPixelColour = (x,y, imageFile, scaleFactor) => imageFile.get();

function getPixelColour(x,y, imageFile, scaleFactor){
  // collects the pixel colour of the underlying image by index
  if(x < 0 || y < 0){
    return color(0,0,0,0);
  }
  // let ix = abs(int(x/scaleFactor)) + abs(imageFile.width * int(y/scaleFactor));
  // return color(imageFile.pixels[ix], imageFile.pixels[ix+1], imageFile.pixels[ix+2]);
  let c = imageFile.get(abs(int(x/scaleFactor)), abs(int(y/scaleFactor)));
  return c;
  // return color(255, 255, 255);
}

function preload(){
  img = loadImage("Albers_Anni-1-Small.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  scaleFactor = targetWidth/img.width;
  n = targetWidth/res;
 
  resizeCanvas(img.width*scaleFactor,img.height*scaleFactor);
  background(0);
  
  // diagonals of a rhombus
  s = width/(2*n);
  q = 0.5*s/cos(PI/6);
  p = 0.5*s/cos(PI/3);
  hq = q/2;
  hp = p/2;

  //vertices of a rhombus. No need to store this in each rhombus which are drawn using translate/rotate
  vertices = [
    createVector(q*cos(-PI/6), q*sin(-PI/6)),
    createVector(p*cos(PI/3), p*sin(PI/3)),
    createVector(q*cos(-PI/6 + PI), q*sin(-PI/6 + PI)),
    createVector(p*cos(PI/3 + PI), p*sin(PI/3 + PI))
  ]


  hSpace = sqrt(3);

  // passing the pixels through the classifyBrightness filter
  // image(img,0,0);
  img.loadPixels();
  // image(img, 0,0);
  for(let y = 0; y < img.height; y ++){
    for(let x = 0; x < img.width; x ++){
      let index = (x + y*img.width)*4;
      let b = (img.pixels[index] + img.pixels[index+1]+ img.pixels[index+2])/3;
      let col = classifyBrightness(b);
      img.pixels[index] = red(col);
      img.pixels[index+1] = green(col);
      img.pixels[index+2] = blue(col);
    }
  }
  img.updatePixels();
  // image(img, img.width,0);
  // save(img,"3 Colour Image.png");

  
  targetGraphic = createGraphics(img.width * res, img.height * res);
  targetGraphic.noStroke();
  // for(let y = 0; y < 2*n; y++){
  //   for(let x = 0; x < 2*n+2; x++){
  for(let y = 0; y < n*2; y++){
    for(let x = 0; x < n*3; x++){
      // console.log(`y = ${y}, x = ${x}`);
      if(y%2 === 0){
        
         if(x%2 === 0){
          let xStandard = s*(x-1);
          let yStandard = hSpace*s*y;
          let xTop = s*(x-0.5);
          let yTop = hSpace*s*(y - 0.5);

          grid.push(new Rhombus(xStandard,yStandard,OLEFT, getPixelColour(xStandard,yStandard,img,scaleFactor)));
          grid.push(new Rhombus(xTop,yTop, OTOP, getPixelColour(xTop,yTop,img,scaleFactor)));
        } else {
          let xStandard = s*(x-1);
          let yStandard = hSpace*s*y;
          let xTop = s*(x-0.5);
          let yTop = hSpace*s*(y - 0.5);
          grid.push(new Rhombus(xStandard,yStandard,ORIGHT, getPixelColour(xStandard,yStandard,img,scaleFactor)));
        }
        continue;
        }
        
        // for odd y vals
        
        if(x%2 === 0){
          let xStandard = s*(x);
          let yStandard = hSpace*s*y;
          let xTop = s*(x+0.5);
          let yTop = hSpace*s*(y - 0.5);
          grid.push(new Rhombus(xStandard,hSpace*s*y,OLEFT, getPixelColour(xStandard,yStandard,img,scaleFactor)));
          grid.push(new Rhombus(xTop,yTop, OTOP, getPixelColour(xTop,yTop,img,scaleFactor)));
        } else {
          let xStandard = s*(x);
          let yStandard = hSpace*s*y;
          grid.push(new Rhombus(xStandard,yStandard,ORIGHT, getPixelColour(xStandard,yStandard,img,scaleFactor)));
        }
        
        continue;
        
    }
  }

  noStroke();
  for(let r of grid){
    try{
      console.log(`(${r.p.x}, ${r.p.y}) --> (${int(r.p.x/scaleFactor)}, ${int(r.p.y/scaleFactor)}), col = ${r.colour}`);
      
      // r.show(targetGraphic);
      
      r.show();
    } catch(error){
      console.log(error);
      
      
    }
    
    
  }

  // save(targetGraphic, "Alblified Image.png");



}

function draw() {
 
 
}

function classifyBrightness(brightness){
  if(brightness < 255/3){
    return color(14, 114, 158)// color(0,0,255);
  }
  if(brightness < 2*255/3){
    return color(174, 81, 78);//color(255,0,0, 255);
  }
  return color(220, 198, 77);//color(255, 255,0, 255);
}