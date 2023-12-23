class Particle{
    constructor(x,y){
        this.p = createVector(x,y);
        this.isConnected = false;
    }

    connect(){
        this.isConnected = true;
    }

    show(){
        fill(255, 255, 0);
        circle(this.p.x, this.p.y, electrodeD);
        noFill();
    }
}