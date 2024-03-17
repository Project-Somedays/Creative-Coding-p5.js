/*
Author: Project Somedays
Date: 2024-03-17
Title: Genuary 2024 - Day 15 - Physics Library

Building off https://editor.p5js.org/codingtrain/sketches/wAe_oPVHo
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Plinko
// Video 1: https://youtu.be/KakpnfDv_f0
// Video 2: https://youtu.be/6s4MJcUyaUE
// Video 3: https://youtu.be/jN-sW-SxNzk
// Video 4: https://youtu.be/CdBXmsrkaPs

Really enjoying playing with persistence of vision kind of stuff. And different colour palettes.
Thanks ChatGPT for helping me with the collision filters!
This makes sure particles bounce off plinkos, but not each other.


*/



// module aliases
var Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies;

var engine;
var world;
var particles = [];
var plinkos = [];
var cols;
var rows;
let palette;
let opacity = 30;

let animationCutoff = 2000;
let spacing;
const particleBounce = 0.75;
const blurMode = false;
const blurLevel = 0.1;
const particlesPerFrame = 40;

let debugMode = false;

let particleR, particleD;

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

const colours2 =   [
  ['#ffffff'],
  ['#f72585', '#b5179e', '#7209b7', '#560bad',' #480ca8', '#3a0ca3', '#3f37c9', '#4361ee', '#4895ef', '#4cc9f0'],
  ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000', '#dc2f02', '#e85d04',' #f48c06', '#faa307', '#ffba08'],
  // ['#d9ed92', '#b5e48c','#99d98c','#76c893', '#52b69a', '#34a0a4', '#168aad', '#1a759f', '#1e6091', '#184e77'],
  ['#3a0f72', '#6023b0', '#7826e3', '#8e48eb', '#a469f2', '#bb4fcd', '#d235a8', '#ff005e', '#250b47'],
  ['#007f5f', '#2b9348', '#55a630', '#80b918', '#aacc00', '#bfd200', '#d4d700', '#dddf00', '#eeef20', '#ffff3f'],
  ['#012a4a', '#013a63', '#01497c', '#014f86', '#2a6f97', '#2c7da0', '#468faf', '#61a5c2', '#89c2d9', '#a9d6e5'],
  ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1'],
  // ['#0466c8', '#0353a4', '#023e7d', '#002855', '#001845', '#001233', '#33415c', '#5c677d', '#7d8597', '#979dac'],
  // ['#7400b8', '#6930c3', '#5e60ce', '#5390d9', '#4ea8de', '#48bfe3', '#56cfe1', '#64dfdf', '#72efdd', '#80ffdb'],
  // ['#54478c', '#2c699a', '#048ba8', '#0db39e', '#16db93', '#83e377', '#b9e769', '#efea5a', '#f1c453', '#f29e4c'],
  ['#227c9d', '#17c3b2', '#ffcb77', '#fef9ef', '#fe6d73'],
  ['#ffbc42', '#d81159', '#8f2d56', '#218380', '#73d2de'],
  ['#d00000', '#ffba08', '#3f88c5', '#032b43', '#136f63'],
  ['#eac435', '#345995', '#03cea4', '#fb4d3d', '#ca1551']]


function setup() {
  // createCanvas((9/16)*windowHeight, windowHeight);
  createCanvas(1080, 1920);
  palette = random(colours2).map(eachColour => hexToRgbWithOpacity(eachColour, opacity));
  // palette = colours2[0].map(eachColour => hexToRgbWithOpacity(eachColour, opacity));
  // colorMode(HSB, 360, 100, 100, 100);
  engine = Engine.create();
  world = engine.world;
  cols = int(random(4,12));
  rows = 2*cols;
  spacing = width/cols;
  particleR = 0.25*spacing;
  particleD = 2*particleR;
  //world.gravity.y = 2;

  newParticle();
  spacing = width / cols;
  generatePlinkos();

  background(0, 0, 0);
}

function newParticle() {
  for(let i = 0; i < particlesPerFrame; i++){
    let p = new Particle(width/2 + 0.5*width*randomGaussian(), -1.5*particleD, particleR);
    particles.push(p);
  }
  
}

function generatePlinkos(){
  plinkos = [];
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols + 1; i++) {
      var x = i * spacing;
      if (j % 2 == 0) {
        x += spacing / 2;
      }
      var y = j * spacing;
      let a = random(TWO_PI);
      let r = random(spacing*0.3);
      var p = new Plinko(x +r*cos(a), y+r*sin(a), particleR*0.3);
      plinkos.push(p);
    }
  }
}

function draw() {
  if(debugMode) background(0, 0, 0);
  if (frameCount % 20 == 0 && frameCount < animationCutoff) {
    newParticle();
  }
  Engine.update(engine, 1000 / 30);

  // if off the screen, remove the particle from the world and the array
  for (var i = 0; i < particles.length; i++) {
    if(debugMode) particles[i].show();
    if (particles[i].isOffScreen()) {
      World.remove(world, particles[i].body);
      particles.splice(i, 1);
      i--;
    }
  }
  
  if(debugMode){
    for (var i = 0; i < plinkos.length; i++) {
      plinkos[i].show();
    }
  }
  
  drawOverlap();
  if(!debugMode && blurMode){
		filter(BLUR, blurLevel);
	};
}

function drawOverlap(){
  for(let i = 0; i < particles.length; i++){
    for(let j = i; j < particles.length; j++){
      if(i === j) continue;
      let p_i = createVector(particles[i].body.position.x, particles[i].body.position.y);
      let p_j = createVector(particles[j].body.position.x, particles[j].body.position.y)
      let d = p5.Vector.dist(p_i, p_j);
      if(d < particles[i].r + particles[j].r){
        stroke(particles[i].hue, opacity);
        strokeWeight(1);
        // chordOfPointsOfIntersection(p_i, p_j);
        line(p_i.x, p_i.y, p_j.x, p_j.y);
      }
      
    }
  }
}

function mousePressed(){
  if(mouseButton === LEFT){
    debugMode = !debugMode;
    background(0);
  }
}

function chordOfPointsOfIntersection(posA, posB){
	let d = p5.Vector.dist(posA,  posB);
	if(d > particleD) return;
	let aSys = p5.Vector.sub(posB, posA).heading(); // get the heading from A to B
	let a = acos(d/particleD);
	push();
	translate(posA.x, posA.y);
	rotate(aSys); // for simplicity, rotate the system so that posB is always to the right of posA
	// if(debugMode){
	// 	line(0, 0, r*cos(a), r*sin(a));
	// 	line(0, 0, r*cos(a), r*sin(-a));
	// }
	line(r*cos(a), r*sin(a), r*cos(a), r*sin(-a)); // drawing a line between the points of intersection
	pop();
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
