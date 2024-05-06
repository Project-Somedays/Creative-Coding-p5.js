/*
Author: Project Somedays
Date: 2024-05-06
Title: Experiments - Casey Reas Tribute
*/



let r;
let tests = []
let n = 5;
let rate = 0.003;

const getVal = (offset, min, max) => map(noise(offset + frameCount*rate), 0, 1, min, max);
let sclFactor;


const maxOpacity = 20;

let debugMode = false;

let cnv;
let debug;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // createCanvas(1080, 1080);
  cnv = createGraphics(width*2, height*2);
  debug = createGraphics(cnv.width, cnv.height); // must match cnv

  sclFactor = width/cnv.width;
  debug.noFill();
  imageMode(CENTER);
  
  r = cnv.width/20;
  for(let i = 0; i < n; i++){
    tests[i] = new CircCollection();
  }
 
  
  background(0); 
  
}

function draw() {
  if(debugMode) debug.background(0); 
  
  for(let t of tests){
    t.update();
    if(debugMode) t.show(debug); 
  }

  if(!debugMode){
    drawOverlap(cnv);
    // image(cnv, width/2, height/2, cnv.width*sclFactor, cnv.height*sclFactor);
    image(cnv, width/2, height/2, width, height)
  }

  if(debugMode) {
    drawOverlap(debug);
    image(debug, width/2, height/2, debug.width*sclFactor, debug.height*sclFactor);
  }
  
}

function drawOverlap(layer){
  for(let i = 0; i < tests.length; i++){
    for(let j = i; j < tests.length; j++){
      // see if we're out of range
      if(i === j) continue;
      if(p5.Vector.dist(tests[i].c, tests[j].c) > tests[i].r + tests[j].r) continue;

      // if not, go through and check for overlap between any of the brushes
      let brushesA = tests[i].brushes;
      let brushesB = tests[j].brushes;
      for(let a = 0; a < brushesA.length; a ++){
        for(let b = 0; b < brushesB.length; b ++){
          let brushA = brushesA[a];
          let brushB = brushesB[b];
          let d = p5.Vector.dist(brushA.p, brushB.p)
          if(d > brushA.radius + brushB.radius) continue;
          if(!debugMode){
            let strokeCol = int(map(d, 0, brushA.radius + brushB.radius, 255, 0));
            let opacity = int(map(d, 0, brushA.radius + brushB.radius, maxOpacity, 0));
            layer.stroke(strokeCol, opacity);
          }
          line(brushA.p.x, brushA.p.y, brushB.p.x, brushB.p.y);
          // showOverlapChord(layer, d, brushA, brushB);
        }
      }
    }
  }
}


function showOverlapChord(layer, distBtwCentres, brushA, brushB){
	let D = brushA.radius + brushB.radius;
  let smaller = brushA.radius >= brushB.radius ? brushA : brushB;
  let larger = brushA.radius >= brushB.radius ? brushB : brushA;
  let d = distBtwCentres * smaller.radius / D;
	let aSys = p5.Vector.sub(larger.p, smaller.p).heading(); // get the heading from A to B
	let a = acos(d/D);
	layer.push();
	layer.translate(smaller.p.x, smaller.p.y);
	layer.rotate(aSys); // for simplicity, rotate the system so that posB is always to the right of posA
	layer.line(smaller.radius*cos(a), smaller.radius*sin(a), smaller.radius*cos(a), smaller.radius*sin(-a)); // drawing a line between the points of intersection
	layer.pop();
}



function calculateInnerCircles(cx, cy, wholeCircleR, spreadR, smallCircleR, rotAngle) {
  let positionsAndRadii = [];
  
  
  for (let i = 0; i < 6; i++) {
    let angle = i * TWO_PI / 6 + rotAngle;
    let xPos = cos(angle) * wholeCircleR * spreadR;
    let yPos = sin(angle) * wholeCircleR * spreadR;
    positionsAndRadii[i] = {p: createVector(cx + xPos, cy + yPos), radius: wholeCircleR*0.5*smallCircleR};
  }
  positionsAndRadii.push({p: createVector(cx,cy), radius: wholeCircleR*0.5*smallCircleR});
  
  return positionsAndRadii;
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
}