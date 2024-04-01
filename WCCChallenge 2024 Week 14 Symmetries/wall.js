class Wall{
    constructor(startX, startY, endX, endY){
      this.start = createVector(startX, startY);
      this.end = createVector(endX, endY);
      this.isHit = false;
      this.wallLength = p5.Vector.dist(this.start, this.end);
      this.midPt = p5.Vector.lerp(this.start, this.end, 0.5);
    }
  
    show(layer){
    //   if(this.isHit) strokeWeight(5);
      layer.line(this.start.x, this.start.y, this.end.x, this.end.y);
      
      // text(round(this.wallLength,1), this.midPt.x, this.midPt.y)
    }
  }


function generateWalls(){
  walls = [];
  walls.push(new Wall(0,0,w,0));
  walls.push(new Wall(w,0,w,w));
  walls.push(new Wall(w,w,0,w));
  walls.push(new Wall(0,w,0,0));
}


function showWalls(layer){
  layer.stroke(255);
  for(let w of walls){
    w.show(layer);
  }
}