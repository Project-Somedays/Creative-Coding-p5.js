/*
Author: Project Somedays
Date: 2024-05-03 last updated
Title: RecodeRethink - "Reformation"

Building on the Daniel Shiffman video: "Coding Challenge #136.1 Polar Perlin Noise Loops" @ https://www.youtube.com/watch?v=ZI1dmHv3MeM

Twisting and deforming a ring of points and sweeping it back and forth across the screen forever =)
The y axis is forshortened to give the impression of perspective.
The radius of each point is sampled using two dimensions of a noise field so that the end links up to the beginning.

Once an image is gone, it will likely never be seen in the same way again. I love that impermanence. 
It made me appreciate that actual fold patterns in veils come from the increased reflection and scattering of light just as the brighter parts of the image here are where transparencies overlap.
I'm constantly finding Generative Art only deepens my appreciation for that perculiar and beautiful abstract lens that physics see the world through.
*/

// Control variables
const res = 100; // the number of points that make up the circle
const noiseRoughness = 1.005; // how squiggly the circle is
const globalNoiseStep = 0.005; // how much the squiggles change over time
const twistStep = 0.001; // how much the circle twists in radians
const minRPropOfScreen = 0.01;
const maxRPropOfScreen = 0.5;
const opacity = 15;

// tracking variables
let globalNoiseOffset = 0;
let yMax, yMin, yPos, yStep;
let isDescending = true; // to keep track of direction
let twistOffset = 0;
let twist;
let yardstick; // so it works in either aspect ratio


function setup() {
	createCanvas(1080, 1920, P2D);
	yardstick = min(width, height);
	stroke(255, opacity);
	strokeWeight(2);
	noFill();
	yMax = 0.4*height;
	yMin = 0.1*height;
	yPos = -0.5*yMax;
	yStep = 10;
	
	background(0); // drawn only once so that pixels build on each other
	
}

function draw() {
	noFill();
	beginShape();
	twist = map(noise(twistOffset), 0, 1, -TWO_PI, TWO_PI); // angular twist
	for(let i = 0; i < res; i++){
		let nX = noiseRoughness*(cos(i*TWO_PI/res) + 1);
		let nY = noiseRoughness*(sin(i*TWO_PI/res) + 1);
		let r = map(noise(nX, nY, globalNoiseOffset), 0, 1, yardstick*minRPropOfScreen, yardstick*maxRPropOfScreen);
		vertex(width/2 + r*cos(twist + i*TWO_PI/res), yPos + 0.5*r*sin(twist + i*TWO_PI/res));
	}
	endShape(CLOSE);
	globalNoiseOffset += globalNoiseStep;
	yStep = isDescending ? 1 : -1;
	twistOffset += twistStep;
	yPos += yStep;
	
	// if the centre of the ring has moved far enough off the screen, fade to black
	if(yPos > height + 0.4*yMax || yPos < - 0.4*yMax){
		background(0,30);
	}
	
	// if the centre of the ring is definitely far enough off the screen, reverse direction
	if(yPos > height + 0.5*yMax || yPos < - 0.5*yMax){
		background(0);
		isDescending = !isDescending;
	}
}

function keyPressed(){
	if(keyCode === ' '){
		saveFrame("thumbnail")
	}
}
