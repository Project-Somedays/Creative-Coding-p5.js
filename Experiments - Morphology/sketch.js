/*
Author: Project Somedays
Date: 2024-04-20
Title: Morphology

Experiments in morphing between regular shapes.

WIP. Pretty hacky at the moment.

Leaping off from a great feedback tutorial from Aaron Reuland (a_ soluble_fish): https://openprocessing.org/sketch/2239520
Check out his profile! He has really cool stuff: https://openprocessing.org/user/183691?view=sketches&o=48

CCapture tutorial: https://editor.p5js.org/jnsjknn/sketches/B1O8DOqZV
*/

const palettes = [
  // ['#ffffff'],
  ['#f72585', '#b5179e', '#7209b7', '#560bad',' #480ca8', '#3a0ca3', '#3f37c9', '#4361ee', '#4895ef', '#4cc9f0'],
  ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000', '#dc2f02', '#e85d04',' #f48c06', '#faa307', '#ffba08'],
  ['#d9ed92', '#b5e48c','#99d98c','#76c893', '#52b69a', '#34a0a4', '#168aad', '#1a759f', '#1e6091', '#184e77'],
  ['#3a0f72', '#6023b0', '#7826e3', '#8e48eb', '#a469f2', '#bb4fcd', '#d235a8', '#ff005e', '#250b47'],
  ['#007f5f', '#2b9348', '#55a630', '#80b918', '#aacc00', '#bfd200', '#d4d700', '#dddf00', '#eeef20', '#ffff3f'],
  ['#012a4a', '#013a63', '#01497c', '#014f86', '#2a6f97', '#2c7da0', '#468faf', '#61a5c2', '#89c2d9', '#a9d6e5'],
  ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1'],
  ['#0466c8', '#0353a4', '#023e7d', '#002855', '#001845', '#001233', '#33415c', '#5c677d', '#7d8597', '#979dac'],
  ['#7400b8', '#6930c3', '#5e60ce', '#5390d9', '#4ea8de', '#48bfe3', '#56cfe1', '#64dfdf', '#72efdd', '#80ffdb'],
  ['#54478c', '#2c699a', '#048ba8', '#0db39e', '#16db93', '#83e377', '#b9e769', '#efea5a', '#f1c453', '#f29e4c'],
  ['#227c9d', '#17c3b2', '#ffcb77', '#fef9ef', '#fe6d73'],
  ['#ffbc42', '#d81159', '#8f2d56', '#218380', '#73d2de'],
  ['#d00000', '#ffba08', '#3f88c5', '#032b43', '#136f63'],
  ['#eac435', '#345995', '#03cea4', '#fb4d3d', '#ca1551']
];

let captureMode = false;
let target;
// let morpher;

let palette;

const archimedesSpiral = (a,b,t) => createVector(a*cos(t)*(t)**(1/b),a*sin(t)*(t)**(1/b));

let morphers = [];
let stacks = [];
let stackLength = 20;
let n = 5;

// capture stuff
// let totalFrames = morphCycleDuration * 17;
let fps = 30;
let capturer = new CCapture({
  format: 'png',
  framerate: fps
});

function setup(){
  createCanvas(1080, 1080);
  palette = random(palettes);
  
  pixelDensity(1);

  stacks.push({p: createVector(0.25*width, 0), r: width/16, morphers: [], n: int(random(3,7))}); // so we have something to start with
  console.log(stacks);
  // while(stacks.length < stackLength){
  //   let attempts = 0;
  //   while(attempts < 100){
  //     let r = random(width/20,width/2);
  //     let a = random(-PI/6, PI/6);
  //     let p = createVector(r*cos(a), r*sin(a));
  //     for(let s of stacks){
  //       let d = p5.Vector.dist(p, s.p)
  //     }

  //   }
    

  // }
  
  // makeStackOnTarget();

  for(let s of stacks){
    for(let i = 0; i < s.n; i++){
      let colour = random(palette);
      s.morphers[i] = new Morpher(0, 0, s.r*(i+1)/s.n, 6, 3, 4, (i+1)*40, (i + 1)*40, colour);
    }
    s.morphers.reverse();
    
  }

}

function draw(){
  if(captureMode && frameCount === 1) capturer.start();

  background(0);
//  target.background(0);



  push()
  translate(width/2, height/2);
  for(let s of stacks){
    push();
    translate(s.p.x, s.p.y);
    for(let morpher of s.morphers){
      morpher.update();
      morpher.show();
    }
    
    pop();
  }
  pop();

  

  
  // image(target, width/2, height/2);

  // morpher.update();
  // showShadows();
  // drawCopiesInSpiral();

  if (captureMode && frameCount === totalFrames) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  if(captureMode) capturer.capture(document.getElementById('defaultCanvas0'));
}


function makeStackOnTarget(){
  target = createGraphics(width, width);  
  target.colorMode(HSB, 360, 255, 255, 255);
  
 
  // target.stroke(1,0,255,255);
  target.noStroke();
  target.strokeWeight(5);

  imageMode(CENTER);

  background(0);

  for(let i = 0; i < n; i++){
    morphers[i] = new Morpher(target.width/2, target.height/2, i*target.width/(2*n), 6, 3, 4, (i+1)*40, (i + 1)*40);
    morphers[i].morphFromTriangles(); // finish init
  }
  morphers.reverse();

}


function drawCopiesInSpiral(){
  for(let i = 0; i < morphers.length; i++){
    let m = morphers[i];
    target.fill((frameCount+i*360/n)%360, 255, 255, 200);
    m.update();
    m.showOnTarget(target);
  }

  for(let t = 0; t < 10*TWO_PI; t += PI/24){
    let p = archimedesSpiral(15,1,t);
    let s = map(t, 0, 10*TWO_PI, 50, 200);
    image(target, p.x + width/2, p.y + height/2, s, s);
  }
}

// morph from 
function showShadows(){
  morpher.showForshortened();

  let g = get();
  let xShift = noise(frameCount, 0, 1, -width/4, width/4);
  let shadowSize = 0.5*sin(frameCount*TWO_PI/(sqrt(2)*this.duration) + 1)*0.035 + 1;
  image(g, width/2 + xShift , height/2 + height/100, width*shadowSize, height*shadowSize);
}



  