class Wall{
    constructor(startX, startY, endX, endY){
      this.start = createVector(startX, startY);
      this.end = createVector(endX, endY);
      this.isHit = false;
    }
  
    show(layer){
    //   if(this.isHit) strokeWeight(5);
      layer.line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
  }