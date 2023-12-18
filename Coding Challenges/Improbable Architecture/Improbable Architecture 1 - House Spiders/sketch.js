let houseImg;
let legBaseImg;
let legTipImg;
let globA = 0;
let aOffset = 0.0;
let legWiggleRate = 0.03;
let yPos;
let yPosMag;

function preload(){
  houseImg = loadImage("Creepy House.png");
  legBaseImg = loadImage("Top Segment.png");
  legTipImg = loadImage("Bottom Segment.png");
}


function setup(){
  createCanvas(windowWidth, windowHeight);
  fill(255);
  yPos = height/2;
  yPosMag = height/8;
  
}


function draw(){
  background(0);
  stroke(255);
  strokeWeight(5);
  yPos = height/2 + yPosMag*sin(aOffset/2);
  
  line(width/2, yPos,width/2, 0);
  for(let i = 0; i < 4; i++){
    let a;
  for(let i = 0; i < 4; i++){
    let a = -PI/6 + i * HALF_PI/4;
    let phase = i*0.1*PI;
    if(i < 4){
      a = -PI/6 + i * HALF_PI/4;
    } else {
      a = -PI/6 + (i-4) * HALF_PI/4;
    }
    isFlipped = i > 3;
    drawLeg(width/2, yPos, a + 0.2*sin(aOffset + phase), isFlipped);
  }
  // drawLeg(width/2, height/2,0);
  image(houseImg, width/2 - houseImg.width/2, yPos- 2*houseImg.height/3);
  
  aOffset += legWiggleRate;
    
  }
}
  

function drawLeg(x,y,a, isFlipped){
  push();
  translate(x,y);
  if(isFlipped) scale(-1,1);
  rotate(a);
  image(legTipImg, 100 + legBaseImg.width - 30 - legTipImg.width/2, - legBaseImg.height/2);
  image(legBaseImg, 100 - legBaseImg.width/2, - legBaseImg.height/2, legBaseImg.width, legBaseImg.height);
  pop();
}