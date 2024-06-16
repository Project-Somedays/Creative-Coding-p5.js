/*
Author: Project Somedays
Date: 2024-06-01 updated 2024-06-02
Title: Rorschach/Kaleido Generator

Saw the combo of filter(BLUR) filter(THRESHOLD) to get that pseudo-metaball effect on SableRaph's stream: https://www.twitch.tv/videos/2157524282
Thought I'd have a play

Palette: https://coolors.co/palettes/trending

Bouncing around movers inside a bounding box. Rotational symmetry for the win.

Instructions:
Click to generate your final image and press space to save.
Be patient. The post-processing takes a while.

TODOS/OPPORTUNITIES
DONE: Replace colours from a palette
DONE: User chooses number of segments
DONE: Change size depending on size of wedge
TODO: Draw to a buffer canvas to get higher res image
TODO: Vertical symmetry only to get the Rorschach effect
TODO: User chooses colourA, colourB

*/

let walls = [];
let movers = new Array(20);
let overlap = 1.1;
let segments = 12;
let R;
let cnv;
let isLooping = true;

let frames = 90;

let palette = "#ffbe0b, #fb5607, #ff006e, #8338ec, #3a86ff".split(", ");

function setup() {
  // createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
  createCanvas(1080,1080);
  pixelDensity(1);
  imageMode(CENTER);
  // cnv = createGraphics(width, height);
  // cnv.noStroke();
  // cnv.fill(255);
  noStroke();
  fill(255);
  
  R = 0.8*min(width, height);
  walls = generateWedges(segments);
  let n = 100;
  let moverSize = random(0.5,1.5)*25*width/(segments*n);
  movers = insertNMoversIntoWedges(100,segments,moverSize); // 80% are circles, 20% squares
  // walls = makeBoundingBox(0,0,width/2, height);
  // movers = insertNMoversIntoBoundingBox(50, 0,0,width/2, height);
  }
  

function draw() {
  background(0);
  
  // if(frameCount%frames === 0){
  //   postProcessImage();
  //   replaceWhiteBlackPixels();
  // } else if(frameCount % frames === 1){
  //   segments --;
  //   setup();
  // }
  // cnv.push();
  // cnv.translate(width/2, height/2);
  push();
  translate(width/2, height/2);
  for(let m of movers){
    m.update();
    for(let i = 0; i < segments; i++){
      push();
      rotate(i*TWO_PI/segments);
      m.show();
      pop();
    }
    for(let w of walls){
      bounce(w, m, false);
    }
  }
  pop();


  if(!isLooping){
    console.log("Process");
    postProcessImage();
    let colourA = random(palette);
    let colourB = random(palette.filter(e => e !== colourA)); // ensures different
    replaceWhiteBlackPixels(colourA, colourB);
    noLoop();
  }

}


//################# Wall Creation ####################//
function generateWedges(segments){
  return [
    new Wall(0,0,R*cos(-PI/segments), R*sin(-PI/segments)),
    new Wall(0,0,R*cos(PI/segments), R*sin(PI/segments)),
    new Wall(R*cos(-PI/segments), R*sin(-PI/segments), R*cos(PI/segments), R*sin(PI/segments))
  ]
}

function makeBoundingBox(tlx, tly, w, h){
  let walls = [];
  walls.push(new Wall(tlx, tly,tlx + w, tly+h));
  walls.push(new Wall(tlx + w,tly,tlx + w,tly + h));
  walls.push(new Wall(tlx + w,tly + h, tlx, tly + h));
  walls.push(new Wall(tlx, tly + h,tlx, tly));
  return walls;
}

//################# Mover Creation ####################//

const insertNMoversIntoBoundingBox = (n, tlx, tly, w, h) => new Array(n).fill(new Mover(random(tlx, tlx + w), random(tly, tly + h), width/30, random(1) < 0.8));

function insertNMoversIntoWedges(n, segments, baseSize){
  // try to make sure the mover sits inside the sector
  let movers = [];
  for(let i = 0; i < n; i++){
    let a = random(0.8*-PI/segments, 0.8*PI/segments);
    let x = random(0.3*R, 0.8*R)*cos(a);
    let y = random(0.3*R, 0.8*R)*sin(a);
    let isCircle = random(1) < 0.8;
    movers.push(new Mover(x,y, baseSize, isCircle));
  }
  return movers;
}

//################# Wall/Mover Interaction ####################//
function bounce(wall, mover, showMode = false){
  // scalar projection to get the distance to the wall
  let ap = p5.Vector.sub(mover.p, wall.start);
  let ab = p5.Vector.sub(wall.end, wall.start);
  ab.normalize();
  ab.mult(ap.dot(ab));
  let normal = p5.Vector.add(wall.start, ab); // scalar projection point
  let d = p5.Vector.dist(mover.p, normal); // how far from the wall?

  let reflectionVector = createVector(-ab.y, ab.x); // the normal vector to the wall
  
  if(d < overlap*mover.s/2){ // is we're inside some threshold...
    wall.isHit = true;
    mover.v.reflect(reflectionVector)
  } else{
    wall.isHit = false;
  }
}


//################# Image Processing ####################//
function postProcessImage(){
  filter(BLUR, 6, false);
  filter(THRESHOLD, 0.1, false);
}

function replaceWhiteBlackPixels(colourA, colourB) {
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;
      let r = pixels[index];
      let g = pixels[index + 1];
      let b = pixels[index + 2];
      let a = pixels[index + 3];
      
      // Check if the pixel is white
      if (r === 255 && g === 255 && b === 255) {
        pixels[index] = red(colourA);
        pixels[index + 1] = green(colourA);
        pixels[index + 2] = blue(colourA);
        pixels[index + 3] = alpha(colourA);
      }
      
      // Check if the pixel is black
      else if (r === 0 && g === 0 && b === 0) {
        pixels[index] = red(colourB);
        pixels[index + 1] = green(colourB);
        pixels[index + 2] = blue(colourB);
        pixels[index + 3] = alpha(colourB);
      }
    }
  }
  updatePixels();
}


//################# Interactivity ####################//


function mousePressed(){
  if(mouseButton === LEFT){
      isLooping = !isLooping; // toggle
      if(isLooping) loop();   
  }
}

function keyPressed(){
  if(key === ' ') save(new Date().toString() + ".png");

  if(keyCode === UP_ARROW){
    segments ++;
    setup();
  } else if(keyCode === DOWN_ARROW){
    segments = segments - 1  === 0 ? segments : segments - 1;
    setup();
  }

  function getKeyNumber(key) {
    if (['2', '3', '4', '5', '6', '7', '8', '9'].includes(key)) {
      return parseInt(key);
    }
    return null;
  }

  let numberKey = getKeyNumber(key);
  if(numberKey){
    segments = numberKey;
    setup();
  }
}




















