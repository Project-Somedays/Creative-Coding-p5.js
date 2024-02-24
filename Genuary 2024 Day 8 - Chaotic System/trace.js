class Trace{
    constructor(col, traceArray){
      this.col = col;
      this.traceArray = traceArray;
    }
  
    show(){
      stroke(this.col);
      strokeWeight(3);
      noFill();
      beginShape();
      for(let t of this.traceArray){
        vertex(t.x, t.y);
      }
      endShape();
    }
  }