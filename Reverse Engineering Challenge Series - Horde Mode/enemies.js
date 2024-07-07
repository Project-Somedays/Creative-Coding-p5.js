
class Enemy{
    constructor(x,y,r, health, speed, rangeOfSight){
      this.p = createVector(x,y);
      this.r = r;
      this.health = health;
      this.speed = speed;
      this.rangeOfSight = rangeOfSight;
      this.isDead = false;
      this.dir = createVector(0,1).setMag(speed);
    }

    seek(nearestPlayerPos){
        if(p5.Vector.dist(nearestPlayerPos, this.p) <= this.rangeOfSight){
            this.dir = p5.Vector.sub(nearestPlayerPos, this.p);
        }
    }
  
    update(){
      this.p.add(this.dir);
    }

    damage(hp){
        this.health -= hp;
        this.isDead = this.health <= 0;
    }

    show(){
        fill(255,0,0);
        circle(this.p.x, this.p.y, 2*this.r);
    }
  
  }
  