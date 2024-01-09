class Spotlight{
    constructor(){
      this.p = createVector(0,0);
      this.xOffset = random(1000);
      this.yOffset = random(1000);
    }
  
    update(){
      this.p.set(getVal(this.xOffset,0,height), getVal(this.yOffset, 0, height));
      this.xOffset += spotlightSpeed;
      this.yOffset += spotlightSpeed;
    }
  
    show(){
      fill(0,255,0);
      circle(this.p.x, this.p.y, width/6);
    }
  }