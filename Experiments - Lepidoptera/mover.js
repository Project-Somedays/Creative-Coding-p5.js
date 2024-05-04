class Wall{
    constructor(sx, sy, ex, ey, i){
      this.start = createVector(sx,sy);
      this.end = createVector(ex, ey);
      this.a = p5.Vector.sub(this.end, this.start).heading();
      this.i = i;
    }
  
  }
  
  class Mover{
    constructor(x,y){
      this.p = createVector(x,y);
      this.v = p5.Vector.random2D();
      this.intersections = new Array(3).fill(null);
    }
  
    intersect(p, i){
      this.intersections[i] = p;
    }
    update(){
      this.p.add(this.v);
    }
  
    setV(x,y){
      this.v.set(x,y);
    }
  
    show(){
      stroke(255);
      circle(this.p.x, this.p.y, 2*r);
    }
  }