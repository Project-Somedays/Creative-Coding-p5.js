function setup() {
  createCanvas(min(windowWidth,windowHeight), min(windowWidth, windowHeight));
}

function draw() {
  background(220);
}


class Bullet{
  constructor(x,y,dir,bulletSpeed){
    this.p = createVector(x,y);
    this.dir = createVector(dir.x, dir.y).setMag(bulletSpeed);
  }
  update(){
    this.p.add(this.dir);

  }
}

class Gun{
  constructor(name, fireRate, spread){
    this.name = name;
    this.fireRate = fireRate;
    this.spread = spread;
  }
  
}

class Player{
  constructor(){
    this.p = createVector(width/2, height*0.9);
    this.health = 100;
    
    this.gun = 
    this.fireSpread = 0;
    this.groupSize = 1;
  }

  
}

class Enemy{
  constructor(x,y, health, speed, rangeOfSight){
    this.p = createVector(x,y);
    this.health = health;
    this.speed = speed;
    this.rangeOfSight = rangeOfSight;
  }

  update(){
    this.p.y += this.speed;
  }

  this.headt
}
