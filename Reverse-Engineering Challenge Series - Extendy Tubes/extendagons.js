class Extendagon{
    constructor(params){
      this.p = createVector(params.cx, params.cy);
      this.h = 1;
      this.a = params.a;
      this.noiseOffset = random(10000);
      this.n = params.n;
      this.h = params.h;
      this.s = params.s;
      this.startFrame = params.startFrame;
      this.vertices = [];
      this.colour = params.colour;
      for(let i = 0; i < this.n; i++){
        this.vertices.push(createVector(this.s*cos(i*TWO_PI/this.n), this.s*sin(i*TWO_PI/this.n)));
      }
    }
  
    update(h){
      this.h = h;
    }

    precess(a){
      this.a = a;
    }
    rotateVertices(){
      for(let i = 0; i < this.n; i++){
        let a = i*TWO_PI/this.n + frameCount/rotRate;
        this.vertices[i].set(this.s*cos(a), this.s*sin(a));
      }

      let c = createVector(0,0);
      // sort so that they appear in the correct order
      this.vertices.sort((a,b) => p5.Vector.sub(c, a).heading() - p5.Vector.sub(c, b).heading())
      
    }
  
    show(){ 
      fill(this.colour);
      push();
      translate(this.p.x, this.p.y);
      rotate(this.a);
       // draw top surface
  
  
       for(let i = 0; i < this.vertices.length; i++){
        beginShape();
        vertex(this.vertices[i].x, this.vertices[i].y);
        vertex(this.vertices[i].x, this.vertices[i].y + this.h);
        let nextIndex = (i + 1)%this.vertices.length;
        vertex(this.vertices[nextIndex].x, this.vertices[nextIndex].y + this.h);
        vertex(this.vertices[nextIndex].x, this.vertices[nextIndex].y);
        endShape(CLOSE); 
       }
  
      beginShape();
        for(let v of this.vertices){
          vertex(v.x, v.y + this.h);
        }
      endShape(CLOSE);
     pop(); 
    }
  
  }