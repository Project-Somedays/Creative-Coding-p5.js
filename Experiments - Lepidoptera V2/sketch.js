/*
Author: Project Somedays
Date: 2024-03-13
Title: Experiments - Lepidoptera

Taking inspiration of Casey Reas' work, movers bounce around in a sector of a polygon
Where they overlap:
  1. Push each other apart with a force inversely proportion to their distance
  2. Draw a line between their centres

Opportunities/TODO's:
  - Lock down escapees hahah 
  - Clean up drawComparison
  - Set variables with sliders etc

Updates:
2024-03-14
  - restructured to clean up debug/persistene of vision logic but with other drawbacks... Don't love how I've ended up mixing up interaction functions with showing functions in Mover class... More thought required.
  - Added global rotation! This I do like =)
*/

let palettes = [
  ['#ffffff'],
  ['#f72585', '#b5179e', '#7209b7', '#560bad', ' #480ca8', '#3a0ca3', '#3f37c9', '#4361ee', '#4895ef', '#4cc9f0'],
  ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000', '#dc2f02', '#e85d04', ' #f48c06', '#faa307', '#ffba08'],
  ['#d9ed92', '#b5e48c', '#99d98c', '#76c893', '#52b69a', '#34a0a4', '#168aad', '#1a759f', '#1e6091', '#184e77'],
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
  CENTREMODE: Symbol("CENTREMODE"),
  CHORDMODE: Symbol("CHORDMODE")
}

let viewMode = {
  VIEWSINGLE: Symbol("VIEWSINGLE"),
  VIEWCOMPARISON: Symbol("VIEWCOMPARISON")
}

let chosenViewMode;
let randPalette;
let walls = []
let r, D; // radius of the mover
let R; // Radius of the polygon cage
let opacity;

let DEBUGMODE = false;
let debugPt, povPt;

let movers = [];
let n; // how many movers?
let fMax = 0.25; // how strongly should the push away
let segments; // how many rotational symmetries?
let overlap = 0.25; // how much can each mover move into the next sector of the polygon
let drawLayer, povLayer, debugLayer, drawLayer2;
let globalA = 0;
let globalARate = 0.001;
let canvas;

let test;
let mTest;

let chosenOverlapMode;
let substeps = 5;

function setup() {
  // canvas = createCanvas(windowWidth, windowHeight, P2D);
  canvas = createCanvas(1080,1080);
  drawLayer = createGraphics(width, height);
  povLayer = createGraphics(width, height);
  debugLayer = createGraphics(width, height);
  drawLayer2 = createGraphics(width, height);
  // R = 0.55 * min(width, height);
  R = sqrt(2)*width;

  test = new Mover(width / 2, height / 2);
  mTest = new Mover(mouseX, mouseY);

  // if landscape, go side by side. In portrait, stack.
  if (width > height) {
    debugPt = createVector(0.05 * width, 0.5 * height);
    povPt = createVector(0.5 * width, 0.5 * height);
  } else {
    debugPt = createVector(0.05 * width, 0.3 * height);
    povPt = createVector(0.05 * width, 0.7 * height);
  }

  chosenOverlapMode = interactionModes.CHORDMODE;
  chosenViewMode = viewMode.VIEWCOMPARISON;


  imageMode(CENTER);

  // HOW SHOULD THE OVERLAP BE SHOWN?


  // SETTING ANIMATION VARIABLES ---> Make into sliders?
  opacity = int(random(50, 100));
  // opacity = 255;

  // COLOURS
  randPalette = random(palettes).map(e => hexToRgbWithOpacity(e, opacity));

  // SIZE
  // r = 0.025*width;
  r = random(0.0075, 0.05) * min(width, height); // Note: 1% of width consistently gave the best butterfly-like results
  // r = random(0.025, 0.1)*width;
  D = 2 * r;

  // NUMBER OF MOVERS
  n = int(random(60, 100));

  

  // GEOMETRY
  // segments = 6;
  segments = int(random(3, 9));
  strokeWeight(1);

  // BOUNDARIES
  walls = [
    new Wall(0, 0, R * cos(-PI / segments), R * sin(-PI / segments)),
    new Wall(0, 0, R * cos(PI / segments), R * sin(PI / segments)),
    new Wall(R * cos(-PI / segments), R * sin(-PI / segments), R * cos(PI / segments), R * sin(PI / segments))
  ]

  // INIT MOVERS
  // try to make sure the mover sits inside the sector
  for (let i = 0; i < n; i++) {
    let a = random(-PI / (segments * 1.5), PI / (segments * 1.5));
    let x = random(0.3 * R, 0.8 * R) * cos(a);
    let y = random(0.3 * R, 0.8 * R) * sin(a);
    movers.push(new Mover(x, y));
  }

  background(0);
  // drawLayer.background(0);
  debugLayer.background(0);

  console.log(`Is debugMode? ${DEBUGMODE}`);

}

function draw() {

  for(let i = 0; i < substeps; i++){
    handleMoverInteraction(debugLayer);
    for (let m of movers) {
      for (let w of walls) {
        bounce(w, m);
      }
      m.update();
    }
    drawLayer.push();
    drawLayer.translate(width / 2, height / 2);
    showOverlap(drawLayer, chosenOverlapMode); // show all sectors
    drawLayer.pop();
  }
  


  if (DEBUGMODE) {
    imageMode(CORNER);
    // DEBUG BIZ
    debugLayer.background(0);
    debugLayer.strokeWeight(2);
    debugLayer.stroke(255);
    debugLayer.push();
    debugLayer.translate(debugPt.x, debugPt.y);
    debugLayer.scale(1.5);
    debugLayer.noFill();
    // debugLayer.circle(0,0, 400);
    handleMoverInteraction(debugLayer);
    showOverlap(debugLayer, chosenOverlapMode);
    showWalls(debugLayer);
    for (let m of movers) {
      m.show(debugLayer);
    }
    debugLayer.pop();
    image(debugLayer, 0, 0);

    // PERSISTENCE OF VISION BIZ
    povLayer.push();
    povLayer.translate(povPt.x, povPt.y);
    povLayer.scale(1.5);
    showOverlap(povLayer, chosenOverlapMode);
    povLayer.pop();

    image(povLayer, 0, 0);
    return;
  }

  // drawComparison();
  
  image(drawLayer, width/2, height/2);
  //   case viewMode.VIEWCOMPARISON:
      
  //     break;
  // }


  // globalA -= globalARate; 
}

