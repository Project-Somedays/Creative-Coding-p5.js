const colours = [
  ['#d9ed92', '#b5e48c', '#99d98c', '#76c893', '#52b69a', '#34a0a4', '#168aad',' #1a759f', '#1e6091', '#184e77'],
['#f72585', '#b5179e', '#7209b7', '#560bad', '#480ca8', '#3a0ca3', '#3f37c9', '#4361ee', '#4895ef', '#4cc9f0'],
[ '#7400b8', '#6930c3', '#5e60ce', '#5390d9', '#4ea8de',' #48bfe3', '#56cfe1', '#64dfdf', '#72efdd',' #80ffdb'],
['#355070', '#6d597a', '#b56576', '#e56b6f', '#eaac8b'],
['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1'],
['#ff6d00', '#ff7900', '#ff8500', '#ff9100', '#ff9e00', '#240046', '#3c096c', '#5a189a', '#7b2cbf', '#9d4edd'],
['#007f5f', '#2b9348', '#55a630', '#80b918', '#aacc00', '#bfd200', '#d4d700', '#dddf00', '#eeef20', '#ffff3f'],
['#ff4800', '#ff5400', '#ff6000', '#ff6d00', '#ff7900', '#ff8500', '#ff9100', '#ff9e00', '#ffaa00', '#ffb600'],
['#d81159', '#8f2d56', '#218380', '#fbb13c', '#73d2de'],
["#390099","#9e0059","#ff0054","#ff5400","#ffbd00"]
];
// let colours = ;
let capture;
const canvasID = 'canvas'
const frameLimit = 600;
const opacity = 15;
const maxSpawnWiggle = 0.15;
const maxSpawnFreq = 5;
let spawnWiggleAmp;
let spawnWiggleFreq;


let swarm = [];
let n;
let maxR;
let minR;

let D, r;

let selectedPalette;

function setup() {
//   createCanvas(windowWidth, windowHeight);
  let canvas = createCanvas(1080, 1920, P2D);
  n = int(random(25,150));
  spawnWiggleAmp = random(-maxSpawnWiggle, maxSpawnWiggle);
  spawnWiggleFreq = random(-maxSpawnFreq,maxSpawnFreq);
  maxR = 3*height/n;
  minR = 2*height/n;
  canvas.id(canvasID);
  capture = new CCapture({
	format : 'png',
	name : 'capture'
  });

  pixelDensity(1);
  selectedPalette = random(colours);
	D = 2*maxR;
	r = maxR;
	// swarm.push(new Mover(width/4, height/2 - 100, cos(PI/6), sin(PI/6)));
	// swarm.push(new Mover(width/4, height/2 + 100, cos(-PI/6), sin(-PI/6)));
	for(let i = 0; i < n; i++){
		// let x = random(width/3, 2*width/3);
		let y = random(height);
    	let x = width/2 + spawnWiggleAmp*width*cos(spawnWiggleFreq*map(y, 0, height, 0, TWO_PI));
		let a = random(TWO_PI);
		let velX = cos(a);
		let velY = sin(a);
		let col = hexToRGBA(random(selectedPalette),opacity);
		let r = random(minR, maxR);
		swarm.push(new Mover(x,y, velX, velY, col, r));
		
	}
	noFill();
	stroke(255, 2);
	strokeWeight(2);
	background(0);
						 
	// for(let i = 0; i < n; i++){
	// 	swarm.push(new Mover(width/2, height/2, random(), random()));
	// }

	
}

