/*
Author: Project Somedays
Date: 2024-05-06 updated 2024-05-10
Title: "Overlapdance"

Nod to Casey Reas - it's all just overlapping circles.

Now with a better implementation of drawing a chord of the intersection of two circles: https://mathworld.wolfram.com/Circle-CircleIntersection.html
*/


let palettes = [
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

let randPalette;



let r;
let tests = []
let n = 5;
let rate = 0.001;
let substeps = 1;

const getVal = (offset, min, max) => map(noise(offset + frameCount*rate), 0, 1, min, max);
let sclFactor;


const maxOpacity = 10;

let debugMode = false;

let cnv;
let debug;

function setup() {
  // createCanvas(windowWidth, windowHeight);
  
  createCanvas(1920, 1080);
  pixelDensity(1);

  randPalette = random(palettes);
  cnv = createGraphics(width, height);
  debug = createGraphics(cnv.width, cnv.height); // must match cnv

  // sclFactor = width/cnv.width;
  debug.noFill();
  imageMode(CENTER);
  
  r = random(width/50, width/10);
  for(let i = 0; i < n; i++){
    tests[i] = new CircCollection();
  }
 
  
  background(0);

  describe("In debug mode, arrangements of 6 circles around a central circle float around the screen, growing and shrinking. Where they overlap with other arrangements, a chord is drawing between their points of intersection. In normal mode, the colour from the larger of the two circles is cumulatively drawn to the screen");
}

function draw() {

  for(let i = 0; i < substeps; i++){
    debug.background(0); 
  
  for(let t of tests){
    t.update();
    t.show(debug); 
  }

  if(!debugMode){
    drawOverlap(cnv);
    // image(cnv, width/2, height/2, cnv.width*sclFactor, cnv.height*sclFactor);
    image(cnv, width/2, height/2)
  }

  if(debugMode) {
    drawOverlap(debug);
    image(debug, width/2, height/2);
  }
  }
  
  
}

function drawOverlap(layer){
  for(let i = 0; i < tests.length; i++){
    for(let j = 0; j < tests.length; j++){
      // see if we're out of range
      if(i === j) continue;
      if(p5.Vector.dist(tests[i].c, tests[j].c) > tests[i].r*tests[i].spreadR + tests[j].r*tests[j].spreadR) continue;

      // if not, go through and check for overlap between any of the brushes
      let brushesA = tests[i].brushes;
      let brushesB = tests[j].brushes;
      for(let a = 0; a < brushesA.length; a ++){
        for(let b = 0; b < brushesB.length; b ++){
          let brushA = brushesA[a];
          let brushB = brushesB[b];
          let d = p5.Vector.dist(brushA.p, brushB.p)
          if(d > brushA.r + brushB.r) continue;
          if(!debugMode){
            let stroke = brushA.r > brushB.r ? brushA.colour : brushB.colour;
            let opacity = int(map(d, 0, brushA.r + brushB.r, maxOpacity, 0));
            layer.stroke(hexToRgbWithOpacity(stroke, opacity));
          } else{
            layer.stroke(255);
          }
          drawChordOfPointsOfIntersection(layer, brushA, brushB)
          // layer.line(brushA.p.x, brushA.p.y, brushB.p.x, brushB.p.y);

          // showOverlapChord(layer, d, brushA, brushB);
        }
      }
    }
  }
}

function drawChordOfPointsOfIntersection(targetLayer, c1, c2){
  let R = c1.r;
  let r = c2.r;
  let d = p5.Vector.dist(c2.p, c1.p);
  if(d > r + R) return;
  let a = p5.Vector.sub(c2.p,c1.p).heading();
  let x = (d**2 - r**2 + R**2)/(2*d)
  let y1 = ((4*(d**2)*(R**2) - (d**2 - r**2 + R**2)**2)/(4*d**2))**0.5;
  let y2 = -y1;
  
  targetLayer.push();
  targetLayer.translate(c1.p.x, c1.p.y);  
  targetLayer.rotate(a);
  targetLayer.line(x, y1, x, y2);
  targetLayer.pop();
}

function hexToRgbWithOpacity(hex, opacity) {
  // Remove the hash symbol if it's present
  hex = hex.replace('#', '');

  // Parse the hex color into its RGB components
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Return the RGB color with the specified opacity
  return color(r, g, b, opacity);
}



function keyPressed(){
  if(key === ' '){
    debugMode = !debugMode;
    background(0);
  }
  if(debugMode){
    stroke(255);
  } else{
    stroke(255, 20);
  }

  console.log(debugMode)
}