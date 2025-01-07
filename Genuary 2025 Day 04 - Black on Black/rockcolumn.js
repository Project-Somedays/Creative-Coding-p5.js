class RockColumn{
    constructor(){
      this.rocks = []
      for(let i = 0; i < 100; i++){
        for(let j = 0; j < 15; j++){
          let y = -height + i * 2 * height/50;
          this.rocks.push(this.makeRock(y, j));
        }
      }
    }
    
    makeRock(baseY, j){
      let y = baseY + random(-height/10, height/10);
      let r = random(width/10, width/8);
      let a = j*TWO_PI/5;
      let x = r * cos(a);
      let z = r * sin(a);
      let rockType = random() < 0.7;
      return {
        p : createVector(x,y,z),
        scl : random(0.25, 1.25),
        rotX: random(TWO_PI),
        rotY: random(TWO_PI),
        rotZ: random(TWO_PI),
        isRock: rockType,
      }
    }
    
    update(){
      for(let r of this.rocks){
        r.p.y -= diveRate;
      }
      
      // clean up
      let toAdd = 0;
      for(let i = this.rocks.length - 1; i >= 0; i--){
        if(this.rocks[i].p.y < -height){
          this.rocks.splice(i, 1);
          toAdd ++;
        }
      }
      
      for(let i = 0; i < toAdd; i++){
        this.rocks.push(this.makeRock(2*height, int(random(6))));
      }
    }
    
    show(){
        // stroke(255);
      for(let r of this.rocks){
        push()
        translate(r.p.x, r.p.y, r.p.z);
        rotateX(r.rotX);
        rotateY(r.rotY);
        rotateZ(r.rotZ);
        if(r.isRock){
            box(r.scl  * width/10);
        } else {
           cylinder(r.scl * width/50, r.scl * width/3, 7);
        }
        pop();
      }
    }
  }