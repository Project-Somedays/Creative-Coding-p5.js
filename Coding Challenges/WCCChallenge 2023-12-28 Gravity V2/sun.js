class Sun{
    constructor(x,y,s){
      this.p = createVector(x,y);
      this.s = s;
    }
  
    show(){
      fill(255, 255, 0);
      circle(this.p.x, this.p.y, this.s);
    }
  }