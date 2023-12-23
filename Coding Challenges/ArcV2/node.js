class Node{
    constructor(x, y){
        this.p = createVector(x,y);
        this.v = p5.Vector.random2D().setMag(nodeSpeed);//this.getV();
    }

    update(){
        this.p.add(this.v);
        // this.v = this.getV();
        this.wrap();
    }

    getV(){
        let nVal = noise(this.p.x/noiseZoom, this.p.y/noiseZoom);
        let a = map(nVal,0,1,-TWO_PI,TWO_PI);
        return p5.Vector.fromAngle(a).setMag(nodeSpeed);
    }

    show(fillColour){
        fill(fillColour);
        circle(this.p.x, this.p.y, 5);
    }

    wrap(){
        if(this.p.x < -margin){
            this.p.x = width + margin;
            this.p.y = random(margin, height + margin);
        }
        if(this.p.x > width + margin){
            this.p.x = -margin;
            this.p.y = random(-margin, height + margin);
        }
        if(this.p.y < -margin){
            this.p.y = height + margin;
            this.p.x = random(-margin, width + margin);
        }
        if(this.p.y > height + margin){
            this.p.y = -margin;
            this.p.x = random(-margin, width + margin);
        }
    }
}