/*
Author: Project Somedays
Date: 2024-03-29
Title: Reverse-Engineering Challenge Series

@gandyworks did it live with a plotter, but I loved the effect: https://www.instagram.com/reel/C4v8j2NR41s/?igsh=ZnhheTVhNGVlM2M3
*/

const cycleFrames = 600;
let centrePoint;
let r, R;
let a;
let xOff, yOff;
let noiseR;
let drawLayer;
let transitionLayer;

function setup() {
  createCanvas(1080, 1080);
  transitionLayer = createGraphics(height, height);
  
  drawLayer = createGraphics(width, height);
  drawLayer.strokeWeight(2);
  drawLayer.colorMode(HSB, 360, 100, 100, 100)
  transitionLayer.background(0,0,0,20);
  drawLayer.background(0);
  centrePoint = createVector(width/2, height/2);
  R = random(width/4, width*0.4);
  r = random(0.5*R, 2.5*R);
  drawLayer.noFill();
  drawLayer.stroke(255);
  xOff = random(1000);
  yOff = random(1000);
  imageMode(CENTER);
  a = 0;
  noiseR = random(0,2);
  background(0);
  
}

function draw() {
  
  drawLayer.stroke(degrees(a%TWO_PI), 100, 100);
  let yAxis = r*noise(yOff + noiseR*cos(a), yOff + noiseR*sin(a));
  let xAxis = r*noise(xOff + noiseR*cos(a), xOff + noiseR*sin(a));
  
  drawLayer.push();
  drawLayer.translate(centrePoint.x + R*cos(a), centrePoint.y + R*sin(a));
  drawLayer.rotate(a);
  drawLayer.ellipse(0,0,xAxis, yAxis);  
  drawLayer.pop();
  if(a > TWO_PI){
    drawLayer.fill(0,0,0,10);
    drawLayer.rect(0,0,width, height);
  }

  push();
    translate(centrePoint.x, centrePoint.y)
    rotate(-a);
    image(drawLayer,0,0);
  pop();
  
  a += TWO_PI/cycleFrames;
  
  if(a > TWO_PI){
    image(transitionLayer, 0, 0);
  }
  
  if(a > 1.5*TWO_PI){
    setup();
  }


}

function mousePressed(){
  if(mouseButton === LEFT){
    setup();
  }
}