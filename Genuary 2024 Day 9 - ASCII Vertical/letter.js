class Letter{
    constructor(startx,starty, tx, ty){
      this.start = createVector(startx,starty);
      this.p = createVector(startx,starty);
      this.target = createVector(tx, ty);
      this.letter = random(charSet);
      this.yOffset = map(this.target.y, 0.2*height, 0.8*height, 0, TWO_PI);
      this.xOffset = map(this.target.x, 0.25*width, 0.75*width, 0, TWO_PI);
      this.offset = cycleOffset*this.yOffset + (1-cycleOffset)*this.xOffset;
      this.abductionDelay = map(this.target.y, 0, height, 0, 50);
      this.c = 255;
    }
  
    update(){
      this.c = map(cos(cycleRate*(this.offset + radians(currentFrame - phase1Frames))), -1, 1, 0, 255);
      switch(currentState){
        case STATE.CONVERGING:
          // this.c = 255;
          this.p = p5.Vector.lerp(this.start, this.target, convergeEasing);
          break;
        case STATE.WAITING:
          break;
        case STATE.ABDUCTING:
          // this.c = 255;
          // let aProgress = abductionProgress - map(currentFrame - this.abductionDelay)
          this.p = p5.Vector.lerp(this.target, ufo.p, abductEasing);
          break;
      }
    }
  
    show(){
      fill(this.c);
      stroke(this.c);
      text(this.letter, this.p.x, this.p.y);
    }
  }