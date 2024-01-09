class Spotlight{
    constructor(){
      this.p = createVector(0,0);
      this.xOffset = random(10000);
      this.yOffset = random(10000);
    }
  
    update(){
      this.p.set(getVal(this.xOffset,-0.2*width,1.2*width), getVal(this.yOffset, -0.2*height, 1.2*height));
      this.xOffset += spotlightSpeed;
      this.yOffset += spotlightSpeed;
    }
  
    show(){
      fill(0,255,0);
      circle(this.p.x, this.p.y, width/6);
    }
  }