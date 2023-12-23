class ScorchMark{
    constructor(x, y){
        this.p = createVector(x,y);
        this.life = 100;
    }

    update(){
        this.life -= 5;
    }

    show(){
        let colour = lerpColor(startColour, endColour, map(this.life, 100, 0, 0, 1));
        let opacity = int(map(this.life, 100, 0, 255, 0));
        fill(colour, opacity);
        let a = p5.Vector.sub(middle.p, this.p).heading();
        let r = p5.Vector.dist(middle.p, this.p);
        push();
        translate(middle.p.x, middle.p.y);
        rotate(a + PI);
        ellipse(r,0,5,10);
        pop();
    }
}