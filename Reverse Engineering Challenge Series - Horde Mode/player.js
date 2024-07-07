class Player{
    constructor(gun){
      this.p = createVector(width/2, height*0.9);
      this.health = 100;
      this.gun = gun;
      this.groupSize = 1;
    }
  
    update(){
      this.p.x = mouseX;
      this.gun.fire(this.p.x, this.p.y);
    }
  
    show(){
      fill(0,255,0);
      circle(this.p.x, this.p.y, width/20);
    }
  
    
  }