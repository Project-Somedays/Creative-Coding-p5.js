let wrapMode = false;
let bounceMode = false;

let colours = ['#d9ed92', '#b5e48c', '#99d98c', '#76c893', '#52b69a', '#34a0a4', '#168aad',' #1a759f', '#1e6091', '#184e77'];
// let colours = [ '#7400b8', '#6930c3', '#5e60ce', '#5390d9', '#4ea8de',' #48bfe3', '#56cfe1', '#64dfdf', '#72efdd',' #80ffdb'];

let swarm;
let n = 100;
let maxR = 50;
let minR = 50;
let D, r;

// let colours = ["#390099","#9e0059","#ff0054","#ff5400","#ffbd00"]

function setup() {
	createCanvas(windowWidth, windowHeight);
  swarm = []; // start fresh with each setup
	D = 2*maxR;
	r = maxR;
	// swarm.push(new Mover(width/4, height/2 - 100, cos(PI/6), sin(PI/6)));
	// swarm.push(new Mover(width/4, height/2 + 100, cos(-PI/6), sin(-PI/6)));
	for(let i = 0; i < n; i++){
		let x = random(width);
		let y = height/2;
		let a = random(TWO_PI);
		let velX = cos(a);
		let velY = sin(a);
		let col = hexToRGBA(random(colours),5);
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
  if (key === ' ') {
    setup();
  }
}