class Body{
    constructor(x,y, vx, vy, d, col){
      this.isDestroyed = false;
      this.p = createVector(x,y);
      this.v = createVector(vx, vy);
      this.a = createVector(0,0);
      this.d = d;
      this.col = col;
      this.lifespan = 0;
      
    }
  
    addForce(f){
      this.a.add(f)
    }
  
    update(){
      this.v.add(this.a);
      this.p.add(this.v);
      this.a.setMag(0);
      this.lifespan ++;
    }
    
  
    show(){
      let tempd;
      if(this.lifespan < stableOrbitLimit){
        fill(255);
        tempd = 1;
      } else {
        fill(this.col);
        tempd = this.d;
      }
      circle(this.p.x, this.p.y, tempd);
      
    }

    destroy(){
        this.isDestroyed = true;
    }
  }