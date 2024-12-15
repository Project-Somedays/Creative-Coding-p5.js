/*
Author: Project Somedays
Date: 2024-12-13
Title: How do owls tells time?

RESOURCES
- Owl model: https://www.printables.com/model/743015-cute-low-poly-owl-no-supports, texturing in Blender
- Font: https://fonts.google.com/specimen/Roboto+Condensed


*/

let owlBody, owlHead, owlBodyTexture, owlHeadTexture;
let autoRotate = false;

let startFrame;
let turnDuration = 30;
let isTurning = true;
let n = 60;
let owlGrid = [];
let cnv;
let progress;
let debug = false;
let font;
const owlScale = 0.125;
const fontPropOfHeight = 0.66;

function preload(){
  owlBody = loadModel("OwlBody.obj");
  owlHead = loadModel("OwlHead.obj");
  owlBodyTexture = loadImage("owlBodyTexture.png");
  owlHeadTexture = loadImage("OwlHeadTexture.png");
  font = loadFont('RobotoCondensed-VariableFont_wght.ttf')
}

function setup() {
  // createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
  // createCanvas(windowWidth, windowWidth/2, WEBGL);
  // createCanvas(1920, 1080, WEBGL);
  createCanvas(windowWidth, windowWidth/sqrt(2), WEBGL);
  noStroke();
  frameRate(30);
  progress = (frameCount%30)/30;

  cnv = createGraphics(2*width, 1.5*height);
  cnv.fill(255);
  cnv.background(0);
  cnv.textFont(font);
  cnv.textAlign(CENTER, CENTER);
  cnv.textSize(cnv.height*fontPropOfHeight);
  // cnv.textStyle(BOLD);
  cnv.text(getCurrentTime(), cnv.width/2, cnv.height*0.4);

  for(let y = 0; y < n; y+= 2){
    for(let x = 0; x < n; x+=0.5){
      let xPos = -cnv.width/2 + x*cnv.width / n;
      let yPos = -cnv.height/2 + y*cnv.height/n;
      owlGrid.push(new Owl(xPos, yPos, determineIsOn(xPos, yPos)));
    }
    
  }

}

function draw() {
  background(0);
  progress = (frameCount%30)/30;
  // debug.text(`(${mouseX}, ${mouseY})`, debug.width/2, debug.height/2);
  cnv.background(0);
  // cnv.text(9 - int(frameCount/30)%10, cnv.width/2, cnv.height/2);
  cnv.text(getCurrentTime(), cnv.width/2, cnv.height/2);

  // draw clock border
  for(let x = 0; x <= cnv.width; x += cnv.width/9){
    for(let y of [-cnv.height/10, cnv.height*1.25]){
      let theta = TWO_PI*noise(x/200, y/200, frameCount*0.01);
      let r = map(noise(x/200 + 1000, y/200 + 1000, frameCount * 0.01), 0, 1, cnv.height/50, cnv.height/25);
      let d = map(noise(x/200 - 1000, y/200 - 1000, -frameCount * 0.01), 0, 1, cnv.height*0.15, cnv.height*0.65);
      let xOff = r*cos(theta);
      let yOff = r*sin(theta);
      cnv.fill(255);
      cnv.circle(x + xOff,y + yOff,d);
    }
  }

  if(debug){
    texture(cnv)
    stroke(255);
    rect(-cnv.width/2, -cnv.height/2, cnv.width, cnv.height);
    noStroke();
  }
 
  
  directionalLight(255, 255, 255, createVector(0,0, -1));

  let a = frameCount * TWO_PI/600;
  push();
  // rotateY(map(sin(a),-1,1, -PI/6, PI/6));
	if(autoRotate){
		rotateY(PI);
		rotateY(map(sin(a),-1,1, -PI, PI)); // so the rotation is centred on the front face
	} 
  for(let owl of owlGrid){
    if(progress === 0) owl.update();
    owl.show();
  }
  pop();
  
  

  orbitControl();
}


function easeInOutExpo(x){
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5 ? pow(2, 20 * x - 10) / 2
    : (2 - pow(2, -20 * x + 10)) / 2;
  }


class Owl{
  constructor(x, y, isOn){
    this.x = x;
    this.y = y;
    this.isOnPrev = isOn;
    this.isOn = isOn;
    
  }

  update(){
    this.isOnPrev = this.isOn;
    // let sampleX = map(this.x, cnv.width, cnv, 0, cnv.width);
    // let sampleY = map(this.y, -1.75*height/2, 1.75*height/2, 0, cnv.height);
    this.isOn = brightness(cnv.get(this.x+cnv.width/2, this.y+cnv.height/2));
  }

  show(){
    push();
    translate(this.x, this.y,0);
    scale(owlScale)
    texture(owlBodyTexture);
    model(owlBody);
    texture(owlHeadTexture);
    // rotateY(this.isOn ? PI : 0);
    // rotateY(PI * easeInOutExpo(progress));
    if(this.isOn && !this.isOnPrev) rotateY(PI*easeInOutExpo(progress));
    if(!this.isOn && this.isOnPrev) rotateY(PI*easeInOutExpo(1-progress));
    if(this.isOn && this.isOnPrev) rotateY(PI);

    // if(progress === 0) this.isOnPrev = this.isOn;
    // rotateY(this.isOneaseInOutExpo(progress)*PI);
    model(owlHead);
    pop();
  }


}

const determineIsOn = (x,y) => brightness(cnv.get(x,y)) === 255;

function keyPressed(){
  switch(key.toLowerCase()){
		case 'd':
			debug = !debug;
			break;
		case 'r':
			autoRotate = !autoRotate;
			break;
		default:
			break;
	}

}

function getCurrentTime(){
  let now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
    
  return `${hours}:${minutes}:${seconds}`;
}