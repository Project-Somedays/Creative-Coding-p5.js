class Tribesman{
    constructor(x,y, colour){
        this.p = createVector(x,y);
        this.colour = colour;
    }

    update(target){
        let step = p5.Vector.sub(target,p);
        this.p.add(step);
    }

    show(){
        circle(this.p.x, this.p.y, s)
    }
}