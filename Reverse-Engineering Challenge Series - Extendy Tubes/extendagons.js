class Extendagon{
    constructor(cx, cy){
      this.p = createVector(cx, cy);
      this.h = 0;
      this.a = random(PI);
      this.noiseOffset = random(10000);
      this.n = int(random(4,8));
      this.s = random(0.5*max(width, height)*sFrac, max(width, height)*sFrac);
      this.vertices = [];
      this.colour = random(palette);
      for(let i = 0; i < this.n; i++){
        this.vertices.push(createVector(this.s*cos(i*TWO_PI/this.n), this.s*sin(i*TWO_PI/this.n)));
      }
    }
  
    update(){
      let noiseVal = noise(this.noiseOffset + frameCount/noiseRate);
      this.h = 0.5*(sin(noiseVal*HALF_PI) + 1)*max(width, height)*maxHFrac;
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