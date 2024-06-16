let bullets = [];
let player;
let pistolFlintLock;

function setup() {
  createCanvas(min(windowWidth,windowHeight), min(windowWidth, windowHeight));
  frameRate(30);
  pistolFlintLock = new Gun("Flintlock Pistol", 60, 0, windowHeight/75);
  player = new Player(pistolFlintLock);
}

function draw() {
  background(0);
  player.update()
  player.show();
  
  handleBullets();

  
  
  

}

function handleBullets(){
  for(let i = bullets.length - 1; i >= 0; i--){
    bullets[i].update();
    bullets[i].show();
    if(bullets[i].isSpent) bullets.splice(i,1);
  }
}



class Bullet{
  constructor(x,y,dir,bulletSpeed){
    this.p = createVector(x,y);
    this.dir = createVector(dir.x, dir.y).setMag(bulletSpeed);
    this.isSpent = false;
  }
  update(){
    this.p.add(this.dir);
    if(this.p.x < 0 || this.p.x > width || this.p.y < 0) this.isSpent = true;
  }

  show(){
    fill(255);
    circle(this.p.x, this.p.y, width/50);
  }


}

class Gun{
  constructor(name, fireRate, spread, bulletSpeed){
    this.name = name;
    this.fireRate = fireRate;
    this.spread = spread;
    this.bulletSpeed = bulletSpeed;
  }

  fire(x, y){
    if(frameCount % this.fireRate === 0){
      let dir = p5.Vector.fromAngle(random(-this.spread/2, this.spread/2) - HALF_PI) ;
      let bullet = new Bullet(x,y, dir, this.bulletSpeed);
      bullets.push(bullet);
    }
  }
  
}

class Player{
  constructor(gun){
    this.p = createVector(width/2, height*0.9);
    this.health = 100;
    this.gun = gun;
    this.groupSize = 1;
  }

  update(){
    this.p.x = mouseX;
    this.gun.fire(this.p.x, this.p.y);
  }

  show(){
    fill(0,255,0);
    circle(this.p.x, this.p.y, width/20);
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

  
}
