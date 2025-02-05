/* 
Author: Project Somedays
Date: 2025-01-21
Title: Genuary 2025 Day 21 - Create a collision detection system

100% this has been one of my dog's dreams 🥰

Resources:
  - Hamster Model (adjusted and texture-painted badly in Blender by yours truly): https://www.printables.com/model/591010-hamster
  - Doggo Model (adjusted and texture-painted badly in Blender by yours truly): https://www.printables.com/model/1145961-meditating-dog/files
*/
let orbs = [];
const orbPerBlockCount = Math.pow(500,1/3);
const wallDampening = 0.5;
const orb2orbDampening = 0.9;
let boxSize;
let g;

let a;
let obstacle;
const noiseProgression = 0.01;
// In your setup or constructor:
let baseWidth = 1080; // Your reference width
let scaleFactor;

// Then for your models:
let hamsterModelScale; 
let doggoModelScale;


let hamster, hamsterTexture;
let doggo, dogTexture;

let palette = "#08415c, #cc2936".split(", ");

function preload(){
  hamster = loadModel("Hamster.obj", true, () => console.log("Hamster model load success 🥰"), () => console.log("Hamster model load FAIL 😢"));
  hamsterTexture = loadImage("hamster_son_noballs Base Color.png", true, () => console.log("Hamster texture load success 🥰"), () => console.log("Hamster texture load FAIL 😢"));
  doggo = loadModel("Doggo.obj", true, () => console.log("Doggo model load success 🥰"), () => console.log("Hamster model load FAIL 😢"));
  dogTexture = loadImage("DogTexture.png", true, () => console.log("Doggo model load success 🥰"), () => console.log("Doggo texture load FAIL 😢"));
 
}

function setup() {
  // createCanvas(min(windowWidth, windowHeight),min(windowWidth, windowHeight), WEBGL);
  createCanvas(1080, 1080, WEBGL);

  scaleFactor = width/baseWidth; // This gives us our screen-size multiplier
  hamsterModelScale = 0.25 * scaleFactor;
  doggoModelScale = 2.5 * scaleFactor;
  boxSize = 1.5*width;
  noStroke();
  frameRate(30);
  noCursor();

  obstacle = new Doggo(0,0,0, width/2, color(palette[0]));

  g = createVector(0,0.01,0);
  for(let layer = 0; layer < orbPerBlockCount; layer ++){
    for(let row = 0; row < orbPerBlockCount; row ++){
      for(let col = 0; col < orbPerBlockCount; col ++){
        let y = -boxSize/2 + layer * boxSize / orbPerBlockCount;
        let x = -boxSize/2 + row * boxSize / orbPerBlockCount;
        let z = -boxSize/2 + col * boxSize / orbPerBlockCount;
        orbs.push(new Orb(x,y,z, 50, color(palette[1])));
      }
    }
  }

  specularMaterial(50);
  

}

function draw() {
  background(0);

a = frameCount *TWO_PI/600;
rotateY(a);
// rotateX(TWO_PI/3);
directionalLight(255, 255, 255, createVector(0,1,0));
directionalLight(255, 255, 255, createVector(0,0,-1));
  obstacle.update();
  obstacle.show();


  for(let orb of orbs){
    orb.update();
    orb.show();
  }

  for(let orb of orbs){
    orb.bounce(obstacle.p, obstacle.r);
  }

  for(let i = 0; i < orbs.length; i++){
    for(let j = 0; j < orbs.length; j++){
      if(i === j) continue; // no need for self checks
      orbs[i].bounce(orbs[j].p, orbs[j].r);
    }
  }

  orbitControl();
}



class Orb{
  constructor(x,y, z, r, col){
    this.p = createVector(x, y, z);
    this.v = createVector(0,0,0);
    this.a = createVector(0,0,0);
    this.r = r;
    this.col = col;
    this.yAOffset = random(TWO_PI);
    this.xAOffset = random(TWO_PI);
    this.zAOffset = random(TWO_PI);
    this.rotationMultiplier = random(3,5);
  }

  bounce(otherP, otherR){
    if(dist(otherP.x, otherP.y, otherP.z, this.p.x, this.p.y, this.p.z) <= otherR + this.r) {
      this.dir = p5.Vector.sub(this.p, otherP);
      this.dir.normalize(); // normalize to get direction only
      let bounceForce = this.v.mag() * orb2orbDampening;
      this.v.add(this.dir.mult(bounceForce));
  }
  }

  applyForce(f){
    this.a.add(f);
  }

  wrapY(){
    if(this.p.y > boxSize/2){
      this.p.y -= boxSize;
      this.v.y = 0;
    }
  }

  bounceOffWall(){
    if(this.p.x < -boxSize/2 || this.p.x > boxSize/2) this.v.x *= -wallDampening;
    if(this.p.z < -boxSize/2 || this.p.z > boxSize/2) this.v.z *= -wallDampening;
  }

  update(){
    this.applyForce(g);
    this.v.add(this.a);
    this.p.add(this.v);
    this.a.mult(0);
    this.bounceOffWall();
    this.wrapY()  ;
  }

  show(){
    push();
    translate(this.p.x, this.p.y, this.p.z);
    
    push();
    scale(hamsterModelScale);
    rotateX(this.rotationMultiplier*a + this.xAOffset);
    rotateY(this.rotationMultiplier*a + this.yAOffset);
    rotateZ(this.rotationMultiplier*a + this.zAOffset);
    texture(hamsterTexture);
    model(hamster);
    pop();
    
    fill(color(255, 255, 255, 1));
    sphere(this.r, 24, 24);
    pop();
  }
}

class Doggo{
  constructor(x,y, z, r, col){
    this.p = createVector(x, y, z);
    this.v = createVector(0,0,0);
    this.a = createVector(0,0,0);
    this.r = r;
    this.col = col;
    this.yAOffset = random(TWO_PI);
    this.xAOffset = random(TWO_PI);
    this.zAOffset = random(TWO_PI);
    this.rotationMultiplier = random(3,5);
  }

  update(){
    this.p.x = map(noise(frameCount * noiseProgression), 0, 1, -boxSize/2, boxSize/2);
    this.p.y = map(noise(frameCount * noiseProgression + 1000), 0, 1, -boxSize/2, boxSize/2);
    this.p.z = map(noise(frameCount * noiseProgression + 2000), 0, 1, -boxSize/2, boxSize/2);
  }

  show(){
    push();
    translate(this.p.x, this.p.y, this.p.z);
    
    
    push();
    scale(doggoModelScale);
    rotateX(this.rotationMultiplier*a + this.xAOffset);
    rotateY(this.rotationMultiplier*a + this.yAOffset);
    rotateZ(this.rotationMultiplier*a + this.zAOffset);
    texture(dogTexture);
    model(doggo);
    pop();
    fill(color(255, 255, 255, 10));
    sphere(this.r, 24, 24);
    pop();
  }
}
