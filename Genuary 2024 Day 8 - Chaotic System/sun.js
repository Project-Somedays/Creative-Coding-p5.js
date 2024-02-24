class Sun{
    constructor(x,y,s,mass){
      this.p = createVector(x,y);
      this.s = s;
      this.mass = mass
    }
  
    show(){
      fill(255, 255, 0);
			noStroke();
      circle(this.p.x, this.p.y, this.s);
    }
  }