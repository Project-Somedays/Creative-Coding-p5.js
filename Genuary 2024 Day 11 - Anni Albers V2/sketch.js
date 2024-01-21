/*
Author: Project Somedays
Date: 2024-01-20
Title: Genuary 2024 Day 11 - In the style of Anni Albers (Attempt 2)

Emulating her work: https://www.artsy.net/artwork/anni-albers-untitled-4-of-9-from-connections-1925-1983
Attempting to draw Anni Albers using that artwork
Remap greyscale values to the colours of the original artwork
Spawn random shapes no closer than the 0.6 of the sum of their two max radii away
Sample colours from the underlying image

*/

let colours= [];
let shapes = [];
const minR = 2;
const maxR = 5;
const n = 20000;
let scaleFactor;

const sampleColourFromImage = (x,y, scl, imageFile) => imageFile.get(int(x/scl), int(y/scl));

function preload(){
  img = loadImage("Albers_Anni-1.png");
}

function setup() {
 
  createCanvas(1080, 1080);

  scaleFactor = width/img.width;

  colours = [color(174, 81, 78), color(221, 198, 77), color(14, 114, 158)];

  // recolour image
  img.loadPixels();
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

  // try to fit in a new shape somewhere
  for(let i = 0; i < n; i++){
    let attempts = 0;
    while(attempts < 100){
      let x = random(width);
      let y = random(height);
      let n = random() < 0.2 ? 3 : 4;
      let candidate = new CustomShape(x,y, n, sampleColourFromImage(x,y,scaleFactor,img));
      // check to see if it's too close
      let isValid = true;
      for(let s of shapes){
        if(p5.Vector.dist(s.p, candidate.p) < 0.6*(s.maxR + candidate.maxR)){
          isValid = false;
          break;
        }
      }
      // if it's far enough away from ALL the other shapes, add it to the list
      if(isValid){
        shapes.push(candidate);
        break;
      }
      attempts ++;
      // otherwise, increment attemps
    }
  }

  console.log(shapes.length);

  background(0);
  // noStroke();
  for(let shape of shapes){
    shape.show();
  }

  saveCanvas("Anni Alberfied.png");
  
}

function draw() {
 

}


class CustomShape{
  constructor(x,y, n, colour){
    this.p = createVector(x,y);
    this.n = n;
    this.rot = random(TWO_PI);
    this.vertices = []
    this.colour = colour;
    this.maxR = 0;
    for(let i = 0; i < this.n; i++){
      let baseAngle = i*TWO_PI/this.n;
      let a = baseAngle + random(-PI/6, PI/6);
      let r = random(minR, maxR);
      this.vertices.push(createVector(r*cos(a), r*sin(a)));
      // collect the max R for this shape
      if(r > this.maxR){
        this.maxR = r;
      }
    }
  }

  show(){
    fill(this.colour);
    push();
      translate(this.p.x, this.p.y);
      rotate(this.rot);
      beginShape();
        for(let v of this.vertices){
          vertex(v.x, v.y);
        }
      endShape(CLOSE);

    pop();
  }
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


