class Mover{
    constructor(x,y){
      this.p = createVector(x,y);
      this.v = p5.Vector.random2D();
    //   this.v = p5.Vector.fromAngle(random(-PI/12, PI/12));
      this.a = createVector(0,0);
      this.c = random(randPalette)
      // this.normal = null;
    }
  
    applyForce(layer, f){
      layer.push()
      let fExtent = map(f.mag(), 0, fMax, r, 2*r);
      layer.strokeWeight(2);
      layer.stroke(255,255,0, 100);
      drawArrow(layer,this.p.x, this.p.y, f.heading(), fExtent);
      layer.pop();
      this.a.add(f);
    }
  
    update(){
      this.v.add(this.a).normalize();
      this.p.add(this.v);
      this.a.mult(0);
    }
  
    show(layer){
      layer.stroke(255, 100);
      layer.circle(this.p.x, this.p.y, 2*r);
      drawArrow(layer, this.p.x, this.p.y, this.v.heading(), r*2);
    }
  
  
  }

  