function drawComparison() {
  drawLayer.push();
  drawLayer.translate(width / 2, height / 2);
  showOverlap(drawLayer, chosenOverlapMode); // show all sectors
  drawLayer.pop();

  drawLayer2.push();
  drawLayer2.translate(width / 2, height / 2);
  showOverlap(drawLayer2, interactionModes.CHORDMODE);
  drawLayer2.pop();

  push();
  if (height > width) {
    translate(width / 2, height / 4);
  } else {
    translate(width / 4, height / 2);
  }
  scale(0.8); // move to the middle of the screen
  rotate(globalA);
  imageMode(CENTER);
  image(drawLayer, 0, 0);
  pop();

  push();
  if (height > width) {
    translate(width / 2, 3 * height / 4);
  } else {
    translate(3 * width / 4, height / 2);
  }
  scale(0.8);
  rotate(globalA);
  image(drawLayer2, 0, 0);
  pop();

}

function drawArrow(layer, x, y, heading, mag) {
  layer.push();
  layer.translate(x, y);
  layer.rotate(heading);
  layer.line(0, 0, mag, 0);
  layer.line(mag, 0, mag - mag / 4, -mag / 4);
  layer.line(mag, 0, mag - mag / 4, mag / 4);
  layer.pop();
}

function showWalls(layer) {
  layer.stroke(255);
  for (let w of walls) {
    w.show(layer);
  }
}

function handleMoverInteraction(layer) {
  stroke(255, 10);
  for (let i = 0; i < movers.length; i++) {
    for (let j = i; j < movers.length; j++) {
      if (i === j) continue;
      let d = p5.Vector.dist(movers[i].p, movers[j].p)
      if (d < 2 * r) {
        let fMag = map(d, 0, 2 * r, fMax, 0);
        let f = p5.Vector.sub(movers[i].p, movers[j].p);
        movers[i].applyForce(layer, f.setMag(fMag)); // applyForce
        movers[j].applyForce(layer, f.mult(-1)); // apply the reverse to j
      }
    }
  }
}

function showOverlap(layer, mode) {

  for (let k = 0; k < segments; k++) {
    if (DEBUGMODE && k > 0) continue; // only draw the one segment's worth in debugMode
    layer.push();
    layer.rotate(k * TAU / segments);
    for (let i = 0; i < movers.length; i++) {
      for (let j = i; j < movers.length; j++) {
        if (i === j) continue;
        let d = p5.Vector.dist(movers[i].p, movers[j].p)
        if (d < 2 * r) {
          layer.stroke(movers[i].c);
          if (DEBUGMODE) {
            layer.strokeWeight(2);
            layer.stroke(0, 255, 0, 200);
          }
          switch (mode) {
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
    layer.pop();
  }
}

function showOverlapLineBetweenCenters(layer, posA, posB) {
  layer.line(posA.x, posA.y, posB.x, posB.y);
}

function showOverlapChord(layer, posA, posB) {
  let d = p5.Vector.dist(posA, posB);
  if (d > D) return;
  let aSys = p5.Vector.sub(posB, posA).heading(); // get the heading from A to B
  let a = acos(d / D);
  layer.push();
  layer.translate(posA.x, posA.y);
  layer.rotate(aSys); // for simplicity, rotate the system so that posB is always to the right of posA
  // if(debugMode){
  // 	layer.line(0, 0, r*cos(a), r*sin(a));
  // 	layer.line(0, 0, r*cos(a), r*sin(-a));
  // }
  layer.line(r * cos(a), r * sin(a), r * cos(a), r * sin(-a)); // drawing a line between the points of intersection
  layer.pop();
}


function drawNormal(layer, wall, mover) {
  let ap = p5.Vector.sub(mover.p, wall.start);
  let ab = p5.Vector.sub(wall.end, wall.start);
  ab.normalize();
  ab.mult(ap.dot(ab));
  let normal = p5.Vector.add(wall.start, ab);
  layer.line(mover.p.x, mover.p.y, normal.x, normal.y);
}


function bounce(wall, mover) {
  // scalar projection to get the distance to the wall
  let ap = p5.Vector.sub(mover.p, wall.start);
  let ab = p5.Vector.sub(wall.end, wall.start);
  ab.normalize();
  ab.mult(ap.dot(ab));
  let normal = p5.Vector.add(wall.start, ab); // scalar projection point
  let d = p5.Vector.dist(mover.p, normal); // how far from the wall?

  let reflectionVector = createVector(-ab.y, ab.x); // the normal vector to the wall


  if (d < overlap * r) { // is we're inside some threshold...
    wall.isHit = true;
    mover.v.reflect(reflectionVector)
  } else {
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


function keyPressed() {
  if (key === 'd' || key === 'D') {
    DEBUGMODE = !DEBUGMODE;
    // console.log(`Debug Mode: ${debugMode}`);
    background(0);
  }
  if(key === ' '){
    save("output.png");
  }

}

function mousePressed() {
  movers = [];
  setup();
}




