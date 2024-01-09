class DrinkCycle{
    constructor(x,y,d, drinkRate){
    this.p = createVector(x,y);
    this.d = d
    this.a = PI*startAngleFrac;
    this.drinkRate = drinkRate;
    }

    update(){
    //   this.p.set(mouseX, mouseY);
    this.a += this.drinkRate;
    if(this.a > PI*endAngleFrac){
        this.a = PI*startAngleFrac;
    }
    }

    show(){
        fill(136, 8, 8);
    push();
        translate(this.p.x, this.p.y);
        circle(0.5*this.d*cos(this.a), 0.5*this.d*sin(this.a), 20);   
    pop();
    }
    
}