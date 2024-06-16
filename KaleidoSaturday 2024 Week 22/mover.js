class Mover{
    constructor(x,y,baseSize, isCircle){
      this.p = createVector(x,y);
      this.v = p5.Vector.random2D();
      this.s = random(baseSize/2,baseSize*1.5);
      this.a = random(TWO_PI);
      this.isCircle = isCircle;
    }
  
    update(){
      this.p.add(this.v);
      
    }
  
    show(){
      push();
      translate(this.p.x, this.p.y);
      if(this.isCircle){
        circle(0,0, this.s);
      } else {
        rotate(this.a + 0.01*frameCount*TWO_PI/120);
        square(0,0, this.s);
      }
      pop();
    }
  }