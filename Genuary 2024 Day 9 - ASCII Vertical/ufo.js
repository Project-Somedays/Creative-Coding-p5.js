class UFO{
    constructor(startX,startY, endX, endY){
      this.start = createVector(startX, startY);
      this.end = createVector(endX, endY);
      this.p = createVector(startX, startY);
      this.progress = 0;
    }
    
    reset(){
      this.progress = 0;
    }
    update(){
      switch(currentState){
        case STATE.CONVERGING:
          break;
        case STATE.WAITING:
          this.progress += 1/phase2Frames;
          this.p = p5.Vector.lerp(this.start, this.end, easeInOutQuint(this.progress));
          break;
        case STATE.ABDUCTING:
          this.progress -= 1/phase3Frames;
          this.p = p5.Vector.lerp(this.start, this.end, easeInOutQuint(this.progress));
          break;
      }
    }
    show(){
      textSize(30);
      fill(255);
      stroke(255);
      text(UFOSTRING, this.p.x, this.p.y);
      
    }
  }
