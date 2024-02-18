


const wobble = (t, offset, a, b, c, d, e, f, g, h, j, k, l, m, n, o)=>sin(offset + a*t+b*t+c+d*sin(e*t-f*t+g)) + sin(offset + h*t-j*t+k+l*sin(m*t+n*t+o));
const wobblyVariables = Array.from({length: 14}, () => Math.random(-5, 5));

const n = 50;
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
let wobblies;
let tRate;
let aRate;

function setup() {
  createCanvas(1080, 1080);
  background(0);
  wobblies = wobblyVariables;
  tRate = random(-0.03, 0.03);
  aRate = random(-0.03, 0.03);
  chosenColours = random(colours);
  
}

function draw() {
  
  fill(255,5);
  noStroke();
  push();
  translate(width/2, height/2);
  rotate(a);
  for(let i = 0; i < n; i++){
    fill(addTransparency(chosenColours[i%chosenColours.length],50));
    let y = -height/2 + i*height/n;
    let offset = i*TWO_PI/n;
    // let x = 0.25*width*wobble(t, offset, 2.13, 1.11, 5.95, 2.57, 1.73, -1.65, 1.87, 3.09, -1.28, 4.15, 2.31, 2.53, 1.66, 4.45);
    let x = 0.25*width *wobble(t, offset, wobblies[0], wobblies[1], wobblies[2],wobblies[3], wobblies[4], wobblies[5],wobblies[6], wobblies[7], wobblies[8], wobblies[9], wobblies[10], wobblies[11],wobblies[12], wobblies[13])
    circle(x,y,0.2*height/n);
  }
  pop();

  t += tRate;
  a += aRate;

}

function addTransparency(hexColor, alphaValue) {
  // Parse the hex color to extract RGB components
  let r = unhex(hexColor.substring(1, 3));
  let g = unhex(hexColor.substring(3, 5));
  let b = unhex(hexColor.substring(5, 7));
  
  // Return the color with specified transparency
  return color(r, g, b, alphaValue);
}
