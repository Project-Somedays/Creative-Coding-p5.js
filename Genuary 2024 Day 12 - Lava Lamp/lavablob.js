class LavaBlob{
    constructor(x,y, r, temp){
      this.p = createVector(x,y);
      this.v = createVector(0,0);
      this.a = createVector(0,0);
      this.r = r;
      this.temp = temp;
  
    }
  
    applyForce(f){
      this.a.add(f);
    }
  
    applyHeat(){
      this.temp += 3*heatingFunction(map(this.p.y,-height*0.1,height,0,1));
      if(this.temp >= 100){
        this.temp = 100;
      }
      if(this.temp < 0){
        this.temp = 0;
      }
    }
  
    applyBuoyancyForce(){
      this.applyForce(createVector(0,-map(this.temp, 0, 100, 0, 1.25*G)));  
    }
  
    update(){
      this.v.add(this.a);
      this.p.add(this.v);
      this.a.mult(0);
      this.temp -= map(this.p.y,0, height, 1, 0); // at the top of the tank, lose max temp
      this.p.y = constrain(this.p.y, -0.25*height, 1.25*height);
    }
  
    show(){
      fill(lerpColor(color(0,0,255), color(255,0,0), this.temp));
      circle(this.p.x, this.p.y, 2*this.r);
      fill(255);
      text(round(this.temp,2), this.p.x, this.p.y);
    }
  }