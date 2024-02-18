/*
Author: Project Somedays
Date: 2024-02-18
Title: Genuary 2024 Day 13 - Wobbly Functions

As a first attempt, I'm pretty happy with this. Definitely an area to explore more.
Tried to make as many random elements as possible, but not necesssarily with wobbliness
*/

// the basic wobble function is borrowed from https://piterpasma.nl/articles/wobbly
const wobble = (t, offset, a, b, c, d, e, f, g, h, j, k, l, m, n, o)=>sin(offset + a*t+b*t+c+d*sin(e*t-f*t+g)) + sin(offset + h*t-j*t+k+l*sin(m*t+n*t+o));

// generate the varables that go into the wobbly function
const wobblyVariables = Array.from({length: 14}, () => Math.random(-5, 5));


const n = 100;
let t = 0;
let a = 0;
const colours = [
  ['#f72585', '#b5179e', '#7209b7', '#560bad',' #480ca8', '#3a0ca3', '#3f37c9', '#4361ee', '#4895ef', '#4cc9f0'],
  ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000', '#dc2f02', '#e85d04',' #f48c06', '#faa307', '#ffba08'],
  ['#d9ed92', '#b5e48c','#99d98c','#76c893', '#52b69a', '#34a0a4', '#168aad', '#1a759f', '#1e6091', '#184e77'],
  ['#3a0f72', '#6023b0', '#7826e3', '#8e48eb', '#a469f2', '#bb4fcd', '#d235a8', '#ff005e', '#250b47'],
  ['#007f5f', '#2b9348', '#55a630', '#80b918', '#aacc00', '#bfd200', '#d4d700', '#dddf00', '#eeef20', '#ffff3f']
];
let chosenColours = [];
let tRate; // parametric variable for the wobbly function
let aRate; // rotation rate

function setup() {
  createCanvas(1080, 1080);
  background(0);
  
  tRate = random(-0.03, 0.03);
  aRate = random(-0.03, 0.03);
  chosenColours = random() < 0.5 ? random(colours) : random(colours).reverse(); // half the time, reverse the colour sequence
  
}

function draw() {
  
  fill(255,5);
  noStroke();
  push();
  translate(width/2, height/2);
  rotate(a);
  for(let i = 0; i < n; i++){
    fill(addTransparency(chosenColours[i%chosenColours.length],100));
    let y = -height/2 + i*height/n;
    let offset = i*TWO_PI/n;
    // let x = 0.25*width*wobble(t, offset, 2.13, 1.11, 5.95, 2.57, 1.73, -1.65, 1.87, 3.09, -1.28, 4.15, 2.31, 2.53, 1.66, 4.45);
    let wobbleValue = wobble(t, offset, wobblyVariables[0], wobblyVariables[1], wobblyVariables[2],wobblyVariables[3], wobblyVariables[4], wobblyVariables[5],wobblyVariables[6], wobblyVariables[7], wobblyVariables[8], wobblyVariables[9], wobblyVariables[10], wobblyVariables[11],wobblyVariables[12], wobblyVariables[13])
    let x = 0.25*width * wobbleValue;
    circle(x,y,0.2*height/n * wobbleValue);
  }
  pop();

  t += tRate;
  a += aRate;

}

function keyPressed(){
  if(key === 's' || key === 'S'){
    saveCanvas(getCustomDateString() + "Project Somedays Genuary 2024 Day 13 Wobbly Functions");
  }
}

function addTransparency(hexColor, alphaValue) {
  // Parse the hex color to extract RGB components
  let r = unhex(hexColor.substring(1, 3));
  let g = unhex(hexColor.substring(3, 5));
  let b = unhex(hexColor.substring(5, 7));
  
  // Return the color with specified transparency
  return color(r, g, b, alphaValue);
}

function getCustomDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}-${minutes}-${seconds} `;
}
