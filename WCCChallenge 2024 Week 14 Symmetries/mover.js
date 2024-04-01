class Mover{
    constructor(x,y){
      this.p = createVector(x,y);
      this.v = p5.Vector.random2D();
    //   this.v = p5.Vector.fromAngle(random(-PI/12, PI/12));
      this.a = createVector(0,0);
      this.c = random(randPalette)
      // this.normal = null;
    }
  
    applyForce(f){
      this.a.add(f);
    }
  
    update(){
      this.v.add(this.a).normalize();
      this.p.add(this.v);
      this.a.mult(0);
    }
  
    show(layer){
      layer.circle(this.p.x, this.p.y, 2*r);
      if (DEBUGMODE) drawArrow(layer, this.p.x, this.p.y, this.v.heading(), r*2);
    }
  
  
  }

  