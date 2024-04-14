/*
Author: Project Somedays
Date: 2024-04-13
Title: Recode-Rethink / Reverse Engineering Challenge Series: Extendy Tubes

Leaping off from the mesmerising animations by Seohywork: https://x.com/seohyowork/status/1774789646578536803

Things to play with (watch this space):
  - Various easing functions
  - Offset cycles of different speed rather than perlin noise directly controlling h
  - Spacing/Density
  - Curved Tubes
  - 3D implementation
*/

const noiseRate = 200;
const maxHFrac = 0.25;
const sFrac = 0.05;
const cols = 20;

const palettes = [
  // ['#ffffff'],
  ['#f72585', '#b5179e', '#7209b7', '#560bad',' #480ca8', '#3a0ca3', '#3f37c9', '#4361ee', '#4895ef', '#4cc9f0'],
  ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000', '#dc2f02', '#e85d04',' #f48c06', '#faa307', '#ffba08'],
  ['#d9ed92', '#b5e48c','#99d98c','#76c893', '#52b69a', '#34a0a4', '#168aad', '#1a759f', '#1e6091', '#184e77'],
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

let palette;

let tubes = [];

function setup() {
  createCanvas(1920, 1080);
  pixelDensity(1);
  palette = random(palettes);

  for(let col = 0; col < width*1.2 ; col += min(width, height)*sFrac*2){
    for(let row = 0; row < height*1.2; row += min(width, height)*sFrac*2){
      tubes.push(new Extendagon(col, row))
    }
  }

}

function draw() {
  background(220);

  for(let t of tubes){
    t.update();
    t.show();
  }
  

}


