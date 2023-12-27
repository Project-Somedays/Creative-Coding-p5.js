class Body{
    constructor(x,y, vx, vy, d, col){
      this.isDestroyed = false;
      this.p = createVector(x,y);
      this.v = createVector(vx, vy);
      this.a = createVector(0,0);
      this.d = d;
      this.col = col;
    }
  
    addForce(f){
      this.a.add(f)
    }
  
    update(){
      this.v.add(this.a);
      this.p.add(this.v);
      this.a.setMag(0);  
    }
  
    show(){
        fill(this.col);
        circle(this.p.x, this.p.y, this.d);
    }

    destroy(){
        this.isDestroyed = true;
    }
  }