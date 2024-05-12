class CircCollection{
    constructor(){
      this.c = createVector(0, 0);
      this.r = r;
      this.a = 0;
      this.colours = new Array(7).fill(random(randPalette));
      console.log(this.colours);
      
      this.noiseOffsetAngle = random(10000);
      this.noiseOffsetX = random(10000);
      this.noiseOffsetY = random(10000);
      this.noiseOffsetR = random(10000);
      this.noiseOffsetSpread = random(10000);
      this.noiseOffsetSmallR = random(10000);
      this.brushes;
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
      this.brushes = calculateInnerCircles(this.c.x, this.c.y, this.r, this.spreadRScl, this.smallRScl, this.a, this.colours);
    }
  
    show(layer){
      
      for(let b of this.brushes){
        layer.circle(b.p.x,b.p.y, b.r*2);
      }
     
    }
  
  }
  
  function calculateInnerCircles(cx, cy, wholeCircleR, spreadR, smallCircleR, rotAngle, colours) {
    let circs = [];
    for (let i = 0; i < 6; i++) {
      let angle = i * TWO_PI / 6 + rotAngle;
      let xPos = cos(angle) * wholeCircleR * spreadR;
      let yPos = sin(angle) * wholeCircleR * spreadR;
      circs[i] = {p: createVector(cx + xPos, cy + yPos), r: wholeCircleR*0.5*smallCircleR, colour: colours[i]};
    }
    circs.push({p: createVector(cx,cy), r: wholeCircleR*0.5*smallCircleR, colour: colours[6]});
    
    return circs;
  }
  
  
 
  
  