class Brush{
    constructor(xOff, yOff, bSizeOff, aOff){
      this.p = createVector(0,0);
      this.xOff = xOff;
      this.yOff = yOff;
      this.bSizeOff = bSizeOff;
      this.r;
      this.a;
      this.aOff = aOff;
    }
  
    update(){
      let x = map(noise(this.xOff + globOff), 0, 1, -width/4, 1.25*width);
      let y = map(noise(this.yOff + globOff), 0, 1, -height/4, 1.25*height);
      this.a = map(noise(this.aOff + globOff), 0, 1, radians(-aChangeMax), radians(aChangeMax));
      this.r = map(noise(this.bSizeOff + globOff),0,1,bMin,bMax);
      this.p.set(x,y);
    }

    show(){
        stroke(0);
        noFill();
        circle(this.p.x, this.p.y, this.r);
    }
  }