class Flower{
    constructor(x,y, flowerImg){
      this.p = createVector(x,y);
      this.r = random(TAU);
      this.img = flowerImg;
      this.lerpCntrl = 0;
      this.lerpSlider = 0;
      this.life = flowerLifeFrames;
      this.isDead;
      this.opacity = 255;
    }
  
    update(){
      // if it hasn't finished growing yet, grow
      if(this.lerpCntrl <= 1 && this.life > 1/flowerLerpSpeed){
        this.lerpCntrl += flowerLerpSpeed;
      } 
      this.lerpSlider = easeInOutQuad(this.lerpCntrl);
      this.life --;
      
      if(this.life < 1/flowerLerpSpeed && this.lerpCntrl >= 0){
        this.lerpCntrl -= flowerLerpSpeed;
      }
      this.isDead = this.life <= 0;
      
    }
  
    show(){
      push();
        translate(this.p.x, this.p.y);
        rotate(this.r);
        scale(this.lerpSlider, this.lerpSlider);
        image(this.img, 0, 0, this.img.width*flowerScale, this.img.height*flowerScale);
      pop();
    };
    
  }