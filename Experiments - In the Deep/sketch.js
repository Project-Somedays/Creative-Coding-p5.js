/*
Author: Project Somedays
Date: Originally uploaded 2023-12-12. Adjusted 2024-03-06.
Revisiting an old project: Perlin Noise-driven brush painting over randomly distributed circles

Draws chord of intersection points wherever they overlap
Definitely a nod to Casey Reas' work. He drew lines between the circles' centres.
It was VERY satisfying working out that maths for drawing that chord instead.

I imagine this is what Pearl Diver's experience? If the pearls were just loose and not, you know, in oysters.
Maybe divers finding Pirate treasure?
*/

// control variables
const brushN = 10;
const globalNoiseStep = 0.01; // how jerky are the brushes
const pearlCount = 250;
const bgColour = '#0D1126'; // "chinese black"... who names these things?

// tracking varaibles
let D, r;
let pearlField = [];
let brush;
let xOff; 
let yOff;
let globalNoiseOffset = 0;

// debugMode variables/objects
let testPos;
let testBrush;
let brushes = [];

const debugStates = Object.freeze({
  SPARTAN : Symbol("Spartan"),
  ILLUSTRATIVE : Symbol("Illustrative"),
  OFF : Symbol("Off")
})

const debugPhaseOrder = [debugStates.SPARTAN, debugStates.ILLUSTRATIVE, debugStates.OFF];
let debugPhase = 0;
let debugMode = debugPhaseOrder[debugPhase];


function setup() {
	// createCanvas(windowHeight, windowHeight);
  createCanvas(1080, 1920, P2D);
	D = width/10;
	r = D/2;
	xOff = random(1000);
	yOff = random(1000);
	generatePearlField();

  for(let i = 0; i < brushN; i++){
    brushes.push(new Brush());
  }
  testBrush = createVector(mouseX, mouseY);
  testPos = createVector(width/2, height/2);

	noFill();

	background(bgColour); 
	stroke(255, 5);
	
}

function draw() {
  switch(debugMode){
    case debugStates.SPARTAN: // draws just the test brush
      background(bgColour);  
      stroke(255);
      strokeWeight(5);
      testBrush.set(mouseX, mouseY);
      circle(testBrush.x, testBrush.y, 3*D);
		  circle(testPos.x, testPos.y, 3*D);
      overlap(testPos, testBrush, 3*D); // show test overlap
      return;

    case debugStates.ILLUSTRATIVE: // draws the field and the brushes, but not cumulatively
      background(bgColour);
      stroke(255);
      for(let b of brushes){
        b.update();
        strokeWeight(1);
        for(let p of pearlField){
          circle(p.x, p.y, D); // show the 'pearls'
          overlap(p, b.p, D); // show the overlap
        }
        strokeWeight(5);
        b.show();
      }
      break;
    case debugStates.OFF: // does the doings
      stroke(255, 5);
        // drawing the overlapsd
      for(let b of brushes){
        b.update();
        for(let i = 0; i < pearlField.length; i++){
          overlap(pearlField[i], b.p, D);
        }
      }
      
      break;
  }

	

  

	// ellipse(brush.x, brush.y, D, D);
	globalNoiseOffset += globalNoiseStep
	
	
	

}

function generatePearlField(){
  pearlField = [];
  for(let i = 0; i < pearlCount; i++){
		pearlField.push(createVector(random(width), random(height)));
	}
}

function overlap(posA, posB, thresholdD){
	let d = p5.Vector.dist(posA,  posB); // check the distribution
	if(d > thresholdD) return;
	let aSys = p5.Vector.sub(posB, posA).heading(); // get the heading from A to B
	let a = acos(d/thresholdD);
	push();
	translate(posA.x, posA.y);
	rotate(aSys); // for simplicity, rotate the system so that posB is always to the right of posA
	if(debugMode !== debugStates.OFF ){
		line(0, 0, 0.5*thresholdD*cos(a), 0.5*thresholdD*sin(a));
		line(0, 0, 0.5*thresholdD*cos(a), 0.5*thresholdD*sin(-a));
	}
	line(0.5*thresholdD*cos(a), 0.5*thresholdD*sin(a), 0.5*thresholdD*cos(a), 0.5*thresholdD*sin(-a)); // drawing a line between the points of intersection
	pop();
}

function keyPressed(){
  // cycle the debugPhases
	if(key === 'd'){
		debugPhase = (debugPhase + 1)%debugPhaseOrder.length;
    debugMode = debugPhaseOrder[debugPhase];
    console.log(debugMode);
    background(bgColour);
	} else if(key === 'r'){
    background(bgColour);
    generatePearlField();
  }
}

class Brush{
  constructor(){
    this.p = createVector(0,0);
    this.nXOff = random(10000);
    this.nYOff = random(10000);
  }

  update(){
    let x = map(noise(this.nXOff + globalNoiseOffset), 0, 1, -0.1*width, 1.1*width);
    let y = map(noise(this.nYOff + globalNoiseOffset), 0, 1, -0.1*height, 1.1*height);
    this.p.set(x,y);
  }

  show(){
    circle(this.p.x, this.p.y, D);
  }
}