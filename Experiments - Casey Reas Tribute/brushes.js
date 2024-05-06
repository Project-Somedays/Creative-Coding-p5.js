class CircCollection{
    constructor(){
      this.c = createVector(0, 0);
      this.r = r;
      this.a = 0;
      this.brushes = calculateInnerCircles(this.c.x, this.c.y, 2*this.r, 10);
      this.noiseOffsetAngle = random(10000);
      this.noiseOffsetX = random(10000);
      this.noiseOffsetY = random(10000);
      this.noiseOffsetR = random(10000);
      this.noiseOffsetSpread = random(10000);
      this.noiseOffsetSmallR = random(10000);
      this.update(); 
    }
  
    update(){
      let x = getVal(this.noiseOffsetX,-cnv.width*0.1, 1.1*cnv.width);
      let y = getVal(this.noiseOffsetY,-cnv.height*0.1, 1.1*cnv.height);
      this.a = getVal(this.noiseOffsetAngle,-TWO_PI, TWO_PI);
      this.r = getVal(this.noiseOffsetR, 0.1*r, 3*r);
      this.smallRScl = getVal(this.noiseOffsetSmallR, 0.25, 2);
      this.spreadRScl = getVal(this.noiseOffsetSpread, 0.25, 3 );
      this.c.set(x,y);
      this.brushes = calculateInnerCircles(this.c.x, this.c.y, this.r, this.spreadRScl, this.smallRScl, this.a);
    }
  
    show(layer){
      
      for(let b of this.brushes){
        layer.circle(b.p.x,b.p.y, b.radius*2);
      }
     
    }
  
  }
  
  
 
  
  