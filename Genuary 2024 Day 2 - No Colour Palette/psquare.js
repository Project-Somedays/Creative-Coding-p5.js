class PSquare{
    constructor(x,y, r, g, b){
      this.p = createVector(x,y);
      this.c = color(r,g,b);
    }
    
    update(x,y){
      this.p.set(x,y);
    }
    
    show(){
      fill(this.c);
      stroke(this.c);
      square(this.p.x, this.p.y, res);
    }
  
  }