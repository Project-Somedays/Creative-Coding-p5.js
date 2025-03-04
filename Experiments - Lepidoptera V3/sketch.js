/*
Author: Project Somedays
Date: 2024-03-19
Title: Experiments - Lepidoptera Variation 4

Taking inspiration from Casey Reas' work. Movers bounce around in box.
Where they overlap:
  1. Push each other apart with a force inversely proportion to their distance
  2. Draw a line between their centres

The output is mirrored vertically and horizontally.
Getting close to a Rorschach look. Hmmmm. More to explore here for sure.
*/

let palettes = [
  ['#ffffff'],
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

let interactionModes = {
  CENTREMODE : Symbol("CENTREMODE"),
  CHORDMODE: Symbol("CHORDMODE")
}

let viewMode = {
  VIEWSINGLE: Symbol("VIEWSINGLE"),
  VIEWCOMPARISON: Symbol("VIEWCOMPARISON")
}

let randPalette;
let walls = []
let r, D; // radius of the mover
let R; // Radius of the polygon cage
let opacity;

let cols = 3;
let boxS;

// setting the boundaries
let margin;

let DEBUGMODE = false;

// Mover Biz
let movers = [];
let n; // how many movers?
let fMax = 0.25; // how strongly should the movers push away
let overlap; // how much can each mover move into the next sector of the polygon

let chosenOverlapMode;

// Symmetries
let showLayer;
let debugLayer;
let boxMargin;

function setup() {
  // canvas = createCanvas(windowWidth, windowHeight, P2D);
  createCanvas(1080,1920, P2D);
  margin = 0.05*width;
  R = 0.55*min(width, height);
  showLayer = createGraphics(width, height);
  debugLayer = createGraphics(width, height);
  

  // HOW SHOULD THE OVERLAP BE SHOWN?
  chosenOverlapMode = interactionModes.CHORDMODE;

  opacity = int(random(50, 255));
  // opacity = 255;

  // COLOURS
  randPalette = palettes[int(random(palettes.length))].map(e => hexToRgbWithOpacity(e, opacity));

  // SIZE
  // r = 0.03*width;
  r = random(0.001,0.03)*min(width, height); // Note: 1% of width consistently gave the best butterfly-like results
  D = 2*r;
  
  // NUMBER OF MOVERS
  n = int(random(30, 60));

  // BOUNDARIES
  walls = [
    new Wall(margin, margin, 0.5*width - margin/2, margin),
    new Wall(0.5*width - margin/2, margin, 0.5*width - margin/2, 0.5*height - margin/2),
    new Wall(0.5*width - margin/2, 0.5*height - margin/2,margin,0.5*height - margin/2),
    new Wall(margin,0.5*height - margin/2, margin, margin)

  ]

  // INIT MOVERS
  // try to make sure the mover sits inside the sector
  let x = random(margin+r, width/2-margin-3*r) ;
  let y = random(margin+r, height/2 - margin-3*r) ;
  for(let i = 0; i < n; i++){
    // movers.push(new Mover(random(width),random(height)));
    // movers.push(new Mover(random(margin+r, width/2 - margin/2- r), random(margin+r, height/2 - margin/2 - r)));
    movers.push(new Mover(x + random(-3*r, 3*r), y+ random(-3*r, 3*r)))
      // random(margin+2*overlap*r, width/2 - margin/2 - 2*overlap*r),
      // random(height/4, height/2 - margin - 2*overlap*r))
      
  }
  imageMode(CENTER);
  background(0);

  boxS = width/3
  boxMargin = (height - width)/4;
  rectMode(CENTER);
}

function draw() {


  if(DEBUGMODE) debugLayer.background(0);
  debugLayer.stroke(255);
  debugLayer.noFill();
  if(DEBUGMODE) showWalls(debugLayer);
  handleMoverInteraction()
  

  overlap = random(0,1);
  
  stroke(255);
  for(let m of movers){
    m.update();
    for(let w of walls){
      // let midPointS = p5.Vector.lerp(m.p, w.start, 0.5);
      // let midPointE = p5.Vector.lerp(m.p, w.end, 0.5);
      // text(round(p5.Vector.dist(w.start, m.p),2), midPointS.x, midPointS.y);
      // text(round(p5.Vector.dist(w.end, m.p),2), midPointE.x, midPointE.y);
      // line(m.p.x, m.p.y, w.start.x, w.start.y);
      // line(m.p.x, m.p.y, w.end.x, w.end.y);
      bounce(w, m);
    }
    if(DEBUGMODE){
      m.show(debugLayer);
      showOverlap(debugLayer,chosenOverlapMode);
      
    }
  }
  

  if(!DEBUGMODE){
    showOverlap(showLayer, chosenOverlapMode);
    push();
    translate(width/2, height/2);
    image(showLayer,0,0);
    scale(-1,1);
    image(showLayer,0,0);
    scale(1,-1);
    image(showLayer,0,0);
    scale(-1,1);
    image(showLayer,0,0);
    pop();
    return;
  }
  push();
  translate(width/2,height/2);
  image(debugLayer, 0, 0);
  pop();
}

function drawArrow(layer, x,y, heading, mag){
  layer.push();
  layer.translate(x,y);
  layer.rotate(heading);
  layer.line(0, 0, mag, 0);
  layer.line(mag, 0, mag - mag/4, -mag/4);
  layer.line(mag, 0, mag - mag/4, mag/4);
  layer.pop();
}

function showWalls(layer){
  layer.stroke(255);
  for(let w of walls){
    w.show(layer);
  }
}

function handleMoverInteraction(){
  stroke(255, 10);
  for(let i = 0; i < movers.length; i++){
    for(let j = i; j < movers.length; j++){
      if(i === j) continue;
      let d = p5.Vector.dist(movers[i].p, movers[j].p)
      if(d < 2*r){
        let fMag = map(d, 0, 2*r, fMax, 0);
        let f = p5.Vector.sub(movers[i].p, movers[j].p);
        movers[i].applyForce(f.setMag(fMag)); // applyForce
        movers[j].applyForce(f.mult(-1)); // apply the reverse to j
      }
    }
  }
}

function showOverlap(layer, mode){   
  for(let i = 0; i < movers.length; i++){
    for(let j = i; j < movers.length; j++){
      if(i === j) continue;
      let d = p5.Vector.dist(movers[i].p, movers[j].p)
      if(d < 2*r){
        layer.stroke(movers[i].c);
        // if(DEBUGMODE){
        //   strokeWeight(2);
        //   layer.stroke(0,255,0,200);
        // } 
        switch(mode){
          case interactionModes.CENTREMODE:
            showOverlapLineBetweenCenters(layer, movers[i].p, movers[j].p);
            break;
          case interactionModes.CHORDMODE:
            showOverlapChord(layer, movers[i].p, movers[j].p);
            break;
        }
      }
    }
  }
    
  
}

function showOverlapLineBetweenCenters(layer,posA, posB){
  layer.line(posA.x, posA.y, posB.x, posB.y);
}

function showOverlapChord(layer,posA, posB){
	let d = p5.Vector.dist(posA,  posB);
	if(d > D) return;
	let aSys = p5.Vector.sub(posB, posA).heading(); // get the heading from A to B
	let a = acos(d/D);
	layer.push();
	layer.translate(posA.x, posA.y);
	layer.rotate(aSys); // for simplicity, rotate the system so that posB is always to the right of posA
	// if(debugMode){
	// 	layer.line(0, 0, r*cos(a), r*sin(a));
	// 	layer.line(0, 0, r*cos(a), r*sin(-a));
	// }
	layer.line(r*cos(a), r*sin(a), r*cos(a), r*sin(-a)); // drawing a line between the points of intersection
	layer.pop();
}


function drawNormal(layer, wall, mover){
  let ap = p5.Vector.sub(mover.p, wall.start);
  let ab = p5.Vector.sub(wall.end, wall.start);
  ab.normalize();
  ab.mult(ap.dot(ab));
  let normal = p5.Vector.add(wall.start, ab);
  layer.line(mover.p.x, mover.p.y, normal.x, normal.y);
}


function bounce(wall, mover){
  // scalar projection to get the distance to the wall
  let ap = p5.Vector.sub(mover.p, wall.start);
  let ab = p5.Vector.sub(wall.end, wall.start);
  ab.normalize();
  ab.mult(ap.dot(ab));
  let normal = p5.Vector.add(wall.start, ab); // scalar projection point
  let d = p5.Vector.dist(mover.p, normal); // how far from the wall?

  let reflectionVector = createVector(-ab.y, ab.x); // the normal vector to the wall
  
  let inBoundsOfWall = p5.Vector.dist(wall.start, mover.p) < wall.wallLength && p5.Vector.dist(wall.end, mover.p) < wall.wallLength;
  if(d < overlap*r && inBoundsOfWall){ // is we're inside some threshold...
    wall.isHit = true;
    mover.v.reflect(reflectionVector)
  } else{
    wall.isHit = false;
  }
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
  if(key === 'd' || key === 'D'){
    DEBUGMODE = !DEBUGMODE;
    console.log(`Debug Mode: ${DEBUGMODE}`);
    background(0);
  }
  
}

function mousePressed(){
  movers = [];
  setup();
}




