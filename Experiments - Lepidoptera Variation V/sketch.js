/*
Author: Project Somedays
Date: 2024-03-20
Title: Experiments - Lepidoptera Variation 5

Taking inspiration from Casey Reas' work. Movers bounce around in box.
Where they overlap:
  1. Push each other apart with a force inversely proportion to their distance
  2. Draw a line between their centres

Tiling the outputs and playing with different translations/rotational symmetries
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
let chosenInteractionMode;

let DEBUGMODE = true;

// COLOURS
let randPalette;

// MOVERS AND CONSTRAINTS
let rows;
let movers = [];
let n;
let r;
let walls = [];
let fMax = 0.25;
let overlap = 1;

// LAYERS
let debugLayer;
let povLayer;

function setup(){
createCanvas(1080, 1920);
background(0);


// LAYERS
rows = 4;
debugLayer = createGraphics(width,height/rows);
povLayer = createGraphics(width, height/rows);

// MOVERS
n = int(random(30, 60));
r = random(0.01*width, 0.05*width);
D = 2*r;
generateMovers();
generateWalls();

// VISUALS
chosenInteractionMode = interactionModes.CHORDMODE;
opacity = 255;
randPalette = random(palettes).map(e => hexToRGBA(e, opacity));

}


function draw(){
  debugLayer.background(0);
  for(let m of movers){
    for(let w of walls){
      bounce(w, m);
    }
    m.update();
    if(DEBUGMODE) m.show(debugLayer);
  }
  handleMoverInteraction()
  showOverlap(debugLayer, chosenInteractionMode);
  image(debugLayer,0,0);


}


function generateWalls(){
  walls = [];
  walls.push(new Wall(0,0,width,0));
  walls.push(new Wall(width,0,width,height/rows));
  walls.push(new Wall(width,height/rows,0,height/rows));
  walls.push(new Wall(0,height/4,0,0));
}

function generateMovers(){
  for(let i = 0; i < n; i++){
    movers.push(new Mover(random(width), random(height)));
  }
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


function hexToRGBA(hex, opacity) {
  // Extract RGB components from hex value
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  
  // Ensure opacity is within valid range
  opacity = constrain(opacity, 0, 255);
  
  // Return RGBA color string
  return color(r,g,b,opacity);
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