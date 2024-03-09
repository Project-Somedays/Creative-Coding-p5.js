class Petal{
    constructor(scale, offset, colour, petalPeriod){
        this.scale = scale;
        this.offset = offset;
        this.col = colour;
        this.toTip = this.scale*width/petalCount;
        this.r = this.toTip/3;
        this.start = createVector(this.toTip/10,0);
        this.tip = createVector(this.toTip,0);
        this.right = createVector(this.r*cos(PI/6), this.r*sin(PI/6));
        this.left = createVector(this.r*cos(-PI/6), this.r*sin(-PI/6));
        this.a = 0;
        this.petalPeriod = petalPeriod;
    }

    update(){
        let noiseXA = noiseZoom*(cos(this.petalPeriod*(globA - this.offset))+1);
        let noiseYA = noiseZoom*(sin(this.petalPeriod*(globA - this.offset))+1);
        this.a = map(noise(noiseXA, noiseYA), 0, 1, -TWO_PI, TWO_PI);
    }

    show(){
        push()
        translate(petalStackC.x, petalStackC.y);
        rotate(this.a);
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