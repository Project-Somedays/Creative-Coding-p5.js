class Waxblob{
    constructor(){
        this.p = createVector(random(width), random(height));
        this.v = createVector(0,0);
        this.a = createVector(0,0);
        this.r = random(s/4, s);
        this.m = this.r**2; // larger blobs are heavier
        this.t = random(maxTemp);//map(this.p.y, 0, height, 0, maxTemp);
        this.weightForce = p5.Vector.mult(g, this.m);
    }

    applyForce(f){
        let _f = p5.Vector.div(f,this.m);
        this.a.add(_f);
    }
    
    changeTemp(){
        // linear at the moment
        this.t += map(this.p.y, 0, height, -1, 2);
        this.t = constrain(this.t, 0, maxTemp);
    }
    applyBouyancyForce(){
        this.applyForce(createVector(0,-1).setMag(this.m*map(this.t, 0, maxTemp, 0, maxBForce)))
    }
    
    update(){
        if(this.p.x > width || this.p.x < 0){
            this.v.x = -this.v.x;
        };
        // if(this.p.y > height || this.p.y < 0){
        //     this.v.y = -this.v.y;
        // }
        this.changeTemp(); // depending on how far away the heat source is
        this.applyBouyancyForce(); // depending on temperature
        this.applyForce(this.weightForce); // apply gravity
        this.v.add(this.a);
        this.p.add(this.v);
        this.p.y = constrain(this.p.y, 0, height); // don't let y pos go off the screen
        this.a.mult(0);
    }

    show(){
        circle(this.p.x, this.p.y, this.r);
    }
}