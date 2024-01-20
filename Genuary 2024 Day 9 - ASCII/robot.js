class Robot{
    constructor(x,y){
      this.p = createVector(x,y);
      this.v = createVector(robotSpeed,0);
      this.laserA = HALF_PI;
      this.eyeLevel = this.p.y - height/4.9
    }
    
    restart(x,y){
      this.p.set(x,y);
    }
  
    update(){
      this.p.add(this.v);
      if(this.v.x === 0 && this.laserA >= -PI/12){
        this.laserA -= laserRate;
      }
    }

    showlaser(){
        stroke(255,0,0);
        strokeWeight(10);
        line(this.p.x, this.eyeLevel , this.p.x + width*cos(this.laserA), this.eyeLevel + width*sin(this.laserA));
        line(this.p.x + width/50, this.eyeLevel, this.p.x + width*cos(this.laserA), this.eyeLevel + width*sin(this.laserA));
    }
  
    show(){
      noStroke();
      fill(255);
      textSize(tSize*standardTextSizeProportion);
      text(robotString, this.p.x, this.p.y);
      if(this.v.x === 0) this.showlaser();  
    }
  }