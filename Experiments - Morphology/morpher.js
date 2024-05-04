class Morpher{
    constructor(x,y, r, n, startSides, endSides, duration, rotRate, colour){
      this.pos = createVector(x,y);
      this.r = r;
      this.endLim = n;
      this.startSides = startSides;
      this.endSides = endSides;
      this.duration = duration;
      this.rotisseryRate = rotRate;
      this.startAngles = [];
      this.endAngles = [];
      this.isIncreasing = true;
      this.readyToMorph = true;
      this.morphFrame = 0;
      this.t = 0;
      this.colour = colour;
    }
  
    update(){
      this.t = 0.5*(sin(frameCount*TWO_PI/this.duration) + 1);
  
      if(this.t < 0.01 && this.readyToMorph){
        this.morphFrame = frameCount;
        if(this.isIncreasing && this.endSides < this.endLim) this.endSides ++;
        if(!this.isIncreasing && this.endSides > this.startSides) this.endSides --;
        if(this.endSides === this.endLim) this.isIncreasing = false;
        if(this.endSides === this.startSides) this.isIncreasing = true;
        this.morphFromTriangles(this.startSides, this.endSides);
    }
  
    this.readyToMorph = frameCount - this.morphFrame > 0.1*this.duration;
  
    }
  
    morphFromTriangles(){
      this.startAngles = [];
      for(let i = 0; i < this.startSides; i++){
        this.startAngles[i] = (i*TWO_PI/this.startSides);
      }
  
      this.endAngles = [];
      for(let i = 0; i < this.endSides; i++){
        this.endAngles[i] = (i*TWO_PI/this.endSides);
      }
  
      for(let i = 0; i < abs(this.endSides - this.startSides); i++){
        if(this.endSides > this.startSides){
          this.startAngles.unshift(0);
        }  else {
          this.endAngles.unshift(0);
        }
        
      }
    }

    show(){
      fill(this.colour);
      push();
      translate(this.pos.x, this.pos.y);
      beginShape();
      for(let i = 0; i < this.startAngles.length; i++){
        let a = lerp(this.startAngles[i], this.endAngles[i], this.t);
        vertex(this.r*cos(a + frameCount/this.rotisseryRate), this.r*sin(a + frameCount/this.rotisseryRate));
    }
      endShape(CLOSE);
      pop();

    }
  

    showOnTarget(target){     
        target.push();
        target.translate(this.pos.x, this.pos.y);
        target.beginShape();
        for(let i = 0; i < this.startAngles.length; i++){
            let a = lerp(this.startAngles[i], this.endAngles[i], this.t);
            target.vertex(this.r*cos(a + frameCount/this.rotisseryRate), this.r*sin(a + frameCount/this.rotisseryRate));
        }
        target.endShape(CLOSE);
        target.pop();     
    }

    showForshortened(){
      fill(frameCount%360, 255, 255, 200);
      // fill(255, 255, 0);
      push();
      translate(this.pos.x, this.pos.y);
      beginShape();
      for(let i = 0; i < this.startAngles.length; i++){
        let a = lerp(this.startAngles[i], this.endAngles[i], this.t);
        vertex(this.r*cos(a + frameCount/this.rotisseryRate), 0.25*this.r*sin(a + frameCount/this.rotisseryRate));
      }
      endShape(CLOSE);
    pop();
    }
  }