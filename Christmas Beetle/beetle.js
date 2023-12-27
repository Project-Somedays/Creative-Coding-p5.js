class Beetle{
    constructor(x, y, target){
      this.p = createVector(x,y);
      this.start = createVector(x,y);
      this.vel = p5.Vector.random2D().setMag(0.5)   ;
      this.target = target;
    }
  
    show(){
      // circle(this.p.x, this.p.y, 5);
      push();
      translate(this.p.x, this.p.y);
      rotate(this.vel.heading());
      image(bug, 0, 0, bug.width*bugScale, bug.height*bugScale);
      pop();
    }

    randomise(){
      this.vel = p5.Vector.random2D().setMag(0.5);
    }
  
    moveAtRandom(){
      this.p.add(this.vel);
    }
    
    mark(){
      this.start.set(this.p.x, this.p.y);
    }
    
    converge(){
      this.p.x = lerp(this.start.x, this.target.x, progress);
      this.p.y = lerp(this.start.y, this.target.y, progress);
    }
  
  }