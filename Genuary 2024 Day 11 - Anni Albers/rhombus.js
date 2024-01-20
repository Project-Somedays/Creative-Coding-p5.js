class Rhombus{
    constructor(x,y, orientation, colour){
      this.orientation = orientation;
      this.p = createVector(x,y);
      this.customScale = random(0.8, 1.2);
      this.customRotation = random(-PI/12, PI/12);
      this.colour = colour;
    }
  
    show(){
      fill(this.colour);
      push();
      translate(this.p.x, this.p.y);
      if(this.orientation === ORIGHT){
        scale(-1,1);
      }
      if(this.orientation === OTOP){
        rotate(TWO_PI/3);
      }
      
      // stroke(0);
      // strokeWeight(10);
  
      //randomising
      // scale(this.customScale);
      // rotate(this.customRotation);
  
      beginShape();
      for(let v of vertices){
        vertex(v.x, v.y);
      }
      endShape(CLOSE);
      // circle(0, 0, 10);
      pop();
    }
  
    
  }

  /*
  show(target){
      target.push();
      target.translate(this.p.x, this.p.y);
      if(this.orientation === ORIGHT){
        target.scale(-1,1);
      }
      if(this.orientation === OTOP){
        target.rotate(TWO_PI/3);
      }
      target.fill(this.colour);
      // stroke(0);
      // strokeWeight(10);
  
      //randomising
      target.scale(this.customScale);
      target.rotate(this.customRotation);
  
      target.beginShape();
      for(let v of vertices){
        target.vertex(v.x, v.y);
      }
      target.endShape(CLOSE);
      // circle(0, 0, 10);
      target.pop();
    }
    */