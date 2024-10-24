/*
Author: Project Somedays
Date: 2024-03-29
Title: Reverse-Engineering Challenge Series

@gandyworks did it live with a plotter, but I loved the effect: https://www.instagram.com/reel/C4v8j2NR41s/?igsh=ZnhheTVhNGVlM2M3

Now with different curves from https://mathworld.wolfram.com/topics/PolarCurves.html 
*/

const originalLoop = (a,t) => createVector(
  a*cos(t),
  a*sin(t)
)

const eightcurve = (a,t) => createVector(
  a*sin(t),  // x
  a*sin(t)*cos(t) //y
  );
  
const butterflycurve = (a,t) => createVector(
    0.1*a*sin(t)*(exp(cos(t) - 2*cos(4*t) + sin(t/12)**5)),
    0.1*a*cos(t)*(exp(cos(t) - 2*cos(4*t) + sin(t/12)**5))
  );

const bifoliateCurve = (a,t) => createVector(
  0.75*((8*a*(sin(t)**2))*(cos(t)**2))/(cos(4*t) +3),
  0.75*((8*a*(sin(t)**3))*(cos(t)**1))/(cos(4*t) +3),
)

const trifoil = (a,t) => createVector(
  0.5*a*(sin(t) + 2*sin(2*t)),
  0.5*a*(cos(t) - 2*cos(2*t))
)

const cardioid = (a,t) => createVector(
  0.05*a*(16*sin(t)**3),
  0.05*a*(13*cos(t) - 5*cos(2*t) - 2*cos(3*t) - cos(4*t))
)

const cycleFrames = 900;
let centrePoint;
let r, R;
let t;
let xOff, yOff;
let noiseR;
let drawLayer;
// let transitionLayer;
let a;
let chosenFunction;
let functionChoices;
let globalZoom;
let coloursOn;
let extent;

function setup() {
  createCanvas(1920, 1080);
  // createCanvas(windowWidth, windowHeight);
  transitionLayer = createGraphics(height, height);
  functionChoices = [eightcurve, trifoil, cardioid, bifoliateCurve, butterflycurve];
  chosenFunction = random(functionChoices);
  drawLayer = createGraphics(2*width, 2*height);
  drawLayer.strokeWeight(1);
  drawLayer.colorMode(HSB, 360, 100, 100, 100)
  // transitionLayer.background(0,0,0,20);
  drawLayer.background(0);
  centrePoint = createVector(width/2, height/2);
  extent = min(drawLayer.width, drawLayer.height)
  R = random(extent*0.5, 0.9*extent);
  r = random(0.1*R, 0.5*R);
  drawLayer.noFill();
  drawLayer.stroke(255);
  xOff = random(1000);
  yOff = random(1000);
  imageMode(CENTER);
  t = 0;
  a = random(width/4, width/3);
  noiseR = random(0,2);
  background(0);
  coloursOn = random()<0.5;
  
}

function draw() {
  if(coloursOn){
    drawLayer.stroke(0,0,100);
  } else{
    drawLayer.stroke(degrees(t%TWO_PI), 100, 100);
  }
  
  let yAxis = r*noise(yOff + noiseR*cos(t), yOff + noiseR*sin(t));
  let xAxis = r*noise(xOff + noiseR*cos(t), xOff + noiseR*sin(t));
  
  drawLayer.push();
  let drawPoint = trifoil(a,t);//eightcurve(a,t);
  drawLayer.translate(drawLayer.width/2 + drawPoint.x, drawLayer.height/2 + drawPoint.y);
  drawLayer.rotate(t);
  drawLayer.ellipse(0,0,xAxis, yAxis);  
  drawLayer.pop();
  // if(t > TWO_PI){
  //   drawLayer.fill(0,0,0,10);
  //   drawLayer.rect(0,0,width, height);
  // }

  push();
    translate(centrePoint.x, centrePoint.y)
    scale(globalZoom);
    rotate(-t);
    image(drawLayer,0,0);
  pop();
  
  t += TWO_PI/cycleFrames;

  globalZoom = 0.75 + 0.25*(1+sin(t));
  
  // if(t > TWO_PI){
  //   image(transitionLayer, 0, 0);
  // }
  
  // if(t > 1.5*TWO_PI){
  //   setup();
  // }


}



function mousePressed(){
  if(mouseButton === LEFT){
    setup();
  }
}