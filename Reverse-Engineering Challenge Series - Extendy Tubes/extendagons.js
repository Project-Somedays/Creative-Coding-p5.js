class Extendagon{
    constructor(cx, cy, a, s, n){
      this.p = createVector(cx, cy);
      this.h = 0;
      this.a = a;
      this.noiseOffset = random(10000);
      this.n = n;
      this.s = s;
      this.vertices = [];
      this.colour = random(palette);
      for(let i = 0; i < this.n; i++){
        this.vertices.push(createVector(this.s*cos(i*TWO_PI/this.n), this.s*sin(i*TWO_PI/this.n)));
      }
    }
  
    update(h){
      this.h = h;
    }
  
    show(){ 
      fill(this.colour);
      push();
      translate(this.p.x, this.p.y);
      rotate(this.a);
       // draw top surface
  
  
       for(let i = 0; i < this.vertices.length; i++){
        beginShape()
        vertex(this.vertices[i].x, this.vertices[i].y);
        vertex(this.vertices[i].x, this.vertices[i].y + this.h);
        let nextIndex = (i + 1)%this.vertices.length;
        vertex(this.vertices[nextIndex].x, this.vertices[nextIndex].y + this.h);
        vertex(this.vertices[nextIndex].x, this.vertices[nextIndex].y);
        endShape(CLOSE) 
       }
  
      beginShape();
        for(let v of this.vertices){
          vertex(v.x, v.y + this.h);
        }
      endShape(CLOSE);
     pop(); 
    }
  
  }