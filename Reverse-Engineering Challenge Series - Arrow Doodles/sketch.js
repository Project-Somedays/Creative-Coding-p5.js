/*
Author: Project Somedays
Date: 2024-03-12
Title: Reverse-Engineering Challenge Series - feat. Zendtangledmama - Arrow Doodle
*/

let n = 5;
let w;
let lanes = [];
let yLevel;
let palette = ['#001219', '#005f73', '#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702', '#bb3e03', '#ae2012', '#9b2226'];
let reversePalette = [...palette].reverse();
let megapalette = [...palette, ...reversePalette];

function setup() {
  createCanvas(1080, 1920);
  console.log(megapalette);
  // stroke(255);
  noStroke()
  
  w = width/n;
  for(let i = 0; i < n; i++){
    let y = i%2 === 0 ? height*0.8 : 0.7*height; 
    lanes.push(new Lane(i*w,y));
  }
  
  
}

function draw() {
  background(0);
  
  

  for(let l of lanes){
    l.show();
  }
}

class Lane{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  show(){
    for(let y = this.y; y > 0; y -= 2){
      fill(megapalette[int(y/2)%megapalette.length]);
      triangle(this.x, height + w/2 - y, this.x + w/2, height - y, this.x + w, height + w/2 - y);
    }
    line(this.x,    height, this.x, height - this.y);
    line(this.x, height - this.y, this.x + w/2, height - (this.y + w/2));
    line(this.x + w/2,    height, this.x + w/2, height - (this.y + w/2));
    line(this.x + w/2, height - (this.y + w/2), this.x + w, height - this.y);
    line(this.x + w,height, this.x + w, height - this.y);
  }

  
  }