function draw() {
	if(frameCount === 1) capture.start();
	if(frameCount > frameLimit){
		noLoop();
		capture.stop()
		capture.save();
		console.log("End of animation! Saving now...")
		return;
	}
	// console.log(frameCount);
	
	// background(0);
	for(let i = 0; i < swarm.length; i++){
		swarm[i].update();
		// swarm[i].show();
	}
	
	// check connections between all other swarm members
	for(let i = 0; i < swarm.length; i++){
		for(let j = i; j < swarm.length; j++){
			// ignore self checks
			if(i === j){
				continue;
			}
			// touching?
			let separation = p5.Vector.dist(swarm[i].pos, swarm[j].pos);
			let rSum = swarm[i].r + swarm[j].r
			if(separation < rSum){
				// stroke(hexToRGBA(swarm[i].colour, 3));
				stroke(swarm[i].colour);
				overlap(swarm[i].pos, swarm[j].pos); // draw the chord of points of intersection
				// apply a Force
				let dir = p5.Vector.sub(swarm[i].pos, swarm[j].pos);
				let mag = map(separation, 0, rSum, 0.25, 0); // apply maxForce when the separation is zero and minForce when separation is at the limit of interaction
				swarm[i].applyForce(dir.setMag(mag));
				let oppDir = p5.Vector.sub(swarm[j].pos, swarm[i].pos);
				swarm[j].applyForce(oppDir.setMag(mag));
			}
		}
	}

	capture.capture(document.getElementById(canvasID));
}

class Mover{
	constructor(x, y, velX, velY, colour, r){
		this.pos = createVector(x,y);
		this.vel = createVector(velX, velY).normalize(); // additional control
		this.acc = createVector(0,0);
		// this.colour = random(colours);
		this.colour = colour;		
		this.r = r;
	}
	
	applyForce(f){
		this.acc.add(f);
	}
	
	update(){
		this.pos.add(this.vel);
		this.vel.add(this.acc);
		if(this.vel.mag() > 1){
			this.vel.setMag(1);
		}
		this.acc.mult(0);
		// this.wrap();
		// this.bounce();
	}
	
	wrap(){
		if(this.pos.x < 0){
			this.pos.x = width;
		}
		if(this.pos.x > width){
			this.pos.x = 0;
		}
		if(this.pos.y < 0){
			this.pos.y = height;
		}
		if(this.pos.y > height){
			this.pos.y = 0;
		}
	}
	
	bounce(){
		// if(this.pos.x > width || this.pos.x < 0){
		// 	this.vel.x = -this.vel.x;
		// }
		// if(this.pos.y > height || this.pos.y < 0){
		// 	this.vel.y = -this.vel.y;
		// }
	}
	
	show(){
		ellipse(this.pos.x, this.pos.y, 2*r, 2*r);
	}
}

function overlap(posA, posB){
	let d = p5.Vector.dist(posA,  posB);
	if(d > D) return;
	let aSys = p5.Vector.sub(posB, posA).heading(); // get the heading from A to B
	let a = acos(d/D);
	push();
	translate(posA.x, posA.y);
	rotate(aSys); // for simplicity, rotate the system so that posB is always to the right of posA
	if(debugMode){
		line(0, 0, r*cos(a), r*sin(a));
		line(0, 0, r*cos(a), r*sin(-a));
	}
	line(r*cos(a), r*sin(a), r*cos(a), r*sin(-a)); // drawing a line between the points of intersection
	pop();
}


function hexToRGBA(hex, alpha) {
  // Remove the hash character if present
  hex = hex.replace('#', '');

  // Parse the hex values for red, green, and blue
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Create a p5 color object with the specified alpha
  const col = color(r, g, b);
  col.setAlpha(alpha);

  return col;
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    save(getSketchName() + "_####.png");
  }
}

function getSketchName() {
  // Extract the sketch name from the URL
  let urlTokens = split(window.location.href, '/');
  let sketchName = urlTokens[urlTokens.length - 1];
  
  // Remove the ".html" extension if present
  sketchName = sketchName.replace('.html', '');
  
  return sketchName;
}

function getCurrentDateTime() {
    const now = new Date();
    
    const year = now.getFullYear();
    
    // Months are zero-based, so add 1 to get the current month
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    const day = String(now.getDate()).padStart(2, '0');
    
    const hours = String(now.getHours()).padStart(2, '0');
    
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}_${hours}-${minutes}`;
}

console.log(getCurrentDateTime());