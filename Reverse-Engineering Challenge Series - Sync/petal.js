class Petal{
    constructor(scale, offset, colour){
        this.scale = scale;
        this.offset = offset;
        this.toTip = this.scale*width/petalCount;
        this.r = this.toTip/3;
        this.col = colour;
        this.start = createVector(0,0);
        this.tip = createVector(this.toTip,0);
        this.right = createVector(this.r*cos(PI/6), this.r*sin(PI/3));
        this.left = createVector(this.r*cos(-PI/6), this.r*sin(-PI/3));
    }

    update(){
        this.offset += globRate;
    }

    show(a){
        for(let i = 0; i < 3; i++){
            push()
            translate(width/2, height/2);
            rotate(a + i*TWO_PI/3);
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
}

        // beginShape();
        //     curveVertex(this.start.x, this.start.y);
        //     curveVertex(this.start.x, this.start.y);
        //     curveVertex(this.left.x, this.left.y);
        //     curveVertex(this.tip.x, this.tip.y);
        //     curveVertex(this.tip.x, this.tip.y);
        // endShape();
        // beginShape();
        //     curveVertex(this.start.x, this.start.y);
        //     curveVertex(this.start.x, this.start.y);
        //     curveVertex(this.right.x, this.right.y);
        //     curveVertex(this.tip.x, this.tip.y);
        //     curveVertex(this.tip.x, this.tip.y);