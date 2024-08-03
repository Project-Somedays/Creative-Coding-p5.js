
class Enemy{
    constructor(x,y,scl, health, speed, rangeOfSight, damageRate, damagePerHit, damageRange, colour, img){
      this.p = createVector(x,y);
      this.scl = scl;
      this.health = health;
      this.speed = speed;
      this.rangeOfSight = rangeOfSight;
      this.isDead = false;
      this.damageRate = int(damageRate);
      this.damagePerHit = damagePerHit;
      this.damageRange = damageRange;
      this.dir = createVector(0,1).setMag(speed);
      this.colour = colour;
      this.img = img;
      this.r = this.scl*this.img.width/2;
    }

    seek(nearestPlayerPos){
        if(p5.Vector.dist(nearestPlayerPos, this.p) <= this.rangeOfSight){
            this.dir = p5.Vector.sub(nearestPlayerPos, this.p).setMag(this.speed);
        }
    }
  
    update(){
      this.p.add(this.dir);
    }

    takeDamage(hp){
        this.health -= hp;
        this.isDead = this.health <= 0;
    }

    dealDamage(){
      return frameCount%this.damageRate === 0 ? this.damagePerHit : 0;
    }

    show(){
        fill(this.colour);
        // circle(this.p.x, this.p.y, 2*this.r);
        image(this.img, this.p.x, this.p.y, this.img.width*this.scl, this.img.height*this.scl)
    }
  
  }



  function spawnRandomEnemy(){
    let eObj = sampleFromDistribution(enemyFreqTable);
    return new Enemy(random(width), -width/5, eObj.scl, eObj.health, eObj.speed, eObj.rangeOfSight, eObj.damageRate, eObj.damagePerHit, eObj.damageRange, eObj.colour, eObj.img);
  }
  