/* 
Author: Project Somedays
Date: 2025-02-09
Title: Genuary 2025 Day 15 - Design a Rug

Definitely one of those ideas that was better in theory than in practice.
Spent a happy afternoon watching videos of Persian rug making and thought a *squints hard* simulation would be neat
Well, they call them p5.js sketches for a reason.
Moving on!

Gemini AI very helpful even just in debugging.
Probably going to switch from Claude for speeding up the uninteresting parts.

Oooh! Also this brings up 150 sketches! Hooray!
*/


let n = 20;
let cnv;
let lim = 0; 
let loomInstructions;
let weight = 20;
let loomBarDiam;
let rows;
let currentCol;
let currentRug;
let currentStyle = 0;
let currentPalette = 0;

function setup() {
  createCanvas(min(windowWidth, windowHeight),min(windowWidth, windowHeight), WEBGL);
  pixelDensity(1);
  loomBarDiam = height/50;
  rows = height / weight;
  noStroke();
  rectMode(CENTER);
  cnv = createGraphics(width, height);
  currentRug = generateRug(currentStyle, currentPalette);
  drawRugToCanvas(currentRug, cnv); // Draw the initial rug to cnv
  // cnv.background('#FFA500');
  // cnv.noStroke();
  // cnv.fill("#ff0000");
  // cnv.circle(cnv.width/2, cnv.height/2, cnv.width/2);

  loomInstructions = collectLoomInstructions(cnv);
  currentCol = loomInstructions[0].col;
  console.log(currentCol);
}

function draw() {
  background(0);

  rotateY(frameCount * TWO_PI/1200);
  directionalLight(255, 255, 255, 0,0,-1);
  showLoom();

  lim = (lim + 1)%loomInstructions.length;

  if(lim === 0){
    currentStyle = (currentStyle + 1) % 5;
    currentPalette = int(random(5));
    currentRug = generateRug(currentStyle, currentPalette);
    drawRugToCanvas(currentRug, cnv);
    loomInstructions = collectLoomInstructions(cnv)
  }

  
  // push();
  // translate(0,0,loomBarDiam);
  // for(let i = 0; i < lim; i++){
  //   let instr = loomInstructions[i];
  //   push();
  //   translate(instr.x, instr.y, instr.overUnder);
  //   fill(instr.col);
  //   box(weight);
  //   pop();
  // }
  // pop();
  
  
  
  
  push();
  translate(0,0,loomBarDiam);
  strokeWeight(weight);
  // stroke(currentCol);
  beginShape();
  for(let i = 0; i < lim; i++){
    let instr = loomInstructions[i];
    if(instr.col !== currentCol){
      currentCol = instr.col
      stroke(currentCol);
    }
    
    curveVertex(instr.x, instr.y, instr.overUnder)
    
  }
  endShape();
  pop();


  
  orbitControl();
  
}



function collectLoomInstructions(cnv){
  let loomInstructions = [];

  for(let y = 0; y < rows; y++){ // Start y at 0 to go from bottom to top
    for(let x = 0; x < n; x++){
      let traversalDirection = y % 2; // go back and forth
      let sampleX = traversalDirection === 0 ? x * width/n : width - x * width/n; // No more offset for x
      let sampleY = height - y*weight; // No more offset for y, start from height and subtract

      let colArray = cnv.get(sampleX, sampleY);
      loomInstructions.push({x: sampleX - width/2, y: sampleY - height/2, col: color(colArray[0], colArray[1], colArray[2], colArray[3]), overUnder: -weight + 2*weight*(x % 2)});
    }
  }
  return loomInstructions;
}


function showLoom(){
  noStroke();
  fill(255);
  push();
  translate(0,-height*0.5,0);
  rotateZ(HALF_PI);
  cylinder(height/50, width);
  pop();

  push();
  translate(0,height*0.5,0);
  rotateZ(HALF_PI);
  cylinder(height/50, width);
  pop();

  stroke(255);
  noFill();
  for(let i = 0; i <= n; i ++){
    line(-width/2 + i * width / n,-0.5*height,  height/50, -width/2 + i * width/n, 0.5*height, height/50);
  }


}

function generateRug(styleIndex, paletteIndex) {
  const n = 20; // Adjust for desired resolution (lower = more blocky)
  const weight = width / n; // Calculate block size

  const palettes = [
    [{ r: 255, g: 105, b: 180 }, { r: 75, g: 0, b: 130 }, {r: 255, g: 255, b: 255}], // Pink/Purple/White
    [{ r: 255, g: 165, b: 0 }, { r: 139, g: 69, b: 19 }, {r: 255, g: 255, b: 255}], // Orange/Brown/White
    [{ r: 0, g: 128, b: 0 }, { r: 34, g: 139, b: 34 }, {r: 255, g: 255, b: 255}], // Green/Dark Green/White
    [{ r: 0, g: 0, b: 255 }, { r: 0, g: 191, b: 255 }, {r: 255, g: 255, b: 255}], // Blue/Light Blue/White
    [{ r: 255, g: 0, b: 0 }, { r: 128, g: 0, b: 0 }, {r: 255, g: 255, b: 255}], // Red/Dark Red/White
  ];

  const palette = palettes[paletteIndex % palettes.length]; // Wrap index

  let rug = [];

  switch (styleIndex % 5) { // Wrap style index
    case 0: // Checkerboard
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const colorIndex = (x + y) % 2;
          rug.push({ x: x * weight, y: y * weight, col: color(palette[colorIndex].r, palette[colorIndex].g, palette[colorIndex].b) });
        }
      }
      break;
    case 1: // Stripes (Horizontal)
      for (let y = 0; y < n; y++) {
        const colorIndex = y % 2;
        for (let x = 0; x < n; x++) {
          rug.push({ x: x * weight, y: y * weight, col: color(palette[colorIndex].r, palette[colorIndex].g, palette[colorIndex].b) });
        }
      }
      break;
    case 2: // Stripes (Vertical)
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const colorIndex = x % 2;
          rug.push({ x: x * weight, y: y * weight, col: color(palette[colorIndex].r, palette[colorIndex].g, palette[colorIndex].b) });
        }
      }
      break;
    case 3: // Diagonal Stripes
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const colorIndex = (x + y) % 2;
          rug.push({ x: x * weight, y: y * weight, col: color(palette[colorIndex].r, palette[colorIndex].g, palette[colorIndex].b) });
        }
      }
      break;
    case 4: // Random Blocks
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const colorIndex = floor(random(2)); // Random 0 or 1
          rug.push({ x: x * weight, y: y * weight, col: color(palette[colorIndex].r, palette[colorIndex].g, palette[colorIndex].b) });
        }
      }
      break;
  }
  return rug;
}

function drawRugToCanvas(rug, cnv) {
  cnv.background('#FFA500'); // Or whatever your background color is
  cnv.noStroke();

  for (let block of rug) {
    cnv.fill(block.col);
    cnv.rect(block.x, block.y, width/20, width/20); // Or your block size
  }
}