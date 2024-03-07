class Petal{
    constructor(scale, offset, colour){
        this.scale = scale;
        this.offset = offset;
        this.toTip = this.scale*width/petalCount;
        this.r = this.toTip/3;
        this.base = this.toTip/10;
        this.col = colour;
        this.start = createVector(this.base,0);
        this.tip = createVector(this.toTip,0);
        this.right = createVector(this.r*cos(PI/6), this.r*sin(PI/3));
        this.left = createVector(this.r*cos(-PI/6), this.r*sin(-PI/3));
    }

    update(){
        this.offset += globRate;
    }

    show(a){
        push()
        translate(width/2, height/2);
        rotate(a + this.offset);
        fill(this.col);
        beginShape();
            curveVertex(this.start.x, this.start.y);
            curveVertex(this.start.x, this.start.y);
            curveVertex(this.left.x, this.left.y);
            curveVertex(this.tip.x, this.tip.y);
            curveVertex(this.tip.x, this.tip.y);
        endShape();
        beginShape();
            curveVertex(this.start.x, this.start.y);
            curveVertex(this.start.x, this.start.y);
            curveVertex(this.right.x, this.right.y);
            curveVertex(this.tip.x, this.tip.y);
            curveVertex(this.tip.x, this.tip.y);
        endShape();
        pop();
    }
}