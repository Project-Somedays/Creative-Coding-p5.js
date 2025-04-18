class Bullet{
    constructor(x,y,dir,bulletSpeed,damage, penetration=1){
      this.p = createVector(x,y);
      this.dir = createVector(dir.x, dir.y).setMag(bulletSpeed);
      this.hitCount = 0;
      this.isSpent = false;
      this.damage = damage;
      this.penetration = penetration;
    }
    update(){
      if(!this.isSpent) this.p.add(this.dir);
      this.isSpent = (this.p.x < 0 || this.p.x > width || this.p.y < 0);
    }

    registerHit(){
      this.hitCount ++;  
      this.isSpent = this.hitCount > this.penetration;
    }
  
    show(){
      fill(255);
      circle(this.p.x, this.p.y, width/50);
    }
  }

  class Gun{
    constructor(profile){
      this.name = profile.name;
      this.fireRate = profile.fireRate;
      this.spread = profile.spread;
      this.bulletSpeed = profile.bulletSpeed;
      this.baseDamage = profile.baseDamage;
      this.penetration = profile.penetration;
    }
  
    fire(x, y){
      if(frameCount % this.fireRate === 0){
        let dir = p5.Vector.fromAngle(random(-this.spread/2, this.spread/2) - HALF_PI) ;
        let bullet = new Bullet(x,y, dir, this.bulletSpeed, this.baseDamage, this.penetration);
        bullets.push(bullet);
      }
    }
    
  }
