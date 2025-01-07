class Sub{
    constructor(){
      this.r = 0;
      this.a = 0;
      this.y = 0;
      this.offset = random(1000, 10000);
    }
  
    update(){
      this.r = map(noise(frameCount * 0.003 + this.offset), 0, 1, width/3, width);
      this.a = map(noise(frameCount * 0.001 + this.offset + 1000), 0, 1, -TWO_PI, TWO_PI);
      this.y = map(noise(frameCount * 0.005 + this.offset + 2000), 0, 1, -height/2, height/2);
    }
  
    show(){
      fill('#E7A63AFF');
      noStroke();
      push();
      rotateY(this.a);
      translate(-this.r, this.y, 0);
      rotateY(-HALF_PI);
      model(submersible);
      pop();
    }
  }