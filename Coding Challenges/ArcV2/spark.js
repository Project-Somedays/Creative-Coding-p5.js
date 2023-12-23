class Spark{
    constructor(x,y){
        this.p = createVector(x,y);
        this.prev = this.p.copy();
        this.v = p5.Vector.random2D().setMag(sparkVel);
        this.temp = 100;
        this.isDone = false;
    }

    updateAndShow(){
        this.temp -= coolingRate;
        let colour = lerpColor(startColour, endColour, map(this.temp, 100, 0, 0, 1));
        this.v.add(g);
        this.p.add(this.v);
        stroke(colour);
        if(sparksOn) line(this.p.x, this.p.y, this.prev.x, this.prev.y);
        this.prev = this.p.copy();
        this.isDone = this.p.y > height || this.temp <= 0;
    }s
}